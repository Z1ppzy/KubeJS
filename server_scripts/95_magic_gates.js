// priority: 6
// requires: occultism
// ============================================================================
//  Магия — стыковка с системой ядер.
//
//  ARS NOUVEAU: чист, правок не потребовалось. Проверено поиском по всем
//  1012 рецептам — мод не производит ресурсы чужих модов (единственное
//  совпадение, archmage_book_upgrade, незер-звезду ПОТРЕБЛЯЕТ, а не выдаёт).
//  Ars Energistique — только хранение источника в ME-ячейках, не обход гейтов.
//  Связь с паком у Ars уже есть с нашей стороны: арканное солнечное ядро
//  (10_solar_components.js) требует его материалы для панели VII.
//
//  OCCULTISM: одна крупная дыра — Dimensional Mineshaft.
//  Духи-шахтёры выдают руду ИЗ НИЧЕГО, 194 рецепта. Среди них:
//      c:ores/draconium, c:ores/certus_quartz, c:ores/uranium,
//      c:ores/osmium, c:ores/iridium, c:ores/platinum,
//  а на eldritch-тире — сразу БЛОКИ сырья (raw_iridium, raw_osmium,
//  raw_platinum, raw_uranium). Это обход всей системы ядер: ресурсы можно
//  получать, не тронув ни одного техно-мода.
//
//  ПОЧЕМУ ГЕЙТИМ ШАХТУ, А НЕ ДУХА. Первой мыслью было загейтить
//  miner_djinni_ores — «специалиста по руде». Но тег occultism:miners/ores
//  включает и miner_foliot_unspecialized, то есть БАЗОВОГО духа: рудные
//  рецепты работают уже с ним. Шахта — единственная общая точка, без неё
//  не работает ни один шахтёр.
//
//  ТИР II, как у Ore Laser Base из 90_tech_cores.js: бесконечная генерация
//  руды сильнее любого множителя, поэтому стоит на ступень выше 2x-обогащения.
//
//  ВАЖНО ПРО РИТУАЛ: ингредиент ДОБАВЛЯТЬ нельзя — пентакль рассчитан на
//  фиксированное число предметов вокруг. Поэтому не добавляем восьмой, а
//  ЗАМЕНЯЕМ один из четырёх камней Иного мира на ядро: количество сохранено.
//  ritual_dummy и pentacle_id переносим без изменений, иначе ритуал не соберётся.
// ============================================================================

ServerEvents.recipes(event => {

  const CORE_II = 'kubejs:resonant_core'

  // --- Dimensional Mineshaft ------------------------------------------------
  event.remove({ type: 'occultism:ritual', output: 'occultism:dimensional_mineshaft' })

  const otherstone = {
    type: 'neoforge:compound',
    children: [
      { item: 'occultism:otherstone' },
      { item: 'occultism:otherrock' }
    ]
  }

  event.custom({
    type: 'occultism:ritual',
    activation_item: { item: 'occultism:book_of_binding_bound_djinni' },
    duration: 150,
    ingredients: [
      otherstone,
      otherstone,
      otherstone,
      { item: CORE_II },                       // был четвёртый камень Иного мира
      { tag: 'c:ingots/gold' },
      { tag: 'c:storage_blocks/iesnium' },
      { item: 'occultism:spirit_attuned_crystal' }
    ],
    pentacle_id: 'occultism:craft_djinni',
    result: { count: 1, id: 'occultism:dimensional_mineshaft' },
    ritual_dummy: { count: 1, id: 'occultism:ritual_dummy/craft_dimensional_mineshaft' },
    ritual_type: 'occultism:craft'
  }).id('kubejs:magic/dimensional_mineshaft')

  // --- Драконий духами ------------------------------------------------------
  // Третья и последняя дыра в защите Draconic. Уже закрыты:
  //   60_mystag_gates.js — фарм эссенцией
  //   90_tech_cores.js   — лазер Industrial Foregoing
  // Выход рецепта — ТЕГ (c:ores/draconium), не предмет, поэтому снимаем по ID.
  event.remove({ id: 'occultism:miner/ores/draconium_ore' })
})
