// priority: 90
// ============================================================================
//  Индустриальные ядра — общий хребет техно-прогрессии пака.
//
//  Зачем: в сборке пять техно-модов (Mekanism, Ender IO, MI, Oritech, IF),
//  и каждый давал обогащение руды с первого дня. Игрок брал самый дешёвый
//  и обгонял остальных. Ядра делают темп общим: чем бы ты ни играл,
//  ступень обогащения открывается через одну и ту же деталь.
//
//  Меняется только при перезапуске игры (startup_scripts не ловят /reload).
//
//  Текстуры:  kubejs/assets/kubejs/textures/item/<id>.png   (16x16)
//  Названия:  kubejs/assets/kubejs/lang/{en_us,ru_ru}.json
//  Рецепты и гейты: server_scripts/90_tech_cores.js
// ============================================================================

StartupEvents.registry('item', event => {

  // Тир I — ранний Mekanism (сталь, сплав, схема). Открывает 2x обогащение
  // во всех модах. Осознанно НЕ требует самого обогащения, иначе цикл.
  event.create('mechanical_core')
    .texture('kubejs:item/mechanical_core')
    .rarity('common')
    .maxStackSize(16)

  // Тир II — средний Mekanism + Powah. Открывает ступени выше 2x.
  event.create('resonant_core')
    .texture('kubejs:item/resonant_core')
    .rarity('uncommon')
    .maxStackSize(16)

  // Тир III — эндгейм-технологии Mekanism + Modern Industrialization.
  // Гейт в механизмы и слияние Draconic Evolution.
  event.create('quantum_core')
    .texture('kubejs:item/quantum_core')
    .rarity('epic')
    .maxStackSize(16)

  // Магический тир — связка Ars Nouveau + Occultism + Mystical Agriculture.
  // Гейт в высшие ритуалы, архимагию и семена 5+ тира.
  event.create('arcane_core')
    .texture('kubejs:item/arcane_core')
    .rarity('rare')
    .maxStackSize(16)

  // Тир IV — Абсолютный гипер-эндгейм (AE2 + Mek Antimatter + DE Chaotic).
  // Главное связующее ядро гипер-автоматизации и реакторов.
  event.create('singularity_core')
    .texture('kubejs:item/singularity_core')
    .rarity('epic')
    .glow(true)
    .maxStackSize(16)

  // Оптические компоненты для лазерных установок и матриц
  event.create('photon_lens')
    .texture('kubejs:item/photon_lens')
    .rarity('uncommon')
    .maxStackSize(64)

  event.create('prismatic_focus')
    .texture('kubejs:item/prismatic_focus')
    .rarity('rare')
    .maxStackSize(64)

  // Межпространственная логистика и беспроводная передача энергии.
  event.create('hyper_spatial_core')
    .texture('kubejs:item/hyper_spatial_core')
    .rarity('rare')
    .maxStackSize(16)

  // Ускорение процессов и скоростные апгрейды.
  event.create('chronos_core')
    .texture('kubejs:item/chronos_core')
    .rarity('rare')
    .maxStackSize(16)

  // Автоматические фермы, растения и переработка мобов.
  event.create('bio_matrix')
    .texture('kubejs:item/bio_matrix')
    .rarity('uncommon')
    .maxStackSize(16)
})

