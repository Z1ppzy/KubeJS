// priority: 100
// requires: solarflux
// ============================================================================
//  Кастомные компоненты для солнечных панелей.
//  Меняется только при перезапуске игры (startup_scripts не ловят /reload).
//
//  Текстуры:  kubejs/assets/kubejs/textures/item/<id>.png   (16x16)
//  Названия:  kubejs/assets/kubejs/lang/{en_us,ru_ru}.json
//  Теги:      kubejs/data/kubejs/tags/item/solar_components.json
// ============================================================================

StartupEvents.registry('item', event => {

  // Тир I-II — стекло + медь, доступно в первый день
  event.create('solar_lens')
    .rarity('common')
    .maxStackSize(64)

  // Тир III-IV — Powah + схемы Mekanism
  event.create('photon_capacitor')
    .rarity('uncommon')
    .maxStackSize(64)

  // Тир V-VI — AE2 + Industrial Foregoing + Modern Industrialization
  event.create('quantum_solar_matrix')
    .rarity('rare')
    .maxStackSize(16)

  // Тир VII — Ars Nouveau + Occultism + Mystical Agriculture
  event.create('arcane_solar_core')
    .rarity('rare')
    .maxStackSize(16)

  // Тир VIII — Draconic Evolution
  event.create('draconic_solar_core')
    .rarity('epic')
    .maxStackSize(16)
})
