// priority: 8
// requires: mekanism
// ============================================================================
//  Индустриальные ядра — общий вход в обогащение руды.
//
//  ПРОБЛЕМА. Пять техно-модов пака дают умножение руды независимо друг от
//  друга и с первого дня. Игрок брал самый дешёвый вход и обгонял прогрессию,
//  а остальные четыре мода становились декорацией. Точечными правками это
//  не лечится: нерфить обогащение одного мода при четырёх соседних —
//  произвол (об этом же писали в 70_mekanism_gates.js и 80_enderio_gates.js).
//
//  РЕШЕНИЕ. Общая деталь на входе в обогащение. Каким модом ни играй —
//  ступень открывается через одно и то же ядро, темп у всех одинаковый.
//  Свобода выбора ветки сохраняется полностью: ядро не говорит, ЧЕМ играть,
//  только КОГДА открывается умножение руды.
//
//  ХРЕБЕТ — MEKANISM. Он выбран не произвольно: у него самая честная
//  внутренняя лестница (проверено в 70_mekanism_gates.js), и на его сплавах
//  уже висят гейты Powah (50) и Ender IO (80). Ядро закрепляет это явно.
//
//  ЛОВУШКА, КОТОРУЮ ОБХОДИМ. Если ядро гейтит обогащение ВО ВСЕХ модах,
//  включая Mekanism, а само требует Mekanism — крафт замкнётся сам на себя.
//  Спасает то, что ранний Mekanism обогащения НЕ требует:
//      осмий копается напрямую, сталь плавится из железа,
//      Metallurgic Infuser, сплавы и схемы делаются без единой ступени умножения.
//  Поэтому Тир I стоит строго на «доруд́ной» части мода. Цикла нет.
//
//  ПУТЬ ИГРОКА:
//      ваниль -> Mekanism (осмий, сталь, инфузер, сплав, схема)
//             -> Механическое ядро
//             -> 2x обогащение в ЛЮБОМ моде на выбор
//             -> Резонансное ядро (+ Powah)
//             -> ступени выше 2x и генерация руды у IF
//
//  ПОЧЕМУ IF СИДИТ НА ТИРЕ II. У остальных модов ядро открывает умножение
//  руды, а у Industrial Foregoing умножения нет вообще — там ГЕНЕРАЦИЯ из
//  ничего (Ore Laser Base). Бесконечная руда сильнее любого множителя,
//  поэтому она и стоит на ступень выше.
//
//  ОБЪЁМ. Ядра нужны поштучно (1 на машину, машин строят единицы), поэтому
//  гейт платится редко и гриндом не становится — тот же принцип, что
//  и во всех предыдущих правках.
// ============================================================================

