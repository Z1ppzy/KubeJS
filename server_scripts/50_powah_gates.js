// priority: 20
// requires: powah
// ============================================================================
//  Powah — полный проход по балансу.
//
//  ПРОБЛЕМА 1: вся тирность Powah висит на ванильных камнях —
//  blaze rod -> алмаз -> изумруд -> незер-звезда. С Mystical Agriculture
//  в паке это всё фармится семенами, то есть гейта фактически нет.
//
//  ПРОБЛЕМА 2: Powah — «энергетический остров»: качаешься только внутри него,
//  остальной пак не нужен. Плюс реакторы в дефолте дают 500 000 FE/t.
//
//  ПРОБЛЕМА 3: солнечные панели Powah подрезают Solar Flux. Powah starter =
//  20 FE/t против sp_1 = 1 FE/t, то есть стартовый солярник Powah в 20 раз
//  лучше стартового SFR — вся наша пирамида обесценивается на раннем этапе.
//
//  РЕШЕНИЕ — три точки, все выбраны как «узкие горлышки»:
//
//  1) КРИСТАЛЛЫ (energizing) — главный choke point. Их едят капаситоры,
//     энергоячейки, фурнаторы, магматоры, термо, эндер-ячейки, батареи,
//     кабели. Гейтим кристаллы -> гейтим весь верхний Powah одной правкой.
//     Лестница сплавов Mekanism ложится на лестницу тиров Powah 1:1:
//         niotic   (алмаз)        + infused alloy
//         spirited (изумруд)      + reinforced alloy
//         nitro    (незер-звезда) + atomic alloy
//     Стоимость энергии в орбе НЕ трогаем — гейт, а не гринд.
//
//  2) ФОТОПАНЕЛЬ (photoelectric_pane) — её ест только solar_panel_starter,
//     а старшие соляры цепляются за младшие. Значит одна правка гейтит всю
//     солнечную линейку Powah. В центр вместо стекла — фотоэлемент Solar Flux.
//     Тематично: солярник Powah строится ВОКРУГ нашего фотоэлемента, две
//     солнечные системы больше не конкурируют, а стыкуются.
//
//  3) РЕАКТОРЫ — сильнейший пассивный генератор пака, поэтому им отдельный
//     гейт поверх кристального. Центральный слот (был уранинит) -> предмет
//     соседней ветки: AE2 -> Mekanism -> Draconic.
//
//  ЧИСЛА -> config/powah.json5 (НЕ KubeJS, рестарт). Раздел reactors ->
//  generation_rates срезан ~2-3.5x на верхах:
//      blazing 10000->6000, niotic 25000->12000,
//      spirited 100000->40000, nitro 500000->150000 (было ~15x sp_8, стало ~4.5x)
//  starter/basic/hardened не трогаем — ранняя энергия должна быть доступной.
//  Фурнаторы/магматоры оставлены как есть: они жрут топливо, потолок 40k —
//  это честный активный генератор.
//
//  ВАЖНО про удаление: рецепты Powah лежат в data/powah/recipe/crafting/...,
//  то есть их ID — powah:crafting/<имя>, а не powah:<имя>. Чтобы не зависеть
//  от путей, удаляем по паре тип+выход — так рецепт находится всегда.
// ============================================================================

ServerEvents.recipes(event => {

  // ВАЖНО про Rhino: объявлять const/let ВНУТРИ блока (if/for) нельзя —
  // движок поднимает такие объявления в область функции как var, и при
  // повторном вызове колбэка падает с "redeclaration of var". Поэтому все
  // хелперы объявляем строго здесь, на верхнем уровне.

  // tier: имя кристалла, energy: стоимость в орбе (как в дефолте),
  // base: исходные ингредиенты, alloy: сплав-гейт, count: выход
  const gateCrystal = (tier, energy, base, alloy, count) => {
    event.remove({ type: 'powah:energizing', output: `powah:crystal_${tier}` })
    event.custom({
      type: 'powah:energizing',
      energy: energy,
      ingredients: base.concat([{ item: alloy }]),
      result: { count: count, id: `powah:crystal_${tier}` }
    }).id(`kubejs:powah/crystal_${tier}`)
  }

  // ==========================================================================
  //  1. КРИСТАЛЛЫ — тирный гейт через лестницу сплавов Mekanism
  // ==========================================================================
  if (Platform.isLoaded('mekanism')) {

    gateCrystal('niotic', 300000,
      [{ tag: 'c:gems/diamond' }],
      'mekanism:alloy_infused', 1)

    gateCrystal('spirited', 1000000,
      [{ tag: 'c:gems/emerald' }],
      'mekanism:alloy_reinforced', 1)

    // nitro в дефолте даёт сразу 16 штук — выход сохраняем, гейт ставим на вход
    gateCrystal('nitro', 20000000, [
      { tag: 'c:nether_stars' },
      { tag: 'c:storage_blocks/redstone' },
      { tag: 'c:storage_blocks/redstone' },
      { item: 'powah:blazing_crystal_block' }
    ], 'mekanism:alloy_atomic', 16)
  }

  // ==========================================================================
  //  2. ФОТОПАНЕЛЬ — вся солнечная линейка Powah через фотоэлемент Solar Flux
  // ==========================================================================
  if (Platform.isLoaded('solarflux')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'powah:photoelectric_pane' })
    event.shaped('powah:photoelectric_pane', [
      'dld',
      'lCl',
      'dld'
    ], {
      d: 'powah:dielectric_paste',
      l: 'minecraft:lapis_lazuli',
      C: 'solarflux:photovoltaic_cell_1'
    }).id('kubejs:powah/photoelectric_pane')
  }

  // ==========================================================================
  //  3. РЕАКТОРЫ — отдельный гейт поверх кристального
  // ==========================================================================
  // tier: тир реактора, prev: реактор прошлого тира, gate: кросс-мод предмет,
  // mod: мод, без которого гейт не ставим (остаётся дефолтный рецепт)
  const gateReactor = (tier, prev, gate, mod) => {
    if (!Platform.isLoaded(mod)) return
    event.remove({ type: 'minecraft:crafting_shaped', output: `powah:reactor_${tier}` })
    event.shaped(Item.of(`powah:reactor_${tier}`, 4), [
      'rlr',
      'lGl',
      'rlr'
    ], {
      r: `powah:reactor_${prev}`,
      l: `powah:capacitor_${tier}`,
      G: gate
    }).id(`kubejs:powah/reactor_${tier}`)
  }

  gateReactor('niotic',   'blazing',  'ae2:engineering_processor',         'ae2')
  gateReactor('spirited', 'niotic',   'mekanism:ultimate_control_circuit', 'mekanism')
  gateReactor('nitro',    'spirited', 'draconicevolution:wyvern_core',     'draconicevolution')
})
