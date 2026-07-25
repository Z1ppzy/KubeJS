import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import zlib from 'node:zlib'

const root = path.resolve(import.meta.dirname, '..')
const failures = []

const fail = message => failures.push(message)

const walk = directory => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

const relative = file => path.relative(root, file).replaceAll('\\', '/')

for (const directory of ['startup_scripts', 'server_scripts', 'client_scripts']) {
  for (const file of walk(path.join(root, directory)).filter(file => file.endsWith('.js'))) {
    try {
      new vm.Script(fs.readFileSync(file, 'utf8'), { filename: relative(file) })
    } catch (error) {
      fail(`JavaScript syntax: ${relative(file)}: ${error.message}`)
    }
  }
}

const generatedRecipeIds = []
const chain = {
  id(value) {
    if (value) generatedRecipeIds.push(String(value))
    return this
  },
  texture() {
    return this
  },
  rarity() {
    return this
  },
  maxStackSize() {
    return this
  },
  glow() {
    return this
  }
}

const recipeStats = { added: 0, removed: 0, tooltips: 0, items: 0 }
const recipeEvent = {
  remove() {
    recipeStats.removed++
  },
  shaped() {
    recipeStats.added++
    return chain
  },
  shapeless() {
    recipeStats.added++
    return chain
  },
  custom() {
    recipeStats.added++
    return chain
  }
}

const runtimeContext = vm.createContext({
  console,
  Platform: { isLoaded: () => true },
  Item: { exists: () => true },
  ServerEvents: { recipes: callback => callback(recipeEvent) },
  StartupEvents: {
    registry: (_registry, callback) => callback({
      create() {
        recipeStats.items++
        return chain
      }
    })
  },
  ItemEvents: {
    modifyTooltips: callback => callback({
      add() {
        recipeStats.tooltips++
      }
    })
  }
})

for (const file of [
  'startup_scripts/02_tech_cores.js',
  'server_scripts/97_logistics_automation.js',
  'server_scripts/98_neural_magic_integrations.js',
  'client_scripts/04_integration_tooltips.js'
]) {
  const fullPath = path.join(root, file)
  if (!fs.existsSync(fullPath)) continue
  try {
    new vm.Script(fs.readFileSync(fullPath, 'utf8'), { filename: file }).runInContext(runtimeContext)
  } catch (error) {
    fail(`Mock KubeJS execution: ${file}: ${error.message}`)
  }
}

if (recipeStats.added < 25) fail(`Expected at least 25 integration recipes, found ${recipeStats.added}`)
if (recipeStats.removed < 25) fail(`Expected at least 25 removed/replaced recipes, found ${recipeStats.removed}`)
if (recipeStats.tooltips < 25) fail(`Expected at least 25 integration tooltips, found ${recipeStats.tooltips}`)
if (recipeStats.items < 11) fail(`Expected all custom item registrations, found ${recipeStats.items}`)

const duplicateRecipeIds = generatedRecipeIds.filter((id, index) => generatedRecipeIds.indexOf(id) !== index)
for (const id of new Set(duplicateRecipeIds)) fail(`Duplicate generated recipe ID: ${id}`)

for (const directory of ['assets', 'data']) {
  for (const file of walk(path.join(root, directory)).filter(file => file.endsWith('.json'))) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      fail(`JSON syntax: ${relative(file)}: ${error.message}`)
    }
  }
}

for (const directory of ['startup_scripts', 'server_scripts', 'client_scripts', 'assets', 'data', 'tools']) {
  for (const file of walk(path.join(root, directory)).filter(file => /\.(?:js|mjs|json)$/.test(file))) {
    const fileName = relative(file)
    const isIntegrationFile = /^(?:startup_scripts\/02_tech_cores\.js|server_scripts\/9[78]_|client_scripts\/04_|assets\/kubejs\/lang\/|data\/(?:apothic_spawners|hostilenetworks|kubejs\/(?:gateways|recipe|silentgear_materials))\/|tools\/)/.test(fileName)
    if (!isIntegrationFile) continue

    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    lines.forEach((line, index) => {
      if (/[ \t]+$/.test(line)) fail(`Trailing whitespace: ${fileName}:${index + 1}`)
    })
  }
}

