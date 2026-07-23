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
//  Как узнать ID: взять предмет в руку -> /kubejs hand  (ID уходит в буфер)
//  Строки с ⚠ я не смог подтвердить для 1.21.1 — проверь их в первую очередь.
// ============================================================================

global.SOLAR = {

  // --- Solar Flux Reborn -----------------------------------------------------
  // panels[0] = sp_1 ... panels[7] = sp_8
  panels: [
    'solarflux:sp_1', 'solarflux:sp_2', 'solarflux:sp_3', 'solarflux:sp_4',
    'solarflux:sp_5', 'solarflux:sp_6', 'solarflux:sp_7', 'solarflux:sp_8'
  ],
  // cells[0] = photovoltaic_cell_1 ... cells[3] = photovoltaic_cell_4
  cells: [
    'solarflux:photovoltaic_cell_1', 'solarflux:photovoltaic_cell_2',
    'solarflux:photovoltaic_cell_3', 'solarflux:photovoltaic_cell_4'
  ],
  mirror: 'solarflux:mirror',

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
    polonium:        'mekanism:pellet_polonium',                   // ⚠
    antimatter:      'mekanism:pellet_antimatter',                 // ⚠

    // Powah
    energizedSteel:  'powah:steel_energized',                      // ⚠ было powah:energized_steel — такого предмета нет
    crystalBlazing:  'powah:crystal_blazing',                      // ⚠
    crystalNiotic:   'powah:crystal_niotic',                       // ⚠
    crystalNitro:    'powah:crystal_nitro',                        // ⚠

    // Ender IO
    alloyEnergetic:  'enderio:energetic_alloy_ingot',              // ⚠
    alloyVibrant:    'enderio:vibrant_alloy_ingot',                // ⚠
    capOctadic:      'enderio:octadic_capacitor',                  // ⚠

    // Applied Energistics 2
    procCalc:        'ae2:calculation_processor',
    procEng:         'ae2:engineering_processor',
    fluix:           'ae2:fluix_crystal',
    singularity:     'ae2:singularity',

    // Industrial Foregoing
    plastic:         'industrialforegoing:plastic',
    frameAdv:        'industrialforegoing:machine_frame_advanced',
    frameSupreme:    'industrialforegoing:machine_frame_supreme',

    // Modern Industrialization
    miDigital:       'modern_industrialization:digital_circuit',   // ⚠
    miProcessing:    'modern_industrialization:processing_unit',   // ⚠
    miStainless:     'modern_industrialization:stainless_steel_ingot',

    // Mystical Agriculture (+ Agradditions)
    supremium:       'mysticalagriculture:supremium_ingot',
    soulium:         'mysticalagriculture:soulium_ingot',
    insanium:        'mysticalagradditions:insanium_essence',      // ⚠

    // Ars Nouveau
    sourceGem:       'ars_nouveau:source_gem',
    sourceBlock:     'ars_nouveau:source_gem_block',
    essManipulation: 'ars_nouveau:manipulation_essence',
    wildenTribute:   'ars_nouveau:wilden_tribute',

    // Occultism
    iesnium:         'occultism:iesnium_ingot',                    // ⚠
    spiritGem:       'occultism:spirit_attuned_gem',               // ⚠

    // Draconic Evolution
    draconium:       'draconicevolution:draconium_ingot',
    awakened:        'draconicevolution:awakened_draconium_ingot',
    coreWyvern:      'draconicevolution:wyvern_core',
    coreDraconic:    'draconicevolution:draconic_core',
    coreAwakened:    'draconicevolution:awakened_core',
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
    rsBlock:   '#c:storage_blocks/redstone',
    glassPane: '#c:glass_panes',
    glass:     '#c:glass_blocks',
    ender:     '#c:ender_pearls',
    blazeRod:  '#c:rods/blaze'
  }
}
