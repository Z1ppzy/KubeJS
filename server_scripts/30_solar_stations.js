// priority: 40
// requires: solarflux
// ignored: true
// ============================================================================
//  ОПЦИОНАЛЬНО — верхние компоненты через станции модов вместо верстака.
//
//  Файл ВЫКЛЮЧЕН директивой "ignored: true" в шапке.
//  Чтобы включить — убери эту строку и сделай /reload.
//
//  ВАЖНО, прочитай перед включением:
//  Схемы JSON у Ars Nouveau и Draconic Evolution меняются между версиями.
//  Вытащи эталонный рецепт прямо из jar и сверь имена полей:
//
//    unzip -p mods/ars_nouveau-*.jar 'data/ars_nouveau/recipe/*.json' | head -80
//    unzip -p mods/Draconic-Evolution-*.jar 'data/draconicevolution/recipe/*fusion*' | head -80
//
//  Если поля не совпадут — рецепт просто не зарегистрируется, а в
//  logs/kubejs/server.log будет ошибка парсинга с указанием проблемного ключа.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) return
  const M = S.mod

  // --- Arcane Solar Core через Enchanting Apparatus (Ars Nouveau) ------------
  // Реагент кладётся в центральный блок, pedestalItems — на аркановые пьедесталы.
  event.remove({ id: 'kubejs:solar/component_arcane' })

  event.custom({
    type: 'ars_nouveau:enchanting_apparatus',
    reagent: [{ item: S.matrix }],
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
    output: { id: S.arcane, count: 1 },
    sourceCost: 10000,
    keepNbtOfReagent: false
  }).id('kubejs:solar/component_arcane_apparatus')

  // --- Draconic Solar Core через Fusion Crafting ----------------------------
  // catalyst кладётся в Fusion Crafting Core, ingredients — в инжекторы.
  event.remove({ id: 'kubejs:solar/component_draconic' })

  event.custom({
    type: 'draconicevolution:fusion_crafting',
    catalyst: { item: S.arcane },
    ingredients: [
      { item: M.awakened },
      { item: M.awakened },
      { item: M.awakened },
      { item: M.awakened },
      { item: M.chaosShard },
      { item: M.coreAwakened },
      { item: M.singularity },
      { item: S.cells[3] }
    ],
    result: { id: S.draconic, count: 1 },
    total_energy: 64000000,
    tier: 3
  }).id('kubejs:solar/component_draconic_fusion')
})
