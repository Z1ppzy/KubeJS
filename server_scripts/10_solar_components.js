// priority: 100
// requires: solarflux
// ============================================================================
//  Рецепты компонентов.
//
//  Вся зависимость от чужих модов сидит ЗДЕСЬ. Если какой-то ID не совпал —
//  сломается один компонент, а не вся цепочка панелей.
//  Правится в 00_solar_globals.js, применяется через /reload.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) {
    console.error('[SolarFlux] global.SOLAR отсутствует. Проверь, что startup_scripts/00_solar_globals.js на месте, и перезапусти сервер — /reload startup-скрипты не перечитывает.')
    return
  }
  const M = S.mod
  const T = S.tag

  // --- I. Solar Lens ---------------------------------------------------------
  // Гейт: никакой. Чистая ваниль, доступно в первый день.
  // Выход 2 шт. — иначе низкие тиры станут неоправданно дорогими.
  event.shaped(Item.of(S.lens, 2), [
    'GCG',
    'CRC',
    'GCG'
  ], {
    G: T.glassPane,
    C: T.copper,
    R: T.redstone
  }).id('kubejs:solar/component_lens')

  // --- II. Photon Capacitor --------------------------------------------------
  // Гейт: Powah (Energizing Orb) + Metallurgic Infuser из Mekanism.
  event.shaped(S.capacitor, [
    'ELE',
    'LCL',
    'ESE'
  ], {
    E: M.energizedSteel,
    L: S.lens,
    C: M.circuitAdv,
    S: T.steel
  }).id('kubejs:solar/component_capacitor')

  // --- III. Quantum Solar Matrix ---------------------------------------------
  // Гейт: AE2 + Industrial Foregoing + Modern Industrialization одновременно.
  // Самый тяжёлый шаг в цепочке — он и должен таким быть.
  event.shaped(S.matrix, [
    'KDK',
    'PFP',
    'KSK'
  ], {
    K: S.capacitor,
    D: M.miDigital,
    P: M.procEng,
    F: M.frameAdv,
    S: M.miStainless
  }).id('kubejs:solar/component_matrix')

  // --- IV. Arcane Solar Core -------------------------------------------------
  // Гейт: Ars Nouveau + Occultism + Mystical Agriculture.
  // Версия для Enchanting Apparatus лежит в 30_solar_stations.js
  event.shaped(S.arcane, [
    'BMB',
    'QIQ',
    'BWB'
  ], {
    B: M.sourceBlock,
    M: M.essManipulation,
    Q: S.matrix,
    I: M.iesnium,
    W: M.wildenTribute
  }).id('kubejs:solar/component_arcane')

  // --- V. Draconic Solar Core ------------------------------------------------
  // Гейт: Draconic Evolution, эндгейм.
  // Версия для Fusion Crafting лежит в 30_solar_stations.js
  event.shaped(S.draconic, [
    'AWA',
    'RCR',
    'ASA'
  ], {
    A: M.awakened,
    W: M.coreAwakened,
    R: S.arcane,
    C: M.chaosShard,
    S: M.singularity
  }).id('kubejs:solar/component_draconic')
})
