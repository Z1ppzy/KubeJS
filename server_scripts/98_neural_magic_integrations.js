// priority: 3
// Neural farming and magic-storage bridges. Custom Gateways, HNN data models,
// Apothic Spawner modifiers, and Silent Gear materials live under data/.

ServerEvents.recipes(event => {
  const CORE_ARCANE = 'kubejs:arcane_core'
  const CORE_HYPER = 'kubejs:hyper_spatial_core'
  const MATRIX_BIO = 'kubejs:bio_matrix'

  // -------------------------------------------------------------------------
  // Hostile Neural Networks: automated mob drops join the bio progression.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('hostilenetworks')) {
    event.remove({ output: 'hostilenetworks:sim_chamber' })
    event.shaped('hostilenetworks:sim_chamber', [
      'GCG',
      'EOE',
      'MBM'
    ], {
      G: '#c:glass_panes',
      C: 'minecraft:comparator',
      E: 'minecraft:ender_pearl',
      O: '#c:obsidians',
      M: '#c:gems/lapis',
      B: MATRIX_BIO
    }).id('kubejs:integration/hostile_sim_chamber')

    event.remove({ output: 'hostilenetworks:loot_fabricator' })
    event.shaped('hostilenetworks:loot_fabricator', [
      ' I ',
      'GBG',
      'NCN'
    ], {
      I: '#c:ingots/netherite',
      G: '#c:gems/diamond',
      B: MATRIX_BIO,
      N: '#c:ingots/gold',
      C: 'minecraft:comparator'
    }).id('kubejs:integration/hostile_loot_fabricator')
  }

  // -------------------------------------------------------------------------
  // Enchanting and disenchanting: powerful extraction follows Arcane Core.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('disenchanting_table') &&
      Item.exists('disenchanting_table:disenchanting_table')) {
    event.remove({ output: 'disenchanting_table:disenchanting_table' })
    event.shaped('disenchanting_table:disenchanting_table', [
      ' L ',
      'DAD',
      'OOO'
    ], {
      L: 'minecraft:lapis_lazuli',
      D: 'minecraft:diamond',
      A: CORE_ARCANE,
      O: 'minecraft:obsidian'
    }).id('kubejs:integration/disenchanting_table')
  }

  if (Platform.isLoaded('apothic_enchanting')) {
    event.remove({ output: 'apothic_enchanting:library' })
    event.shaped('apothic_enchanting:library', [
      'CAC',
      'STS',
      'CSC'
    ], {
      C: 'minecraft:ender_chest',
      A: CORE_ARCANE,
      S: '#apothic_enchanting:infused_shelves',
      T: 'minecraft:enchanting_table'
    }).id('kubejs:integration/apothic_enchantment_library')

    event.remove({ output: 'apothic_enchanting:scrap_tome' })
    event.shaped('8x apothic_enchanting:scrap_tome', [
      'BQB',
      'BAB',
      'BBB'
    ], {
      B: 'minecraft:book',
      Q: CORE_ARCANE,
      A: 'minecraft:anvil'
    }).id('kubejs:integration/apothic_scrap_tome')
  }

  // -------------------------------------------------------------------------
  // Ars Energistique: source storage is an explicit Arcane + AE2 bridge.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('arseng') && Item.exists('arseng:source_cell_housing')) {
    event.remove({ id: 'arseng:source_cell_housing' })
    event.custom({
      type: 'ars_nouveau:enchanting_apparatus',
      keepNbtOfReagent: false,
      pedestalItems: [
        { item: 'ars_nouveau:manipulation_essence' },
        { item: 'ars_nouveau:manipulation_essence' },
        { item: 'ars_nouveau:source_gem' },
        { item: 'ars_nouveau:source_gem' },
        { item: 'minecraft:gold_ingot' },
        { item: 'minecraft:gold_ingot' },
        { item: 'minecraft:gold_ingot' },
        { item: CORE_ARCANE }
      ],
      reagent: { item: 'ae2:item_cell_housing' },
      result: { count: 1, id: 'arseng:source_cell_housing' },
      sourceCost: 0
    }).id('kubejs:integration/arseng_source_cell_housing')
  }

  // -------------------------------------------------------------------------
  // Occultism: base storage stays early; remote and stabilized access are late.
  // Ritual ingredient counts are preserved to match their pentacles.
  // -------------------------------------------------------------------------
  if (Platform.isLoaded('occultism')) {
    event.remove({ type: 'occultism:ritual', output: 'occultism:storage_remote' })
    event.custom({
      type: 'occultism:ritual',
      activation_item: { item: 'occultism:book_of_binding_bound_djinni' },
      duration: 150,
      ingredients: [
        { item: 'occultism:storage_remote_inert' },
        { tag: 'c:ender_pearls' },
        { item: CORE_ARCANE },
        { item: CORE_HYPER }
      ],
      pentacle_id: 'occultism:craft_djinni',
      result: { count: 1, id: 'occultism:storage_remote' },
      ritual_dummy: { count: 1, id: 'occultism:ritual_dummy/craft_storage_remote' },
      ritual_type: 'occultism:craft_with_spirit_name'
    }).id('kubejs:integration/occultism_storage_remote')

    var tierFiveStabilizer = {
      type: 'neoforge:compound',
      children: [
        { item: 'occultism:storage_stabilizer_tier5' },
        { item: 'occultism:storage_stabilizer_tier5_dark' }
      ]
    }

    var addStabilizedStorage = (dark) => {
      var suffix = dark ? '_dark' : ''
      var controller = `occultism:storage_controller${suffix}`
      var result = `occultism:storage_controller_stabilized${suffix}`
      var originalId = `occultism:ritual/misc_stabilized_storage${suffix}`

      event.remove({ id: originalId })
      event.custom({
        type: 'occultism:ritual',
        activation_item: { item: 'minecraft:calibrated_sculk_sensor' },
        duration: 780,
        entity_to_sacrifice: {
          display_name: 'ritual.occultism.sacrifice.shulker',
          tag: 'c:shulkers'
        },
        ingredients: [
          { item: controller },
          tierFiveStabilizer,
          tierFiveStabilizer,
          tierFiveStabilizer,
          tierFiveStabilizer,
          tierFiveStabilizer,
          tierFiveStabilizer,
          { item: CORE_ARCANE },
          { item: CORE_HYPER }
        ],
        pentacle_id: 'occultism:contact_eldritch_spirit',
        result: { count: 1, id: result },
        ritual_dummy: {
          count: 1,
          id: `occultism:ritual_dummy/misc_stabilized_storage${suffix}`
        },
        ritual_type: 'occultism:upgrade'
      }).id(`kubejs:integration/occultism_stabilized_storage${suffix}`)
    }

    addStabilizedStorage(false)
    addStabilizedStorage(true)
  }

})
