// priority: 20
// requires: powah
// ============================================================================
//  Гейты Powah — вписываем энергетику Powah в прогрессию сборки.
//
//  ПРОБЛЕМА: Powah — «энергетический остров». Реакторы тирятся сами в себе
//  (starter→…→nitro, каждый = прошлый тир + конденсатор + уранинит), и весь
//  остальной пак для прокачки не нужен. Плюс числа генерации в дефолте злые
//  (nitro = 500 000 FE/t — обесценивает и Mekanism, и нашу Solar Flux-пирамиду).
//
//  РЕШЕНИЕ — две ортогональные правки:
//
//  1) ЧИСЛА -> config/powah.json5  (НЕ KubeJS, правится вручную, рестарт).
//     Раздел "reactors" -> "generation_rates", срезано ~2-3.5x на верхах:
//         blazing  10000 -> 6000
//         niotic   25000 -> 12000
//         spirited 100000 -> 40000
//         nitro    500000 -> 150000   (было ~15x sp_8, стало ~4.5x)
//     starter/basic/hardened НЕ трогаем — ранняя энергия должна быть доступной.
//
//  2) КРОСС-МОД ГЕЙТ -> этот файл. Центральный слот верхних реакторов
//     (был уранинит) заменяем предметом соседней ветки. Низкие тиры остаются
//     лёгкими, верхние требуют потрогать другие моды. Форма рецепта не меняется:
//         rlr
//         lGl   G = гейт-предмет вместо уранинита
//         rlr
//     Гейты по возрастанию:
//         niotic   -> инженерный процессор AE2      (мид-AE2)
//         spirited -> ultimate-схема Mekanism       (мид-поздний Mekanism)
//         nitro    -> ядро виверны Draconic         (эндгейм DE)
//
//  Каждый гейт под Platform.isLoaded: нет мода — остаётся дефолтный рецепт.
// ============================================================================

ServerEvents.recipes(event => {

  // tier: id тира, prev: реактор прошлого тира, cap: конденсатор тира,
  // gate: кросс-мод предмет в центр, mod: мод, который должен быть загружен
  const gateReactor = (tier, prev, cap, gate, mod) => {
    if (!Platform.isLoaded(mod)) return
    event.remove({ id: `powah:reactor_${tier}` })
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

  gateReactor('niotic',   'blazing', 'niotic',   'ae2:engineering_processor',        'ae2')
  gateReactor('spirited', 'niotic',  'spirited', 'mekanism:ultimate_control_circuit', 'mekanism')
  gateReactor('nitro',    'spirited','nitro',    'draconicevolution:wyvern_core',     'draconicevolution')
})
