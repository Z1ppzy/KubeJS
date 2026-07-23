// priority: 45
// requires: solarflux
// ============================================================================
//  Панели Draconic Evolution — ТОЛЬКО через Fusion Crafting.
//
//  Тематика: панели дракона куются в драконьей кузне. Катализатор кладётся
//  в Fusion Crafting Core, остальное — в инжекторы (techLevel рецепта требует
//  инжекторы соответствующего тира — это и есть гейт прогрессии DE).
//
//  Пирамида продолжает T1-T8 без изломов:
//      wyvern   =  65 536 FE/t = 2x sp_8      <- 2 панели sp_8
//      draconic = 262 144 FE/t = 4x wyvern    <- 4 панели wyvern
//      chaotic  = 524 288 FE/t = 2x draconic  <- 2 панели draconic
//  Панель всегда собирается из панелей предыдущего тира: конверсия энергии
//  честная, добавленную стоимость дают ядра DE и наши компоненты.
//
//  Дефолтные рецепты SFR (solarflux:solar_panels/draconicevolution/*)
//  отключаются в config/solarflux/recipes.cfg — из KubeJS их не убрать.
//
//  Схема JSON сверена с jar DE 1.21.1-3.1.4: catalyst / ingredients
//  [{consume, ingredient}] / result {id, count} / techLevel / totalEnergy.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) {
    console.error('[SolarFlux] global.SOLAR отсутствует. Проверь, что startup_scripts/00_solar_globals.js на месте, и перезапусти сервер — /reload startup-скрипты не перечитывает.')
    return
  }
  if (!Platform.isLoaded('draconicevolution')) return
  const M = S.mod
  const D = S.dePanels
  const C = t => S.cells[t - 1]

  const item = id => ({ consume: true, ingredient: { item: id } })

  const fusion = (id, catalyst, result, techLevel, totalEnergy, ingredients) => {
    event.custom({
      type: 'draconicevolution:fusion_crafting',
      catalyst: { item: catalyst },
      ingredients: ingredients.map(item),
      result: { count: 1, id: result },
      techLevel: techLevel,
      totalEnergy: totalEnergy
    }).id(id)
  }

  // --- Панель Виверны: 2x sp_8 + ядра виверны + наша матрица -----------------
  fusion('kubejs:solar/sp_de_wyvern', S.panels[7], D.wyvern, 'wyvern', 8000000, [
    S.panels[7],
    M.coreWyvern, M.coreWyvern,
    M.energyCoreWyvern,
    C(5), C(5),
    S.matrix
  ])

  // --- Панель Дракона: 4x wyvern + пробуждённое ядро + арканное ядро ---------
  fusion('kubejs:solar/sp_de_draconic', D.wyvern, D.draconic, 'draconic', 32000000, [
    D.wyvern, D.wyvern, D.wyvern,
    M.coreAwakened,
    M.energyCoreDraconic,
    C(6), C(6),
    S.arcane
  ])

  // --- Панель Хаоса: 2x draconic + хаотическое ядро (пост-хаос-дракон) -------
  fusion('kubejs:solar/sp_de_chaotic', D.draconic, D.chaotic, 'chaotic', 128000000, [
    D.draconic,
    M.coreChaotic,
    M.chaosShard, M.chaosShard,
    M.energyCoreChaotic,
    C(6), C(6),
    S.draconic
  ])

  // --- Разбор в верстаке, возврат половины вложенных панелей -----------------
  // (как у T2-T8: цикл крафт/разбор всегда убыточен — ядра сгорают)
  event.shapeless(S.panels[7], [D.wyvern]).id('kubejs:solar/sp_de_wyvern_dismantle')
  event.shapeless(Item.of(D.wyvern, 2), [D.draconic]).id('kubejs:solar/sp_de_draconic_dismantle')
  event.shapeless(D.draconic, [D.chaotic]).id('kubejs:solar/sp_de_chaotic_dismantle')
})
