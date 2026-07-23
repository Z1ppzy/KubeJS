// priority: 35
// requires: solarflux
// ============================================================================
//  Апгрейды солнечных панелей.
//
//  Дефолтные рецепты (булыжник, поршни, часы, глина...) отключаются в
//  config/solarflux/recipes.cfg — из KubeJS их не убрать.
//
//  Принцип: рецепт РАССКАЗЫВАЕТ функцию апгрейда предметом того мода,
//  который делает то же самое:
//      Рассеивание   -> Передатчик игрока Powah (буквально та же механика)
//      Зарядка блока -> Телепорт-ядро Mekanism (беспроводная передача)
//      Раздача машинам -> лазеры LaserIO
//      Печь          -> Пылающее покрытие SFR + пылающий кристалл Powah
//      Эффективность -> Фотогальванический композит Ender IO
//      Ёмкость       -> Базовый конденсатор Ender IO
//      Скорость      -> Флюикс AE2 + заряженная сталь Powah
//      ME-сеть       -> Приёмник энергии AE2
//
//  Экономика по лимитам установки (из кода SFR):
//      efficiency x20, capacity x10, transfer x10  -> массовые, выход 2
//      traversal / dispersive / furnace / charging / ae2 x1 -> штучные, выход 1
//  Шаблон-заготовка (blank) нужна каждому -> выход 4, в сердце наша линза.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) {
    console.error('[SolarFlux] global.SOLAR отсутствует. Проверь, что startup_scripts/00_solar_globals.js на месте, и перезапусти сервер — /reload startup-скрипты не перечитывает.')
    return
  }
  const M = S.mod
  const T = S.tag
  const U = S.upgrades

  // --- Шаблон улучшения: железная пластина с линзой ---------------------------
  event.shaped(Item.of(U.blank, 4), [
    'IGI',
    'GLG',
    'IGI'
  ], {
    I: T.iron,
    G: T.glassPane,
    L: S.lens
  }).id('kubejs:solar/upgrade_blank')

  // ==========================================================================
  //  МАССОВЫЕ (ставятся пачками, выход 2)
  // ==========================================================================

  // Эффективность (x20): фотогальванический композит Ender IO + изумрудное стекло
  event.shaped(Item.of(U.efficiency, 2), [
    'ECE',
    'CBC',
    'ECE'
  ], {
    E: S.sfr.emeraldGlass,
    C: M.pvComposite,
    B: U.blank
  }).id('kubejs:solar/upgrade_efficiency')

  // Ёмкость (x10): конденсаторы Ender IO на редстоуновой обвязке
  event.shaped(Item.of(U.capacity, 2), [
    'RCR',
    'CBC',
    'RCR'
  ], {
    R: T.redstone,
    C: M.capBasic,
    B: U.blank
  }).id('kubejs:solar/upgrade_capacity')

  // Скорость передачи (x10): флюикс-проводники в заряженной стали
  event.shaped(Item.of(U.transfer, 2), [
    'FSF',
    'SBS',
    'FSF'
  ], {
    F: M.fluix,
    S: M.energizedSteel,
    B: U.blank
  }).id('kubejs:solar/upgrade_transfer')

  // ==========================================================================
  //  ШТУЧНЫЕ (x1 на панель, выход 1)
  // ==========================================================================

  // Раздача машинам: лазерный узел LaserIO — панель сама светит энергией
  event.shaped(U.traversal, [
    ' L ',
    'CBC',
    ' G '
  ], {
    L: M.laserConnector,
    C: M.cardEnergy,
    G: M.logicChip,
    B: U.blank
  }).id('kubejs:solar/upgrade_traversal')

  // Рассеивание (заряжает игроков рядом): передатчик игрока Powah
  event.shaped(U.dispersive, [
    ' T ',
    'PBP',
    ' E '
  ], {
    T: M.playerTransmitter,
    P: M.bindingCard,
    E: T.ender,
    B: U.blank
  }).id('kubejs:solar/upgrade_dispersive')

  // Зарядка блока (беспровод на 16 блоков): телепорт-ядро Mekanism
  event.shaped(U.charging, [
    ' K ',
    'CBC',
    ' E '
  ], {
    K: M.teleportCore,
    C: M.circuitElite,
    E: T.ender,
    B: U.blank
  }).id('kubejs:solar/upgrade_charging')

  // Печь: пылающее покрытие SFR + пылающий кристалл Powah
  event.shaped(U.furnace, [
    ' F ',
    'ZBZ',
    ' C '
  ], {
    F: 'minecraft:furnace',
    Z: S.sfr.blazingCoating,
    C: M.crystalBlazing,
    B: U.blank
  }).id('kubejs:solar/upgrade_furnace')

  // Подключение к ME-сети: приёмник энергии на кварцевом волокне
  event.shaped(U.ae2, [
    ' A ',
    'QBQ',
    ' F '
  ], {
    A: M.energyAcceptor,
    Q: M.quartzFiber,
    F: M.fluix,
    B: U.blank
  }).id('kubejs:solar/upgrade_ae2')
})
