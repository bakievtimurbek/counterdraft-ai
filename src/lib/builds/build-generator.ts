import { Hero, Position, HeroBuildRecommendation, ItemDetail } from '@/types/dota'
import { ITEMS, getItemByName } from '@/data/items'

export function generateHeroBuild(
  hero: Hero,
  position: Position,
  enemyTeam: Hero[] = []
): HeroBuildRecommendation {
  const starting: ItemDetail[] = []
  const early: ItemDetail[] = []
  const core: ItemDetail[] = []
  const situational: ItemDetail[] = []
  const late: ItemDetail[] = []

  const tango = getItemByName('item_tango')!
  const branches = getItemByName('item_branches')!
  const wand = getItemByName('item_magic_wand')!
  const bkb = getItemByName('item_black_king_bar')!
  const blink = getItemByName('item_blink')!

  // --- 1. Starting Items ---
  starting.push(tango, branches)
  if (hero.attack_type === 'Melee' && position <= 3) {
    const qb = getItemByName('item_quelling_blade')
    if (qb) starting.push(qb)
  }
  const enemyHasSpam = enemyTeam.some((e) => ['Batrider', 'Bristleback', 'Zeus', 'Skywrath Mage', 'Phantom Assassin'].includes(e.localized_name))
  if (enemyHasSpam) {
    const stick = getItemByName('item_magic_stick')
    if (stick) starting.push(stick)
  } else {
    const circlet = getItemByName('item_circlet')
    if (circlet) starting.push(circlet)
  }

  // --- 2. Early Game ---
  early.push(wand)
  if (position === 1) {
    const treads = getItemByName('item_power_treads')
    const falcon = getItemByName('item_falcon_blade')
    if (treads) early.push(treads)
    if (falcon) early.push(falcon)
  } else if (position === 2) {
    const pt = getItemByName('item_power_treads') || getItemByName('item_phase_boots')
    if (pt) early.push(pt)
  } else if (position === 3) {
    const phase = getItemByName('item_phase_boots')
    const bracer = getItemByName('item_bracer')
    if (phase) early.push(phase)
    if (bracer) early.push(bracer)
  } else {
    // Supports 4 & 5
    const boots = position === 4 ? getItemByName('item_tranquil_boots') : getItemByName('item_arcane_boots')
    if (boots) early.push(boots)
  }

  // --- 3. Core Items ---
  if (position === 1) {
    if (hero.attack_type === 'Melee') {
      const bf = getItemByName('item_bfury')
      const manta = getItemByName('item_manta')
      if (bf) core.push(bf)
      if (manta) core.push(manta)
    } else {
      const mael = getItemByName('item_maelstrom')
      const manta = getItemByName('item_manta')
      if (mael) core.push(mael)
      if (manta) core.push(manta)
    }
    core.push(bkb)
  } else if (position === 2) {
    core.push(blink, bkb)
  } else if (position === 3) {
    core.push(blink, bkb)
  } else if (position === 4) {
    const glimmer = getItemByName('item_glimmer_cape')
    const force = getItemByName('item_force_staff')
    if (glimmer) core.push(glimmer)
    if (force) core.push(force)
    core.push(blink)
  } else {
    // Pos 5
    const glimmer = getItemByName('item_glimmer_cape')
    const force = getItemByName('item_force_staff')
    if (glimmer) core.push(glimmer)
    if (force) core.push(force)
  }

  // --- 4. Situational / Dynamic Counter Items ---
  // Anti-Heal check
  const enemyHasHeal = enemyTeam.some((e) =>
    ['Alchemist', 'Necrophos', 'Huskar', 'Morphling', 'Pudge', 'Bristleback'].includes(e.localized_name)
  )
  if (enemyHasHeal) {
    const vessel = getItemByName('item_spirit_vessel')
    const skadi = getItemByName('item_skadi')
    if (position >= 4 && vessel) situational.push(vessel)
    else if (position <= 2 && skadi) situational.push(skadi)
  }

  // Anti-Evasion check
  const enemyHasEvasion = enemyTeam.some((e) =>
    ['Phantom Assassin', 'Windranger', 'Brewmaster'].includes(e.localized_name)
  )
  if (enemyHasEvasion && position <= 2) {
    const mkb = getItemByName('item_monkey_king_bar')
    if (mkb) situational.push(mkb)
  }

  // Anti-Passive / Break check
  const enemyHasPassives = enemyTeam.some((e) =>
    ['Bristleback', 'Spectre', 'Phantom Assassin', 'Timbersaw', 'Viper'].includes(e.localized_name)
  )
  if (enemyHasPassives && position <= 3) {
    const silver = getItemByName('item_silver_edge')
    if (silver) situational.push(silver)
  }

  // Anti-Target Spell / Linken check
  const enemyHasTargetUlt = enemyTeam.some((e) =>
    ['Doom', 'Legion Commander', 'Bane', 'Beastmaster'].includes(e.localized_name)
  )
  if (enemyHasTargetUlt) {
    const linken = getItemByName('item_sphere')
    const lotus = getItemByName('item_lotus_orb')
    if (position <= 2 && linken) situational.push(linken)
    else if (position >= 3 && lotus) situational.push(lotus)
  }

  // Heavy magic team check
  const enemyHasMagicBurst = enemyTeam.some((e) =>
    ['Zeus', 'Leshrac', 'Sand King', 'Skywrath Mage', 'Lina'].includes(e.localized_name)
  )
  if (enemyHasMagicBurst && (position === 3 || position === 4)) {
    const pipe = getItemByName('item_pipe')
    if (pipe && !situational.includes(pipe)) situational.push(pipe)
  }

  // Fallback situational items if none triggered
  if (situational.length === 0) {
    const lotus = getItemByName('item_lotus_orb')
    const halberd = getItemByName('item_heavens_halberd')
    if (lotus) situational.push(lotus)
    if (halberd) situational.push(halberd)
  }

  // --- 5. Late Game Items ---
  if (position <= 2) {
    const satanic = getItemByName('item_satanic')
    const hex = getItemByName('item_sheepstick')
    const abyssal = getItemByName('item_abyssal_blade')
    if (satanic) late.push(satanic)
    if (hex) late.push(hex)
    if (hero.attack_type === 'Melee' && abyssal) late.push(abyssal)
  } else if (position === 3) {
    const shiva = getItemByName('item_shivas_guard')
    const refresher = getItemByName('item_refresher')
    const hex = getItemByName('item_sheepstick')
    if (shiva) late.push(shiva)
    if (hex) late.push(hex)
    if (refresher) late.push(refresher)
  } else {
    // Supports late
    const hex = getItemByName('item_sheepstick')
    const refresher = getItemByName('item_refresher')
    const lotus = getItemByName('item_lotus_orb')
    if (hex) late.push(hex)
    if (lotus && !situational.includes(lotus)) late.push(lotus)
    if (refresher) late.push(refresher)
  }

  // Rationale description
  let rationale = `Сборка сбалансирована под позицию ${position} (${hero.localized_name}). `
  if (enemyHasHeal) rationale += 'Включены предметы на снижение регенерации против высокого отхила врагов. '
  if (enemyHasEvasion) rationale += 'Добавлен MKB для нейтрализации уклонения вражеских кор-героев. '
  if (enemyHasPassives) rationale += 'Предусмотрен Silver Edge для отключения критических пассивных способностей. '

  return {
    hero,
    position,
    startingItems: starting,
    earlyGame: early,
    coreItems: core,
    situationalItems: situational,
    lateGame: late,
    generalPlaystyle: `Фокусируйтесь на получении ключевого артефакта (${core[0]?.localized_name || 'BKB'}) до инициации затяжных тимфайтов.`,
    itemizationRationale: rationale,
  }
}
