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
//             -> ступени выше 2x
//
//  ОБЪЁМ. Ядра нужны поштучно (1 на машину, машин строят единицы), поэтому
//  гейт платится редко и гриндом не становится — тот же принцип, что
//  и во всех предыдущих правках.
// ============================================================================

ServerEvents.recipes(event => {

  const CORE_I  = 'kubejs:mechanical_core'
  const CORE_II = 'kubejs:resonant_core'

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
  //  Гейт II — ступени выше 2x
  // ==========================================================================
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
