// priority: 60
// requires: solarflux
// ============================================================================
//  Фотоэлектрические ячейки I-VI.
//
//  Дефолтные рецепты SFR (лазурит, глина, эндер-глаз...) отключаются в
//  config/solarflux/recipes.cfg (solarflux:photovoltaic_cell_1..6 = false),
//  из KubeJS их не убрать — HammerLib регистрирует их после нас.
//
//  Единая схема — «сечение солнечной панели»:
//      GGG     G = стекло (сверху)
//      PXP     P = фотослой-пигмент эпохи, X = зеркало (I) / пред. ячейка
//      SSS     S = металлическая подложка (снизу)
//
//  Пигмент задаёт цвет и гейт тира:
//      I   редстоун          (ваниль, день 1)
//      II  изумрудное стекло (SFR, изумруды фармятся семенами MystAg)
//      III пылающий кристалл (Powah — тот же гейт, что у Photon Capacitor)
//      IV  флюикс            (AE2 — уже пройден к T5-T6, куда идут эти ячейки)
//      V   релейный кристалл (DE, wyvern-тир)
//      VI  пробуждённый драконий слиток
//
//  Выход I-IV по 4 шт: пирамида панелей жрёт ячейки сотнями, себестоимость
//  штуки должна быть копеечной. V-VI по 2 шт — их нужно всего по паре
//  на DE-панель.
// ============================================================================

ServerEvents.recipes(event => {
  const S = global.SOLAR
  if (!S) {
    console.error('[SolarFlux] global.SOLAR отсутствует. Проверь, что startup_scripts/00_solar_globals.js на месте, и перезапусти сервер — /reload startup-скрипты не перечитывает.')
    return
  }
  const M = S.mod
  const T = S.tag
  const C = t => S.cells[t - 1]

  // Хелпер: слойка стекло/фотослой/подложка
  const cell = (tier, count, glass, pigment, core, base) => {
    return event.shaped(Item.of(C(tier), count), [
      'GGG',
      'PXP',
      'SSS'
    ], { G: glass, P: pigment, X: core, S: base })
      .id(`kubejs:solar/cell_${tier}`)
  }

  // --- I. Ваниль, день 1. Зеркало SFR наконец при деле -----------------------
  cell(1, 4, T.glassPane, T.redstone, S.mirror, T.copper)

  // --- II. Гейт: сталь (как у панели T2) -------------------------------------
  cell(2, 4, T.glassPane, S.sfr.emeraldGlass, C(1), T.steel)

  // --- III. Гейт: Powah (Energizing Orb) — синхронно с Photon Capacitor ------
  cell(3, 4, T.glassPane, M.crystalBlazing, C(2), M.energizedSteel)

  // --- IV. Гейт: AE2 + MI — синхронно с Quantum Solar Matrix -----------------
  cell(4, 4, S.sfr.enderGlass, M.fluix, C(3), M.miStainless)

  // --- V. Гейт: Draconic Evolution (wyvern-тир) ------------------------------
  cell(5, 2, S.sfr.enderGlass, M.relayBasic, C(4), M.draconium)

  // --- VI. Гейт: пробуждённый драконий ---------------------------------------
  cell(6, 2, S.sfr.enderGlass, M.awakened, C(5), M.draconium)
})
