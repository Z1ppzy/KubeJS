// priority: 30
// requires: solarflux
// requires: enderio
// ============================================================================
//  Альтернативные ветки.
//
//  Директива "requires: enderio" в шапке — файл вообще не загрузится,
//  если мод убрали из сборки. Ошибок в логе не будет.
//
//  У тебя стоит Polymorph, поэтому два рецепта на один выход не конфликтуют:
//  игроку покажут переключатель прямо в сетке крафта.
//
//  Смысл: игрок, который пошёл в Ender IO вместо Powah, не упирается в стену.
//  Цена — гейт становится мягче, один из модов можно проскочить.
//  Не нужна такая свобода — просто удали файл.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) return
  const M = S.mod
  const T = S.tag

  // Photon Capacitor на энергичном сплаве вместо Powah
  event.shaped(S.capacitor, [
    'ELE',
    'LCL',
    'ESE'
  ], {
    E: M.alloyEnergetic,
    L: S.lens,
    C: M.circuitAdv,
    S: T.steel
  }).id('kubejs:solar/component_capacitor_enderio')

  // Quantum Solar Matrix на вибрантном сплаве и октадном конденсаторе
  event.shaped(S.matrix, [
    'KVK',
    'PFP',
    'KOK'
  ], {
    K: S.capacitor,
    V: M.alloyVibrant,
    P: M.procEng,
    F: M.frameAdv,
    O: M.capOctadic
  }).id('kubejs:solar/component_matrix_enderio')
})
