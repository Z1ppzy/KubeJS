// priority: 40
// requires: solarflux
// ============================================================================
//  Верхние компоненты через станции модов вместо верстака.
//
//  Arcane Solar Core  -> только Enchanting Apparatus (Ars Nouveau)
//  Draconic Solar Core -> только Fusion Crafting (Draconic Evolution)
//  Чтобы вернуть верстак — добавь в шапку строку "// ignored: true" и /reload.
//
//  Схемы JSON сверены с jar'ами сборки (23.07.2026):
//    ars_nouveau-1.21.1-5.12.1:  reagent — ОБЪЕКТ (не массив!), поле result
//    Draconic-Evolution-3.1.4:   ingredients [{consume, ingredient}],
//                                techLevel строкой, totalEnergy
//  Если рецепт всё же не зарегистрируется — ошибка парсинга будет в
//  logs/kubejs/server.log с указанием проблемного ключа.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) return
  const M = S.mod

  // ВАЖНО про Rhino: объявлять const/let ВНУТРИ блока (if/for) нельзя —
  // движок поднимает такие объявления в область функции как var, и при
  // повторном вызове колбэка падает с "redeclaration of var". Поэтому все
  // хелперы объявляем строго здесь, на верхнем уровне.
  const fusionItem = id => ({ consume: true, ingredient: { item: id } })

  // --- Arcane Solar Core через Enchanting Apparatus (Ars Nouveau) ------------
  // Реагент кладётся в центральный блок, pedestalItems — на аркановые пьедесталы.
  if (Platform.isLoaded('ars_nouveau')) {
    event.remove({ id: 'kubejs:solar/component_arcane' })

    event.custom({
      type: 'ars_nouveau:enchanting_apparatus',
      reagent: { item: S.matrix },
      pedestalItems: [
        { item: M.sourceBlock },
        { item: M.sourceBlock },
        { item: M.essManipulation },
        { item: M.wildenTribute },
        { item: M.iesnium },
        { item: M.spiritGem },
        { item: S.cells[3] },
        { item: S.capacitor }
      ],
      result: { count: 1, id: S.arcane },
      sourceCost: 10000,
      keepNbtOfReagent: false
    }).id('kubejs:solar/component_arcane_apparatus')
  }

  // --- Draconic Solar Core через Fusion Crafting ----------------------------
  // catalyst кладётся в Fusion Crafting Core, ingredients — в инжекторы.
  if (Platform.isLoaded('draconicevolution')) {
    event.remove({ id: 'kubejs:solar/component_draconic' })

    event.custom({
      type: 'draconicevolution:fusion_crafting',
      catalyst: { item: S.arcane },
      ingredients: [
        fusionItem(M.awakened),
        fusionItem(M.awakened),
        fusionItem(M.awakened),
        fusionItem(M.awakened),
        fusionItem(M.chaosShard),
        fusionItem(M.coreAwakened),
        fusionItem(M.singularity),
        fusionItem(S.cells[3])
      ],
      result: { count: 1, id: S.draconic },
      techLevel: 'draconic',
      totalEnergy: 64000000
    }).id('kubejs:solar/component_draconic_fusion')
  }
})