const requiredFiles = [
  'server_scripts/97_logistics_automation.js',
  'server_scripts/98_neural_magic_integrations.js',
  'client_scripts/04_integration_tooltips.js',
  'data/kubejs/gateways/neural_calibration.json',
  'data/kubejs/recipe/neural_calibration_gateway.json',
  'data/hostilenetworks/data_models/ender_dragon.json',
  'data/hostilenetworks/data_models/wither.json',
  'data/apothic_spawners/recipe/spawner_modifiers/ignore_players.json',
  'data/apothic_spawners/recipe/spawner_modifiers/ignore_conditions.json',
  'data/apothic_spawners/recipe/spawner_modifiers/ignore_light.json',
  'data/apothic_spawners/recipe/spawner_modifiers/redstone_control.json',
  'data/apothic_spawners/recipe/spawner_modifiers/min_delay.json',
  'data/apothic_spawners/recipe/spawner_modifiers/max_nearby.json',
  'data/apothic_spawners/recipe/spawner_modifiers/spawn_count.json',
  'data/kubejs/silentgear_materials/dark_steel.json',
  'data/kubejs/silentgear_materials/refined_obsidian.json',
  'data/kubejs/silentgear_materials/draconium.json',
  'data/kubejs/silentgear_materials/duratium.json',
  'assets/kubejs/textures/item/automation_bus.png',
  'assets/kubejs/textures/item/neural_calibration_matrix.png'
]

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`)
}

const startupPath = path.join(root, 'startup_scripts/02_tech_cores.js')
if (fs.existsSync(startupPath)) {
  const startup = fs.readFileSync(startupPath, 'utf8')
  for (const item of ['automation_bus', 'neural_calibration_matrix']) {
    if (!startup.includes(`event.create('${item}')`)) fail(`Missing item registration: kubejs:${item}`)
  }
}

const expectedTranslations = [
  'item.kubejs.automation_bus',
  'item.kubejs.neural_calibration_matrix',
  'kubejs.neural_calibration',
  'material.kubejs.dark_steel',
  'material.kubejs.refined_obsidian',
  'material.kubejs.draconium',
  'material.kubejs.duratium'
]

for (const locale of ['en_us', 'ru_ru']) {
  const file = path.join(root, `assets/kubejs/lang/${locale}.json`)
  if (!fs.existsSync(file)) {
    fail(`Missing localization file: ${relative(file)}`)
    continue
  }

  try {
    const translations = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const key of expectedTranslations) {
      if (!translations[key]) fail(`Missing ${locale} translation: ${key}`)
    }
  } catch {
    // JSON syntax failure is reported above.
  }
}

for (const texture of ['automation_bus.png', 'neural_calibration_matrix.png']) {
  const file = path.join(root, 'assets/kubejs/textures/item', texture)
  if (!fs.existsSync(file)) continue

  const buffer = fs.readFileSync(file)
  const isPng = buffer.length >= 24 && buffer.subarray(1, 4).toString('ascii') === 'PNG'
  if (!isPng) {
    fail(`Texture is not PNG: ${relative(file)}`)
    continue
  }

  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  if (width !== 16 || height !== 16) {
    fail(`Texture must be 16x16: ${relative(file)} is ${width}x${height}`)
  }

  if (buffer[25] !== 6) {
    fail(`Texture must use RGBA color for transparency: ${relative(file)}`)
    continue
  }

  const idatChunks = []
  let offset = 8
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii')
    if (type === 'IDAT') idatChunks.push(buffer.subarray(offset + 8, offset + 8 + length))
    offset += 12 + length
  }

  try {
    const scanlines = zlib.inflateSync(Buffer.concat(idatChunks))
    const alphas = []
    for (let y = 0; y < height; y++) {
      const rowOffset = y * (1 + width * 4)
      if (scanlines[rowOffset] !== 0) throw new Error('unsupported PNG filter')
      for (let x = 0; x < width; x++) alphas.push(scanlines[rowOffset + 1 + x * 4 + 3])
    }
    if (!alphas.includes(0) || !alphas.some(alpha => alpha > 0)) {
      fail(`Texture must contain both transparent and visible pixels: ${relative(file)}`)
    }
  } catch (error) {
    fail(`Could not validate texture transparency: ${relative(file)}: ${error.message}`)
  }
}

const customDependencies = {
  mechanical_core: [],
  resonant_core: ['mechanical_core'],
  quantum_core: ['resonant_core'],
  arcane_core: ['resonant_core'],
  singularity_core: ['quantum_core'],
  hyper_spatial_core: ['resonant_core'],
  chronos_core: ['prismatic_focus'],
  bio_matrix: ['mechanical_core'],
  automation_bus: ['resonant_core'],
  neural_calibration_matrix: ['bio_matrix']
}

const visiting = new Set()
const visited = new Set()

const visit = item => {
  if (visiting.has(item)) {
    fail(`Circular custom-item dependency detected at kubejs:${item}`)
    return
  }
  if (visited.has(item)) return

  visiting.add(item)
  for (const dependency of customDependencies[item] ?? []) {
    if (customDependencies[dependency]) visit(dependency)
  }
  visiting.delete(item)
  visited.add(item)
}

for (const item of Object.keys(customDependencies)) visit(item)

const coreIngredients = new Set([
  'ae2:fluix_crystal',
  'ae2:singularity',
  'ars_nouveau:source_gem_block',
  'enderio:vibrant_alloy_ingot',
  'industrialforegoing:plastic',
  'mekanism:pellet_antimatter',
  'mekanism:teleportation_core',
  'modern_industrialization:quantum_circuit',
  'mysticalagradditions:insanium_essence',
  'mysticalagriculture:fertilized_essence',
  'occultism:spirit_attuned_gem'
])

const gatedOutputs = new Set([
  'advanced_ae:quantum_unit',
  'advancedperipherals:energy_detector',
  'advancedperipherals:me_bridge',
  'appmek:chemical_cell_housing',
  'arseng:source_cell_housing',
  'chunkloaders:advanced_chunk_loader',
  'chunkloaders:basic_chunk_loader',
  'chunkloaders:ultimate_chunk_loader',
  'disenchanting_table:disenchanting_table',
  'extendedae:assembler_matrix_pattern',
  'extendedae:pattern_provider_upgrade',
  'hostilenetworks:loot_fabricator',
  'hostilenetworks:sim_chamber',
  'megacells:cell_component_1m',
  'megacells:cell_component_64m',
  'merequester:requester',
  'occultism:storage_remote',
  'pipez:ultimate_upgrade',
  'pipez:universal_pipe',
  'sophisticatedbackpacks:inception_upgrade',
  'sophisticatedbackpacks:stack_upgrade_tier_3',
  'sophisticatedbackpacks:stack_upgrade_tier_4',
  'sophisticatedstorage:stack_upgrade_tier_4',
  'sophisticatedstorage:stack_upgrade_tier_5'
])

for (const item of coreIngredients) {
  if (gatedOutputs.has(item)) fail(`Core ingredient is gated by itself or a downstream integration: ${item}`)
}

if (failures.length > 0) {
  console.error(`Integration validation failed (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Integration validation passed.')
console.log(`Checked ${walk(path.join(root, 'startup_scripts')).filter(file => file.endsWith('.js')).length
  + walk(path.join(root, 'server_scripts')).filter(file => file.endsWith('.js')).length
  + walk(path.join(root, 'client_scripts')).filter(file => file.endsWith('.js')).length} JavaScript files.`)
console.log(`Checked ${walk(path.join(root, 'assets')).filter(file => file.endsWith('.json')).length
  + walk(path.join(root, 'data')).filter(file => file.endsWith('.json')).length} JSON files.`)
console.log(`Mock-loaded ${recipeStats.added} recipes, ${recipeStats.removed} replacements, and ${recipeStats.tooltips} tooltips.`)
console.log('Dependency graph is acyclic.')