ServerEvents.recipes(event => {

  const CORE_I           = 'kubejs:mechanical_core'
  const CORE_II          = 'kubejs:resonant_core'
  const CORE_III         = 'kubejs:quantum_core'
  const CORE_ARCANE      = 'kubejs:arcane_core'
  const CORE_SINGULARITY = 'kubejs:singularity_core'
  const LENS_PHOTON      = 'kubejs:photon_lens'
  const FOCUS_PRISMATIC  = 'kubejs:prismatic_focus'

  // ==========================================================================
  //  Сами ядра
  // ==========================================================================

  // --- Тир I: ранний Mekanism, без обогащения --------------------------------
  // Сталь как корпус, инфузионный сплав как обмотка, базовая схема как мозг.
  event.shaped(CORE_I, [
    'SAS',
    'ACA',
    'SAS'
  ], {
    S: '#c:ingots/steel',
    A: 'mekanism:alloy_infused',
    C: 'mekanism:basic_control_circuit'
  }).id('kubejs:cores/mechanical_core')

  // --- Тир II: средний Mekanism + Powah --------------------------------------
  // Ядро I в сердце, армированный сплав по углам, elite-схемы и конденсаторы
  // Powah по бокам. Второй мод в рецепте — чтобы верхнее обогащение требовало
  // выйти за пределы одной ветки.
  if (Platform.isLoaded('powah')) {
    event.shaped(CORE_II, [
      'ACA',
      'PMP',
      'ACA'
    ], {
      A: 'mekanism:alloy_reinforced',
      C: '#c:circuits/elite',
      P: 'powah:capacitor_hardened',
      M: CORE_I
    }).id('kubejs:cores/resonant_core')
  }

  // --- Тир III: высшая индустрия (Mekanism + Modern Industrialization) -------
  // Резонансное ядро II в сердце, высшие схемы Mekanism и MI (или Звезда Незера),
  // атомарный сплав и телепортационные ядра по бокам.
  const quantumCircuit = Platform.isLoaded('modern_industrialization') 
    ? 'modern_industrialization:quantum_circuit' 
    : '#c:circuits/ultimate'

  event.shaped(CORE_III, [
    'ATA',
    'QMQ',
    'ATA'
  ], {
    A: 'mekanism:alloy_atomic',
    T: 'mekanism:teleportation_core',
    Q: quantumCircuit,
    M: CORE_II
  }).id('kubejs:cores/quantum_core')


  // --- Магический тир: Ars Nouveau + Occultism + Mystical Agriculture -------
  const arcaneGem = Platform.isLoaded('ars_nouveau') ? 'ars_nouveau:source_gem_block' : 'minecraft:amethyst_block'
  const spiritGem = Platform.isLoaded('occultism') ? 'occultism:spirit_attuned_gem' : 'minecraft:diamond'
  const supremiumIngot = Platform.isLoaded('mysticalagriculture') ? 'mysticalagriculture:supremium_ingot' : 'minecraft:netherite_ingot'

  event.shaped(CORE_ARCANE, [
    'SGS',
    'GAM',
    'SGS'
  ], {
    S: supremiumIngot,
    G: spiritGem,
    A: arcaneGem,
    M: CORE_II
  }).id('kubejs:cores/arcane_core')

  // --- Тир IV: Сингулярное ядро (Hyper Endgame) --------------------------------
  const antimatterPellet = Platform.isLoaded('mekanism') ? 'mekanism:pellet_antimatter' : 'minecraft:nether_star'
  const ae2Singularity = Platform.isLoaded('ae2') ? 'ae2:singularity' : 'minecraft:dragon_breath'
  const insaniumEssence = Platform.isLoaded('mysticalagradditions') ? 'mysticalagradditions:insanium_essence' : 'minecraft:end_crystal'

  event.shaped(CORE_SINGULARITY, [
    'SAS',
    'IQI',
    'SAS'
  ], {
    S: ae2Singularity,
    A: antimatterPellet,
    I: insaniumEssence,
    Q: CORE_III
  }).id('kubejs:cores/singularity_core')

  // --- Оптические компоненты ------------------------------------------------
  event.shaped(LENS_PHOTON, [
    ' G ',
    'GCG',
    ' G '
  ], {
    G: '#c:glass_blocks',
    C: 'minecraft:amethyst_shard'
  }).id('kubejs:cores/photon_lens')

  event.shaped(FOCUS_PRISMATIC, [
    'DFD',
    'FLF',
    'DFD'
  ], {
    D: '#c:gems/diamond',
    F: 'minecraft:glowstone_dust',
    L: LENS_PHOTON
  }).id('kubejs:cores/prismatic_focus')

  // ==========================================================================
  //  Гейт III & IV — вход в Draconic Evolution (Wyvern / Chaotic)
  // ==========================================================================
  if (Platform.isLoaded('draconicevolution')) {
    event.remove({ output: 'draconicevolution:draconium_core' })
    event.shaped('draconicevolution:draconium_core', [
      'DCD',
      'CQC',
      'DCD'
    ], {
      D: 'draconicevolution:draconium_ingot',
      C: '#c:circuits/ultimate',
      Q: CORE_III
    }).id('kubejs:cores/draconium_core')

    event.remove({ output: 'draconicevolution:chaotic_core' })
    event.shaped('draconicevolution:chaotic_core', [
      'CAC',
      'ASA',
      'CAC'
    ], {
      C: 'draconicevolution:chaos_shard',
      A: 'draconicevolution:awakened_core',
      S: CORE_SINGULARITY
    }).id('kubejs:cores/chaotic_core')
  }


  // ==========================================================================
  //  Гейт I — вход в обогащение руды (2x) во всех ветках
  // ==========================================================================
  // Все четыре рецепта — обычные minecraft:crafting_shaped (сверено по джарникам),
  // поэтому переписываются напрямую. Форму сохраняем, меняем один слот.

  // Mekanism — Enrichment Chamber. Было: ACA / IXI / ACA (I = железо)
  event.remove({ type: 'minecraft:crafting_shaped', output: 'mekanism:enrichment_chamber' })
  event.shaped('mekanism:enrichment_chamber', [
    'ACA',
    'MXM',
    'ACA'
  ], {
    A: '#mekanism:alloys/basic',
    C: '#c:circuits/basic',
    M: CORE_I,
    X: 'mekanism:steel_casing'
  }).id('kubejs:cores/enrichment_chamber')

  // Ender IO — SAG Mill. Было: GFG / IVI / OPO (F = кремень)
  if (Platform.isLoaded('enderio')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'enderio:sag_mill' })
    event.shaped('enderio:sag_mill', [
      'GMG',
      'IVI',
      'OPO'
    ], {
      G: '#c:gears/iron',
      M: CORE_I,
      I: '#c:ingots/iron',
      V: 'enderio:void_chassis',
      O: '#c:obsidians',
      P: 'minecraft:piston'
    }).id('kubejs:cores/sag_mill')
  }

  // Oritech — Pulverizer. Было: fff / fcf / sbs (c = никель)
  if (Platform.isLoaded('oritech')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'oritech:pulverizer_block' })
    event.shaped('oritech:pulverizer_block', [
      'fff',
      'fMf',
      'sbs'
    ], {
      f: 'minecraft:iron_ingot',
      M: CORE_I,
      s: 'oritech:motor',
      b: '#c:storage_blocks/copper'
    }).id('kubejs:cores/pulverizer')
  }

  // Modern Industrialization — Bronze Macerator (верстачный _asbl-вариант)
  if (Platform.isLoaded('modern_industrialization')) {
    event.remove({
      type: 'minecraft:crafting_shaped',
      output: 'modern_industrialization:bronze_macerator'
    })
    // Было: dGd / GCG / ppp (центр — бронзовый корпус, по бокам медные шестерни)
    event.shaped('modern_industrialization:bronze_macerator', [
      'dGd',
      'MCM',
      'ppp'
    ], {
      d: 'minecraft:diamond',
      G: '#c:gears/copper',
      M: CORE_I,
      C: 'modern_industrialization:bronze_machine_casing',
      p: '#modern_industrialization:fluid_pipes'
    }).id('kubejs:cores/bronze_macerator')
  }

  // ==========================================================================
  //  Гейт II — ступени выше 2x и генерация руды
  // ==========================================================================

  // --- Industrial Foregoing — Ore Laser Base --------------------------------
  // У IF не удвоение руды, а ГЕНЕРАЦИЯ ИЗ НИЧЕГО: связка Ore Laser Base +
  // Laser Drill выдаёт 43 вида руды бесконечно, включая драконий, уран,
  // иридий, осмий и флюорит. Это сильнее любого обогащения, поэтому ставим
  // Тир II, а не Тир I — infinite ore должен стоить дороже, чем 2x.
  // База нужна ОДНА на установку (буры ставятся пачками — их не трогаем,
  // иначе гринд). Рецепт уже требует advanced-раму IF, то есть середину мода.
  // Было: pfp / bmb / grg — меняем редстоуновую пыль в центре низа на ядро.
  if (Platform.isLoaded('industrialforegoing')) {
    event.remove({
      type: 'minecraft:crafting_shaped',
      output: 'industrialforegoing:ore_laser_base'
    })
    event.shaped('industrialforegoing:ore_laser_base', [
      'pfp',
      'bmb',
      'gRg'
    ], {
      p: '#c:plastics',
      f: 'minecraft:diamond_pickaxe',
      b: '#c:ores/iron',
      m: '#industrialforegoing:machine_frame/advanced',
      g: '#c:gears/diamond',
      R: CORE_II
    }).id('kubejs:cores/ore_laser_base')

    // Драконий лазером — дыра в защите Draconic из 60_mystag_gates.js.
    // Там мы убрали фарм дракония эссенцией, а лазер делал ровно то же самое.
    // Выход у этого рецепта — ТЕГ (c:ores/draconium), а не предмет, поэтому
    // удаление по output не сработает: снимаем по ID.
    event.remove({ id: 'industrialforegoing:laser_drill_ore/ores/draconium' })
  }
  // Purification (3x) тянет за собой Chemical Injection (4x) и весь верх
  // цепочки, поэтому достаточно одного гейта — тот же приём, что с солнечными
  // модулями Ender IO. Тип mekanism:mek_data сохраняем: он переносит
  // содержимое и апгрейды из машины прошлого тира, обычный shaped это сломает.
  if (Platform.isLoaded('powah')) {
    event.remove({ type: 'mekanism:mek_data', output: 'mekanism:purification_chamber' })
    event.custom({
      type: 'mekanism:mek_data',
      category: 'misc',
      key: {
        A: { tag: 'mekanism:alloys/infused' },
        C: { tag: 'c:circuits/advanced' },
        R: { item: CORE_II },
        P: { item: 'mekanism:enrichment_chamber' }
      },
      pattern: ['ACA', 'RPR', 'ACA'],
      result: { count: 1, id: 'mekanism:purification_chamber' }
    }).id('kubejs:cores/purification_chamber')
  }
})
