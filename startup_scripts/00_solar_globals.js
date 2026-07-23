// priority: 1000
// requires: solarflux
// ============================================================================
//  ЕДИНАЯ ТОЧКА ПРАВКИ ID.
//
//  ВАЖНО: файл лежит в startup_scripts, а не в server_scripts.
//  В KubeJS объект global читается из любых скриптов, но ЗАПИСЫВАТЬ в него
//  можно только из startup_scripts. Попытка присвоить global.X из
//  server_scripts падает с ошибкой:
//      'global' cannot be assigned to in client or server scripts
//
//  Следствие: после правки этого файла нужен перезапуск сервера,
//  одного /reload не хватит — startup-скрипты по /reload не перечитываются.
//
//  Все ID сверены с jar'ами сборки prodMOYAAAA (23.07.2026):
//  метки ⚠ прошлой ревизии сняты, draconic_core исправлен на draconium_core
//  (в DE 1.21 предмет переименован).
// ============================================================================

global.SOLAR = {

  // --- Solar Flux Reborn -----------------------------------------------------
  // panels[0] = sp_1 ... panels[7] = sp_8
  panels: [
    'solarflux:sp_1', 'solarflux:sp_2', 'solarflux:sp_3', 'solarflux:sp_4',
    'solarflux:sp_5', 'solarflux:sp_6', 'solarflux:sp_7', 'solarflux:sp_8'
  ],
  // Компат-панели Draconic Evolution (генерация из config/solarflux/panels.cfg):
  // wyvern = 65 536 (2x sp_8), draconic = 262 144 (4x wyvern), chaotic = 524 288 (2x draconic)
  dePanels: {
    wyvern:   'solarflux:sp_de.wyvern',
    draconic: 'solarflux:sp_de.draconic',
    chaotic:  'solarflux:sp_de.chaotic'
  },
  // cells[0] = photovoltaic_cell_1 ... cells[5] = photovoltaic_cell_6.
  // Ячеек ШЕСТЬ, а не четыре: V и VI идут только в DE-панели.
  cells: [
    'solarflux:photovoltaic_cell_1', 'solarflux:photovoltaic_cell_2',
    'solarflux:photovoltaic_cell_3', 'solarflux:photovoltaic_cell_4',
    'solarflux:photovoltaic_cell_5', 'solarflux:photovoltaic_cell_6'
  ],
  mirror: 'solarflux:mirror',

  // Собственные предметы SFR — вплетаем в наши рецепты, чтобы не висели мёртвым
  // грузом. Их дефолтные крафты (изумруд+стекло и т.п.) адекватны, НЕ отключаем.
  sfr: {
    emeraldGlass:   'solarflux:emerald_glass',
    enderGlass:     'solarflux:ender_glass',
    blazingCoating: 'solarflux:blazing_coating'
  },

  // Апгрейды SFR. Лимит установки в ОДНУ панель (из кода мода):
  // efficiency x20, capacity x10, transfer x10, остальные x1.
  // low_light_upgrade в этой версии SFR не существует (есть только текстура).
  upgrades: {
    blank:      'solarflux:blank_upgrade',
    efficiency: 'solarflux:efficiency_upgrade',
    capacity:   'solarflux:capacity_upgrade',
    transfer:   'solarflux:transfer_rate_upgrade',
    traversal:  'solarflux:traversal_upgrade',
    dispersive: 'solarflux:dispersive_upgrade',
    charging:   'solarflux:block_charging_upgrade',
    furnace:    'solarflux:furnace_upgrade',
    ae2:        'solarflux:ae2/energy_upgrade'
  },

  // --- Наши компоненты -------------------------------------------------------
  lens:      'kubejs:solar_lens',
  capacitor: 'kubejs:photon_capacitor',
  matrix:    'kubejs:quantum_solar_matrix',
  arcane:    'kubejs:arcane_solar_core',
  draconic:  'kubejs:draconic_solar_core',

  // --- Компоненты других модов ----------------------------------------------
  mod: {
    // Mekanism
    circuitBasic:    'mekanism:basic_control_circuit',
    circuitAdv:      'mekanism:advanced_control_circuit',
    circuitElite:    'mekanism:elite_control_circuit',
    circuitUltimate: 'mekanism:ultimate_control_circuit',
    alloyInfused:    'mekanism:alloy_infused',
    alloyReinforced: 'mekanism:alloy_reinforced',
    alloyAtomic:     'mekanism:alloy_atomic',
    polonium:        'mekanism:pellet_polonium',
    antimatter:      'mekanism:pellet_antimatter',
    teleportCore:    'mekanism:teleportation_core',

    // Powah
    energizedSteel:  'powah:steel_energized',
    crystalBlazing:  'powah:crystal_blazing',
    crystalNiotic:   'powah:crystal_niotic',
    crystalNitro:    'powah:crystal_nitro',
    playerTransmitter: 'powah:player_transmitter_basic',
    bindingCard:     'powah:binding_card',

    // Ender IO
    alloyEnergetic:  'enderio:energetic_alloy_ingot',
    alloyVibrant:    'enderio:vibrant_alloy_ingot',
    capOctadic:      'enderio:octadic_capacitor',
    capBasic:        'enderio:basic_capacitor',
    pvComposite:     'enderio:photovoltaic_composite',

    // Applied Energistics 2
    procCalc:        'ae2:calculation_processor',
    procEng:         'ae2:engineering_processor',
    fluix:           'ae2:fluix_crystal',
    singularity:     'ae2:singularity',
    quartzFiber:     'ae2:quartz_fiber',
    energyAcceptor:  'ae2:energy_acceptor',

    // LaserIO
    laserConnector:  'laserio:laser_connector',
    cardEnergy:      'laserio:card_energy',
    logicChip:       'laserio:logic_chip',

    // Industrial Foregoing
    plastic:         'industrialforegoing:plastic',
    frameAdv:        'industrialforegoing:machine_frame_advanced',
    frameSupreme:    'industrialforegoing:machine_frame_supreme',

    // Modern Industrialization
    miDigital:       'modern_industrialization:digital_circuit',
    miProcessing:    'modern_industrialization:processing_unit',
    miStainless:     'modern_industrialization:stainless_steel_ingot',

    // Mystical Agriculture (+ Agradditions)
    supremium:       'mysticalagriculture:supremium_ingot',
    soulium:         'mysticalagriculture:soulium_ingot',
    insanium:        'mysticalagradditions:insanium_essence',

    // Ars Nouveau
    sourceGem:       'ars_nouveau:source_gem',
    sourceBlock:     'ars_nouveau:source_gem_block',
    essManipulation: 'ars_nouveau:manipulation_essence',
    wildenTribute:   'ars_nouveau:wilden_tribute',

    // Occultism
    iesnium:         'occultism:iesnium_ingot',
    spiritGem:       'occultism:spirit_attuned_gem',

    // Draconic Evolution
    draconium:       'draconicevolution:draconium_ingot',
    awakened:        'draconicevolution:awakened_draconium_ingot',
    coreDraconium:   'draconicevolution:draconium_core',   // в 1.12 звался draconic_core
    coreWyvern:      'draconicevolution:wyvern_core',
    coreAwakened:    'draconicevolution:awakened_core',
    coreChaotic:     'draconicevolution:chaotic_core',
    energyCoreWyvern:   'draconicevolution:wyvern_energy_core',
    energyCoreDraconic: 'draconicevolution:draconic_energy_core',
    energyCoreChaotic:  'draconicevolution:chaotic_energy_core',
    relayBasic:      'draconicevolution:basic_relay_crystal',
    chaosShard:      'draconicevolution:chaos_shard'
  },

  // --- Общие теги NeoForge ---------------------------------------------------
  // В 1.21 общие теги живут в неймспейсе c: (не forge:).
  // Для сырья теги надёжнее конкретных ID — AlmostUnified всё равно
  // сводит дубликаты к одному предмету.
  tag: {
    copper:    '#c:ingots/copper',
    iron:      '#c:ingots/iron',
    gold:      '#c:ingots/gold',
    steel:     '#c:ingots/steel',
    osmium:    '#c:ingots/osmium',
    diamond:   '#c:gems/diamond',
    redstone:  '#c:dusts/redstone',
    glowstone: '#c:dusts/glowstone',
    rsBlock:   '#c:storage_blocks/redstone',
    glassPane: '#c:glass_panes',
    glass:     '#c:glass_blocks',
    ender:     '#c:ender_pearls',
    blazeRod:  '#c:rods/blaze'
  }
}
