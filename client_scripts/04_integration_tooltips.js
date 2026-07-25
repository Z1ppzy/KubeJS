// priority: 70
// Player-facing explanations for cross-mod recipe gates.

ItemEvents.modifyTooltips(event => {
  event.add('kubejs:automation_bus', [
    '§bПрограммируемый контроллер логистики',
    '§8Связывает CC:Tweaked, Advanced Peripherals, AE2 и LaserIO'
  ])

  event.add('kubejs:neural_calibration_matrix', [
    '§dНаграда за Врата нейронной калибровки',
    '§8Расходуется при симуляции Визера и Дракона Края в HNN'
  ])

  event.add('kubejs:bio_matrix', [
    '§aОснова автоматизированной биотехнологии',
    '§8Нужна для HNN и продвинутых модификаторов спавнеров'
  ])

  event.add('kubejs:hyper_spatial_core',
    '§8Открывает универсальную логистику, чанклодеры и удалённое хранилище')
  event.add('kubejs:chronos_core',
    '§8Открывает максимальные ускорения Pipez и модификацию задержки спавнеров')

  if (Platform.isLoaded('hostilenetworks')) {
    event.add('hostilenetworks:sim_chamber',
      '§8Требует §aБио-матрицу §8— автоматические дропы относятся к биопрогрессии')
    event.add('hostilenetworks:loot_fabricator',
      '§8Требует §aБио-матрицу')
  }

  if (Platform.isLoaded('advancedperipherals')) {
    event.add('advancedperipherals:me_bridge',
      '§8Требует §bШину автоматизации')
    event.add('advancedperipherals:energy_detector',
      '§8Требует §bШину автоматизации')
  }

  if (Platform.isLoaded('merequester')) {
    event.add('merequester:requester',
      '§8Требует §bШину автоматизации')
  }

  if (Platform.isLoaded('pipez')) {
    event.add('pipez:universal_pipe',
      '§8Требует §5Гипер-пространственное ядро')
    event.add('pipez:ultimate_upgrade',
      '§8Требует §6Хроно-ядро')
  }

  if (Platform.isLoaded('chunkloaders')) {
    event.add('chunkloaders:basic_chunk_loader',
      '§8Требует §bРезонансное ядро')
    event.add('chunkloaders:advanced_chunk_loader',
      '§8Требует §5Гипер-пространственное ядро')
    event.add('chunkloaders:ultimate_chunk_loader',
      '§8Требует §dСингулярное §8и §5Гипер-пространственное ядра')
  }

  if (Platform.isLoaded('megacells')) {
    event.add('megacells:cell_component_1m',
      '§8Вход в MEGA-хранилища требует §dКвантовое ядро')
    event.add('megacells:cell_component_64m',
      '§8Ячейки 64M и 256M требуют §dСингулярное ядро')
  }

  if (Platform.isLoaded('extendedae')) {
    event.add('extendedae:pattern_provider_upgrade',
      '§8Требует §bШину автоматизации')
    event.add('extendedae:assembler_matrix_pattern',
      '§8Требует §dКвантовое ядро')
  }

  if (Platform.isLoaded('advanced_ae')) {
    event.add('advanced_ae:quantum_unit',
      '§8Требует §dКвантовое ядро')
  }

  if (Platform.isLoaded('appmek')) {
    event.add('appmek:chemical_cell_housing',
      '§8Требует §bРезонансное ядро')
  }

  if (Platform.isLoaded('sophisticatedbackpacks')) {
    event.add('sophisticatedbackpacks:inception_upgrade',
      '§8Требует §5Гипер-пространственное ядро')
    event.add('sophisticatedbackpacks:stack_upgrade_tier_3',
      '§8Требует §dКвантовое ядро')
    event.add('sophisticatedbackpacks:stack_upgrade_tier_4',
      '§8Требует §dСингулярное ядро')
    event.add('sophisticatedbackpacks:advanced_pump_upgrade',
      '§8Требует §7Механическое ядро')
    event.add('sophisticatedbackpacks:advanced_feeding_upgrade',
      '§8Требует §aБио-матрицу')
  }

  if (Platform.isLoaded('sophisticatedstorage')) {
    event.add('sophisticatedstorage:stack_upgrade_tier_4',
      '§8Требует §dКвантовое ядро')
    event.add('sophisticatedstorage:stack_upgrade_tier_5',
      '§8Требует §dСингулярное ядро')
    event.add('sophisticatedstorage:advanced_feeding_upgrade',
      '§8Требует §aБио-матрицу')
  }

  if (Platform.isLoaded('disenchanting_table')) {
    event.add('disenchanting_table:disenchanting_table',
      '§8Требует §5Арканное ядро')
  }

  if (Platform.isLoaded('apothic_enchanting')) {
    event.add('apothic_enchanting:library',
      '§8Требует §5Арканное ядро')
    event.add('apothic_enchanting:scrap_tome',
      '§8Создание комплекта томов требует §5Арканное ядро')
  }

  if (Platform.isLoaded('arseng')) {
    event.add('arseng:source_cell_housing',
      '§8Требует §5Арканное ядро')
  }

  if (Platform.isLoaded('occultism')) {
    event.add('occultism:storage_remote',
      '§8Ритуал требует §5Арканное §8и §5Гипер-пространственное ядра')
    event.add('occultism:storage_controller_stabilized',
      '§8Высшая стабилизация требует §5Арканное §8и §5Гипер-пространственное ядра')
    event.add('occultism:storage_controller_stabilized_dark',
      '§8Высшая стабилизация требует §5Арканное §8и §5Гипер-пространственное ядра')
  }
})
