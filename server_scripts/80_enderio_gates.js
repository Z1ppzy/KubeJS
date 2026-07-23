// priority: 10
// requires: enderio
// ============================================================================
//  Ender IO — стыковка с паком.
//
//  ЧТО ПОКАЗАЛА РАЗВЕДКА. Ender IO внутри выстроен честно, как и Mekanism:
//  цепочка сплавов гейтится ВАНИЛЬНЫМИ вехами, а не дешевизной —
//      медь+железо -> conductive
//      +золото+редстоун -> energetic
//      +эндер-жемчуг+светокамень -> vibrant
//      +энд-камень -> end steel
//  то есть Оверворлд -> Нижний мир -> Энд. Обогащение руды (SAG Mill) не
//  трогаем по той же причине, что и у Mekanism: то же самое делают IF, MI,
//  Oritech — это задача техно-спины, а не отдельного мода.
//  Силовой спавнер тоже оставлен: он требует broken_spawner, то есть реально
//  найденный спавнер в мире. Это законный гейт.
//
//  НАСТОЯЩАЯ ПРОБЛЕМА не в дешевизне, а в ИЗОЛЯЦИИ: Ender IO проходится
//  целиком на ванильных материалах, соседние моды ему не нужны никогда.
//  Плюс у него СВОЯ солнечная линейка — уже третья в паке после Solar Flux
//  и Powah, и она снова конкурирует с нашей пирамидой вместо стыковки.
//
//  ДВЕ ПРАВКИ, обе низкообъёмные (1 предмет на крафт, гринда не создают):
//
//  1) СОЛНЕЧНЫЕ МОДУЛИ. Модули цепляются лесенкой:
//         vibrant <- pulsating <- energetic
//     Значит гейт на ВХОДНОЙ модуль закрывает всю линейку одной правкой.
//     В energetic-модуль вместо редстоуна идёт фотоэлемент Solar Flux.
//     Тот же приём, что с photoelectric_pane у Powah (50_powah_gates.js):
//     теперь ВСЁ солнце пака — SFR, Powah, Ender IO — течёт через нашу
//     прогрессию фотоэлементов, а не соревнуется с ней.
//     Плиту (photovoltaic_plate) и композит НЕ трогаем: их нужно по 3 и по 6
//     на модуль, гейт там превратился бы в гринд.
//
//  2) ОКТАДНЫЙ КОНДЕНСАТОР — вершина энергетики Ender IO. Используется всего
//     в трёх местах (vibrant-банк, его апгрейд, vibrant-модуль), поэтому
//     гейтить безопасно. Вместо светокамня в сердце — пылающий кристалл Powah.
//     История: конденсатор высшей плотности берёт заряженный кристалл как
//     диэлектрик. Берём именно blazing: он НЕ входит в лестницу сплавов из
//     50_powah_gates.js, поэтому цепочка модов не разрастается — достаточно
//     завести орб Powah, а не проходить весь Mekanism.
//
//  Удаляем по паре тип+выход — пути ID между версиями переезжают.
// ============================================================================

ServerEvents.recipes(event => {

  // --- 1. Вход в солнечную линейку Ender IO ---------------------------------
  if (Platform.isLoaded('solarflux')) {
    event.remove({
      type: 'minecraft:crafting_shaped',
      output: 'enderio:energetic_photovoltaic_module'
    })
    event.shaped('enderio:energetic_photovoltaic_module', [
      'EFE',
      'PPP',
      'CSC'
    ], {
      E: '#c:ingots/gold',
      F: '#c:glass_blocks',
      P: 'enderio:photovoltaic_plate',
      C: 'enderio:basic_capacitor',
      S: 'solarflux:photovoltaic_cell_1'
    }).id('kubejs:enderio/energetic_photovoltaic_module')
  }

  // --- 2. Октадный конденсатор ----------------------------------------------
  if (Platform.isLoaded('powah')) {
    event.remove({ type: 'minecraft:crafting_shaped', output: 'enderio:octadic_capacitor' })
    event.shaped('enderio:octadic_capacitor', [
      ' I ',
      'CBC',
      ' I '
    ], {
      I: '#c:ingots/vibrant_alloy',
      C: 'enderio:double_layer_capacitor',
      B: 'powah:crystal_blazing'
    }).id('kubejs:enderio/octadic_capacitor')
  }
})
