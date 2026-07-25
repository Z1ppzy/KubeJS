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
  const CORE_HYPER       = 'kubejs:hyper_spatial_core'
  const CORE_CHRONOS     = 'kubejs:chronos_core'
  const MATRIX_BIO       = 'kubejs:bio_matrix'
  const LENS_PHOTON      = 'kubejs:photon_lens'
  const FOCUS_PRISMATIC  = 'kubejs:prismatic_focus'
  const HAS_OLD_AE2_LINK = Item.exists('ae2:quantum_link_chamber')
  const AE2_QUANTUM_LINK = HAS_OLD_AE2_LINK ? 'ae2:quantum_link_chamber' : 'ae2:quantum_link'
  const HAS_EIO_TRANSCEIVER = Item.exists('enderio:dimensional_transceiver')

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

  // --- Специализированные многофункциональные компоненты --------------------
  // Ни один из ингредиентов ниже не производится устройствами, которые
  // гейтятся соответствующим компонентом: прямых циклов нет.
  if (Platform.isLoaded('ae2') &&
      Platform.isLoaded('enderio') &&
      Item.exists('ae2:fluix_crystal') &&
      Item.exists('enderio:vibrant_alloy_ingot')) {
    event.shaped(CORE_HYPER, [
      'FTF',
      'VRV',
      'FTF'
    ], {
      F: 'ae2:fluix_crystal',
      T: 'mekanism:teleportation_core',
      V: 'enderio:vibrant_alloy_ingot',
      R: CORE_II
    }).id('kubejs:cores/hyper_spatial_core')
  }

  event.shaped(CORE_CHRONOS, [
    'GCG',
    'RPR',
    'GLG'
  ], {
    G: '#c:gears/gold',
    C: 'minecraft:clock',
    R: '#c:dusts/redstone',
    P: FOCUS_PRISMATIC,
    L: '#c:dusts/glowstone'
  }).id('kubejs:cores/chronos_core')

  if (Platform.isLoaded('industrialforegoing') &&
      Platform.isLoaded('mysticalagriculture') &&
      Item.exists('mysticalagriculture:fertilized_essence')) {
    event.shaped(MATRIX_BIO, [
      'PFP',
      'BMS',
      'PFP'
    ], {
      P: '#c:plastics',
      F: 'mysticalagriculture:fertilized_essence',
      B: 'minecraft:bone_block',
      M: CORE_I,
      S: 'minecraft:slime_block'
    }).id('kubejs:cores/bio_matrix')
  }

  // ==========================================================================
  //  Специализированные гейты: пространство, время и биотехнологии
  // ==========================================================================

  // AE2 1.21 переименовал quantum_link_chamber в quantum_link.
  // Item.exists сохраняет совместимость со старым ID и не создаёт битый output.
  if (Platform.isLoaded('ae2') && Item.exists(AE2_QUANTUM_LINK)) {
    event.remove({ type: 'minecraft:crafting_shaped', output: AE2_QUANTUM_LINK })
    event.shaped(AE2_QUANTUM_LINK, [
      'AHA',
      'B B',
      'ABA'
    ], {
      A: 'ae2:quartz_glass',
      B: 'ae2:fluix_pearl',
      H: CORE_HYPER
    }).id('kubejs:cores/quantum_link')
  }

  if (Platform.isLoaded('powah') && Item.exists('powah:player_transmitter_basic')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'powah:player_transmitter_basic' })
    event.shaped('powah:player_transmitter_basic', [
      ' P ',
      'ICI',
      ' H '
    ], {
      P: 'powah:player_transmitter_starter',
      I: 'powah:capacitor_basic',
      C: 'powah:dielectric_casing',
      H: CORE_HYPER
    }).id('kubejs:cores/player_transmitter_basic')
  }

  // Dimensional Transceiver ещё не портирован в Ender IO 1.21.1.
  // На актуальной версии тот же пространственный гейт ставится на Travel Anchor.
  if (Platform.isLoaded('enderio') && HAS_EIO_TRANSCEIVER) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'enderio:dimensional_transceiver' })
    event.shaped('enderio:dimensional_transceiver', [
      'VOV',
      'OHO',
      'VOV'
    ], {
      V: 'enderio:vibrant_alloy_ingot',
      O: 'enderio:octadic_capacitor',
      H: CORE_HYPER
    }).id('kubejs:cores/dimensional_transceiver')
  } else if (Platform.isLoaded('enderio') && Item.exists('enderio:travel_anchor')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'enderio:travel_anchor' })
    event.shaped('enderio:travel_anchor', [
      'IBI',
      'BHB',
      'IBI'
    ], {
      I: '#c:ingots/iron',
      B: 'enderio:conduit_binder',
      H: CORE_HYPER
    }).id('kubejs:cores/travel_anchor')
  }

  if (Platform.isLoaded('ae2') && Item.exists('ae2:speed_card')) {
    event.remove({ output: 'ae2:speed_card' })
    event.shapeless('ae2:speed_card', [
      'ae2:advanced_card',
      '#ae2:all_fluix',
      CORE_CHRONOS
    ]).id('kubejs:cores/speed_card')
  }

  // Дефолт отключён в config Solar Flux; заменяем рецепт из 35_solar_upgrades.js.
  if (Platform.isLoaded('solarflux') &&
      Platform.isLoaded('enderio') &&
      Item.exists('solarflux:efficiency_upgrade')) {
    event.remove({ output: 'solarflux:efficiency_upgrade' })
    event.shaped(Item.of('solarflux:efficiency_upgrade', 2), [
      'ECE',
      'CBC',
      'EHE'
    ], {
      E: 'solarflux:emerald_glass',
      C: 'enderio:photovoltaic_composite',
      B: 'solarflux:blank_upgrade',
      H: CORE_CHRONOS
    }).id('kubejs:cores/efficiency_upgrade')
  }

  if (Item.exists('mekanism:upgrade_speed')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'mekanism:upgrade_speed' })
    event.shaped('mekanism:upgrade_speed', [
      ' G ',
      'AHA',
      ' G '
    ], {
      G: '#c:glass_blocks/cheap',
      A: '#mekanism:alloys/infused',
      H: CORE_CHRONOS
    }).id('kubejs:cores/upgrade_speed')
  }

  if (Platform.isLoaded('industrialforegoing') && Item.exists('industrialforegoing:mob_crusher')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'industrialforegoing:mob_crusher' })
    event.shaped('industrialforegoing:mob_crusher', [
      'PSP',
      'BMB',
      'GQG'
    ], {
      P: '#c:plastics',
      S: 'minecraft:iron_sword',
      B: 'minecraft:book',
      M: '#industrialforegoing:machine_frame/advanced',
      G: '#c:gears/gold',
      Q: MATRIX_BIO
    }).id('kubejs:cores/mob_crusher')
  }

  if (Platform.isLoaded('industrialforegoing') && Item.exists('industrialforegoing:plant_gatherer')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'industrialforegoing:plant_gatherer' })
    event.shaped('industrialforegoing:plant_gatherer', [
      'PHP',
      'AMA',
      'GQG'
    ], {
      P: '#c:plastics',
      H: 'minecraft:iron_hoe',
      A: 'minecraft:iron_axe',
      M: '#industrialforegoing:machine_frame/pity',
      G: '#c:gears/gold',
      Q: MATRIX_BIO
    }).id('kubejs:cores/plant_gatherer')
  }

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
