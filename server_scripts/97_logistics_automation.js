// priority: 4
// Cross-mod progression for logistics, programmable automation, AE2 add-ons,
// chunk loading, and high-capacity portable storage.

ServerEvents.recipes(event => {
  const CORE_I = 'kubejs:mechanical_core'
  const CORE_II = 'kubejs:resonant_core'
  const CORE_III = 'kubejs:quantum_core'
  const CORE_SINGULARITY = 'kubejs:singularity_core'
  const CORE_HYPER = 'kubejs:hyper_spatial_core'
  const MATRIX_BIO = 'kubejs:bio_matrix'
  const BUS_AUTOMATION = 'kubejs:automation_bus'

  // -------------------------------------------------------------------------
  // Programmable automation: CC:Tweaked + Advanced Peripherals + AE2 + LaserIO
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('advancedperipherals') &&
      Platform.isLoaded('computercraft') &&
      Platform.isLoaded('ae2') &&
      Platform.isLoaded('laserio') &&
      Item.exists('advancedperipherals:peripheral_casing') &&
      Item.exists('laserio:logic_chip')) {
    event.shaped(BUS_AUTOMATION, [
      'LEL',
      'CAC',
      'LPL'
    ], {
      L: 'laserio:logic_chip',
      E: 'ae2:engineering_processor',
      C: 'computercraft:computer_advanced',
      A: CORE_II,
      P: 'advancedperipherals:peripheral_casing'
    }).id('kubejs:integration/automation_bus')

    event.remove({ output: 'advancedperipherals:me_bridge' })
    event.shaped('advancedperipherals:me_bridge', [
      'FBF',
      'IAI',
      'FIF'
    ], {
      F: 'ae2:fluix_block',
      B: BUS_AUTOMATION,
      I: 'ae2:interface',
      A: 'advancedperipherals:peripheral_casing'
    }).id('kubejs:integration/advancedperipherals_me_bridge')

    event.remove({ output: 'advancedperipherals:energy_detector' })
    event.shaped('advancedperipherals:energy_detector', [
      'BRB',
      'CAC',
      'BGB'
    ], {
      B: '#c:storage_blocks/redstone',
      R: 'minecraft:redstone_torch',
      C: 'minecraft:comparator',
      A: BUS_AUTOMATION,
      G: '#c:ingots/gold'
    }).id('kubejs:integration/advancedperipherals_energy_detector')
  }

  if (Platform.isLoaded('merequester') && Item.exists('merequester:requester')) {
    event.remove({ output: 'merequester:requester' })
    event.shaped('merequester:requester', [
      'EIE',
      'ABA',
      'CSC'
    ], {
      E: '#c:ingots/iron',
      I: 'ae2:interface',
      A: 'ae2:crafting_accelerator',
      B: BUS_AUTOMATION,
      C: '#c:ingots/copper',
      S: 'minecraft:amethyst_shard'
    }).id('kubejs:integration/me_requester')
  }

  // -------------------------------------------------------------------------
  // Pipez: preserve cheap base pipes, gate universal routing and maximum speed.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('pipez')) {
    event.remove({ output: 'pipez:universal_pipe' })
    event.shaped('6x pipez:universal_pipe', [
      'IEF',
      'MHR',
      'IEF'
    ], {
      I: 'pipez:item_pipe',
      E: 'pipez:energy_pipe',
      F: 'pipez:fluid_pipe',
      M: '#c:ingots/iron',
      H: CORE_HYPER,
      R: '#c:storage_blocks/redstone'
    }).id('kubejs:integration/pipez_universal_pipe')

    event.remove({ output: 'pipez:ultimate_upgrade' })
    event.shaped('pipez:ultimate_upgrade', [
      'NRN',
      'RUR',
      'NCN'
    ], {
      N: '#c:ingots/netherite',
      R: '#c:storage_blocks/redstone',
      U: 'pipez:advanced_upgrade',
      C: 'kubejs:chronos_core'
    }).id('kubejs:integration/pipez_ultimate_upgrade')
  }

  // -------------------------------------------------------------------------
  // Standalone Chunk Loaders. These recipes are dormant when the mod is absent.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('chunkloaders')) {
    event.remove({ output: 'chunkloaders:basic_chunk_loader' })
    event.shaped('chunkloaders:basic_chunk_loader', [
      'ABA',
      'BCB',
      'ABA'
    ], {
      A: '#c:ingots/iron',
      B: '#c:obsidians',
      C: CORE_II
    }).id('kubejs:integration/basic_chunk_loader')

    event.remove({ output: 'chunkloaders:advanced_chunk_loader' })
    event.shaped('chunkloaders:advanced_chunk_loader', [
      'AHA',
      'BCB',
      'ABA'
    ], {
      A: 'minecraft:blaze_powder',
      H: CORE_HYPER,
      B: '#c:ingots/gold',
      C: 'chunkloaders:basic_chunk_loader'
    }).id('kubejs:integration/advanced_chunk_loader')

    event.remove({ output: 'chunkloaders:ultimate_chunk_loader' })
    event.shaped('chunkloaders:ultimate_chunk_loader', [
      'ASA',
      'CDC',
      'AHA'
    ], {
      A: '#c:dusts/redstone',
      S: CORE_SINGULARITY,
      C: 'minecraft:ender_eye',
      D: 'chunkloaders:advanced_chunk_loader',
      H: CORE_HYPER
    }).id('kubejs:integration/ultimate_chunk_loader')
  }

  // -------------------------------------------------------------------------
  // AE2 add-ons: one shared progression instead of isolated end-game branches.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('megacells')) {
    event.remove({ output: 'megacells:cell_component_1m' })
    event.shaped('megacells:cell_component_1m', [
      'ABA',
      'CQC',
      'ADA'
    ], {
      A: 'ae2:sky_dust',
      B: 'megacells:accumulation_processor',
      C: 'ae2:cell_component_256k',
      Q: CORE_III,
      D: 'ae2:quartz_vibrant_glass'
    }).id('kubejs:integration/megacells_component_1m')

    event.remove({ output: 'megacells:cell_component_64m' })
    event.shaped('megacells:cell_component_64m', [
      'ABA',
      'CSC',
      'ADA'
    ], {
      A: 'ae2:matter_ball',
      B: 'megacells:accumulation_processor',
      C: 'megacells:cell_component_16m',
      S: CORE_SINGULARITY,
      D: 'ae2:quartz_vibrant_glass'
    }).id('kubejs:integration/megacells_component_64m')
  }

  if (Platform.isLoaded('extendedae')) {
    event.remove({ output: 'extendedae:pattern_provider_upgrade' })
    event.shapeless('extendedae:pattern_provider_upgrade', [
      '#extendedae:extended_pattern_provider',
      '#c:ingots',
      BUS_AUTOMATION
    ]).id('kubejs:integration/extended_pattern_provider_upgrade')

    event.remove({ id: 'extendedae:assembler/assembler_matrix_pattern' })
    event.custom({
      type: 'extendedae:crystal_assembler',
      input_items: [
        { ingredient: { item: 'extendedae:assembler_matrix_wall' } },
        { ingredient: { tag: 'extendedae:extended_pattern_provider' } },
        { amount: 6, ingredient: { item: 'ae2:blue_lumen_paint_ball' } },
        { ingredient: { item: 'ae2:engineering_processor' } },
        { ingredient: { item: CORE_III } }
      ],
      output: { count: 1, id: 'extendedae:assembler_matrix_pattern' }
    }).id('kubejs:integration/extendedae_assembler_matrix_pattern')
  }

  if (Platform.isLoaded('advanced_ae')) {
    event.remove({ output: 'advanced_ae:quantum_unit' })

    const quantumUnitIngredients = Platform.isLoaded('extendedae')
      ? [
          'ae2:crafting_unit',
          'ae2:singularity',
          'extendedae:concurrent_processor',
          CORE_III
        ]
      : [
          'ae2:crafting_unit',
          'ae2:singularity',
          'advanced_ae:shattered_singularity',
          'advanced_ae:shattered_singularity',
          CORE_III
        ]

    event.shapeless('advanced_ae:quantum_unit', quantumUnitIngredients)
      .id('kubejs:integration/advanced_ae_quantum_unit')
  }

  if (Platform.isLoaded('appmek')) {
    event.remove({ output: 'appmek:chemical_cell_housing' })
    event.shaped('appmek:chemical_cell_housing', [
      'QRQ',
      'RCR',
      'OOO'
    ], {
      Q: 'ae2:quartz_glass',
      R: '#c:dusts/redstone',
      C: CORE_II,
      O: '#c:ingots/osmium'
    }).id('kubejs:integration/appmek_chemical_cell_housing')
  }

  // -------------------------------------------------------------------------
  // Sophisticated storage: keep the early game intact, gate only large boosts.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('sophisticatedbackpacks')) {
    event.remove({ output: 'sophisticatedbackpacks:inception_upgrade' })
    event.shaped('sophisticatedbackpacks:inception_upgrade', [
      'ESE',
      'DBD',
      'EHE'
    ], {
      E: 'minecraft:ender_eye',
      S: '#c:nether_stars',
      D: '#c:gems/diamond',
      B: 'sophisticatedbackpacks:upgrade_base',
      H: CORE_HYPER
    }).id('kubejs:integration/backpack_inception_upgrade')

    event.remove({ output: 'sophisticatedbackpacks:stack_upgrade_tier_3' })
    event.shaped('sophisticatedbackpacks:stack_upgrade_tier_3', [
      'DQD',
      'DSD',
      'DDD'
    ], {
      D: '#c:storage_blocks/diamond',
      Q: CORE_III,
      S: 'sophisticatedbackpacks:stack_upgrade_tier_2'
    }).id('kubejs:integration/backpack_stack_upgrade_tier_3')

    event.remove({ output: 'sophisticatedbackpacks:stack_upgrade_tier_4' })
    event.shaped('sophisticatedbackpacks:stack_upgrade_tier_4', [
      'NSN',
      'NUN',
      'NNN'
    ], {
      N: '#c:storage_blocks/netherite',
      S: CORE_SINGULARITY,
      U: 'sophisticatedbackpacks:stack_upgrade_tier_3'
    }).id('kubejs:integration/backpack_stack_upgrade_tier_4')

    event.remove({ id: 'sophisticatedbackpacks:advanced_pump_upgrade' })
    event.custom({
      type: 'sophisticatedcore:upgrade_next_tier',
      category: 'misc',
      key: {
        D: { tag: 'c:gems/diamond' },
        G: { tag: 'c:ingots/gold' },
        I: { item: 'minecraft:dispenser' },
        M: { item: CORE_I },
        P: { item: 'sophisticatedbackpacks:pump_upgrade' },
        R: { tag: 'c:dusts/redstone' }
      },
      pattern: ['DMD', 'GPG', 'RIR'],
      result: { count: 1, id: 'sophisticatedbackpacks:advanced_pump_upgrade' }
    }).id('kubejs:integration/backpack_advanced_pump_upgrade')

    event.remove({ id: 'sophisticatedbackpacks:advanced_feeding_upgrade' })
    event.custom({
      type: 'sophisticatedcore:upgrade_next_tier',
      category: 'misc',
      key: {
        D: { tag: 'c:gems/diamond' },
        G: { tag: 'c:ingots/gold' },
        V: { item: 'sophisticatedbackpacks:feeding_upgrade' },
        R: { tag: 'c:dusts/redstone' },
        B: { item: MATRIX_BIO }
      },
      pattern: [' D ', 'GVG', 'RBR'],
      result: { count: 1, id: 'sophisticatedbackpacks:advanced_feeding_upgrade' }
    }).id('kubejs:integration/backpack_advanced_feeding_upgrade')
  }

  if (Platform.isLoaded('sophisticatedstorage')) {
    event.remove({ output: 'sophisticatedstorage:stack_upgrade_tier_4' })
    event.shaped('sophisticatedstorage:stack_upgrade_tier_4', [
      'DQD',
      'DSD',
      'BDB'
    ], {
      D: '#c:gems/diamond',
      Q: CORE_III,
      S: 'sophisticatedstorage:stack_upgrade_tier_3',
      B: '#c:storage_blocks/diamond'
    }).id('kubejs:integration/storage_stack_upgrade_tier_4')

    event.remove({ output: 'sophisticatedstorage:stack_upgrade_tier_5' })
    event.shaped('sophisticatedstorage:stack_upgrade_tier_5', [
      'NSN',
      'NUN',
      'BNB'
    ], {
      N: '#c:ingots/netherite',
      S: CORE_SINGULARITY,
      U: 'sophisticatedstorage:stack_upgrade_tier_4',
      B: '#c:storage_blocks/netherite'
    }).id('kubejs:integration/storage_stack_upgrade_tier_5')

    event.remove({ id: 'sophisticatedstorage:advanced_feeding_upgrade' })
    event.custom({
      type: 'sophisticatedcore:upgrade_next_tier',
      category: 'misc',
      key: {
        D: { tag: 'c:gems/diamond' },
        G: { tag: 'c:ingots/gold' },
        V: { item: 'sophisticatedstorage:feeding_upgrade' },
        R: { tag: 'c:dusts/redstone' },
        B: { item: MATRIX_BIO }
      },
      pattern: [' D ', 'GVG', 'RBR'],
      result: { count: 1, id: 'sophisticatedstorage:advanced_feeding_upgrade' }
    }).id('kubejs:integration/storage_advanced_feeding_upgrade')
  }
})
