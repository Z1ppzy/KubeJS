// priority: 90
// ============================================================================
//  Подсказки по индустриальным ядрам.
//
//  Это важнее, чем кажется: гейт, о котором игрок не знает, читается как
//  поломка пака. Человек открывает EMI, видит незнакомый предмет в рецепте
//  дробилки и решает, что что-то сломалось. Тултип объясняет правило сразу.
//
//  §7 серый  §8 т.-серый  §b голубой  §6 золотой  §a зелёный
// ============================================================================

ItemEvents.modifyTooltips(event => {

  event.add('kubejs:mechanical_core', [
    '§7Открывает §bобогащение руды §7во всех модах',
    '§8Нужен для: Enrichment Chamber, SAG Mill,',
    '§8Pulverizer, Bronze Macerator',
    '§8Собирается на раннем Mekanism — обогащение для него не нужно'
  ])

  event.add('kubejs:resonant_core', [
    '§7Открывает ступени §bвыше 2x §7и §bгенерацию руды',
    '§8Нужен для: Purification Chamber (3x) и всей цепочки',
    '§8выше неё, Ore Laser Base, Dimensional Mineshaft'
  ])

  // Метки на самих машинах — чтобы правило было видно с обеих сторон
  const gated = {
    'mekanism:enrichment_chamber': '§8Требует §7Механическое ядро',
    'enderio:sag_mill': '§8Требует §7Механическое ядро',
    'oritech:pulverizer_block': '§8Требует §7Механическое ядро',
    'modern_industrialization:bronze_macerator': '§8Требует §7Механическое ядро',
    'mekanism:purification_chamber': '§8Требует §7Резонансное ядро',
    'industrialforegoing:ore_laser_base': '§8Требует §7Резонансное ядро',
    'occultism:dimensional_mineshaft': '§8Ритуал требует §7Резонансное ядро'
  }
  Object.keys(gated).forEach(id => event.add(id, gated[id]))
})
