import { Hero, DraftAnalysisReport } from '@/types/dota'
import { getMatchupAdvantage } from '@/data/matchups'

export function analyzeFullDraft(
  radiantHeroes: Hero[],
  direHeroes: Hero[]
): DraftAnalysisReport {
  // Edge case: empty drafts
  if (radiantHeroes.length === 0 || direHeroes.length === 0) {
    return {
      overallAdvantage: 'Even',
      winProbabilityRadiant: 50.0,
      confidence: 'Low (Needs more games)',
      radiantStrengths: ['Состав не укомплектован.'],
      radiantWeaknesses: ['Недостаточно героев для полноценного анализа.'],
      direStrengths: ['Состав не укомплектован.'],
      direWeaknesses: ['Недостаточно героев для полноценного анализа.'],
      crowdControl: { radiant: 50, dire: 50 },
      initiation: { radiant: 50, dire: 50 },
      mobility: { radiant: 50, dire: 50 },
      magicDefense: { radiant: 50, dire: 50 },
      physicalDefense: { radiant: 50, dire: 50 },
      antiIllusion: { radiant: 50, dire: 50 },
      pushPotential: { radiant: 50, dire: 50 },
      roshanPotential: { radiant: 50, dire: 50 },
      lateGameScaling: { radiant: 50, dire: 50 },
      timingDependencies: {
        radiant: 'Ожидание завершения драфта.',
        dire: 'Ожидание завершения драфта.',
      },
      topCountersRadiantVsDire: [],
      topCountersDireVsRadiant: [],
    }
  }

  // Calculate pairwise matchup sum
  let radAdvantageTotal = 0
  let comparisons = 0
  const radCountersMap: Record<string, { counters: string[]; reason: string }> = {}
  const direCountersMap: Record<string, { counters: string[]; reason: string }> = {}

  for (const r of radiantHeroes) {
    for (const d of direHeroes) {
      const { advantage, reason } = getMatchupAdvantage(r.id, d.id)
      radAdvantageTotal += advantage
      comparisons++

      if (advantage >= 3.0 && reason) {
        if (!radCountersMap[r.localized_name]) {
          radCountersMap[r.localized_name] = { counters: [], reason }
        }
        radCountersMap[r.localized_name].counters.push(d.localized_name)
      } else if (advantage <= -3.0 && reason) {
        if (!direCountersMap[d.localized_name]) {
          direCountersMap[d.localized_name] = { counters: [], reason }
        }
        direCountersMap[d.localized_name].counters.push(r.localized_name)
      }
    }
  }

  const avgAdv = comparisons > 0 ? radAdvantageTotal / comparisons : 0
  const winProbabilityRadiant = Math.round((50 + avgAdv * 2.5) * 10) / 10

  const overallAdvantage =
    winProbabilityRadiant >= 52.0 ? 'Radiant' : winProbabilityRadiant <= 48.0 ? 'Dire' : 'Even'

  // Metric evaluators
  const calcDisables = (team: Hero[]) =>
    team.reduce((acc, h) => acc + ((h.roles || []).includes('Disabler') ? 22 : 8), 0)

  const calcInitiation = (team: Hero[]) =>
    team.reduce((acc, h) => acc + ((h.roles || []).includes('Initiator') ? 24 : 6), 0)

  const calcMobility = (team: Hero[]) =>
    team.reduce((acc, h) => acc + ((h.roles || []).includes('Escape') ? 22 : h.move_speed > 310 ? 14 : 8), 0)

  const calcPhysicalArmor = (team: Hero[]) =>
    team.reduce((acc, h) => acc + (h.base_armor > 4 || h.primary_attr === 'agi' ? 20 : 10), 0)

  const calcMagicDefense = (team: Hero[]) =>
    team.reduce((acc, h) => acc + (h.primary_attr === 'str' || ['Anti-Mage', 'Viper', 'Rubick', 'Huskar'].includes(h.localized_name) ? 22 : 10), 0)

  const calcAntiIllusion = (team: Hero[]) =>
    team.reduce((acc, h) => acc + (['Sven', 'Axe', 'Timbersaw', 'Leshrac', 'Earthshaker', 'Sand King', 'Medusa'].includes(h.localized_name) ? 28 : (h.roles || []).includes('Nuker') ? 14 : 6), 0)

  const calcPush = (team: Hero[]) =>
    team.reduce((acc, h) => acc + ((h.roles || []).includes('Pusher') ? 26 : ['Shadow Shaman', 'Death Prophet', 'Leshrac', 'Beastmaster', 'Nature\'s Prophet'].includes(h.localized_name) ? 28 : 8), 0)

  const calcRoshan = (team: Hero[]) =>
    team.reduce((acc, h) => acc + (['Ursa', 'Troll Warlord', 'Slardar', 'Templar Assassin', 'Drow Ranger', 'Huskar'].includes(h.localized_name) ? 35 : (h.roles || []).includes('Carry') ? 14 : 6), 0)

  const calcScaling = (team: Hero[]) =>
    team.reduce((acc, h) => acc + (['Spectre', 'Medusa', 'Faceless Void', 'Phantom Assassin', 'Anti-Mage', 'Terrorblade'].includes(h.localized_name) ? 28 : (h.roles || []).includes('Carry') ? 18 : 8), 0)

  // Clamp metrics 10..98
  const clampMetric = (val: number) => Math.min(98, Math.max(15, Math.round(val)))

  const crowdControl = { radiant: clampMetric(calcDisables(radiantHeroes)), dire: clampMetric(calcDisables(direHeroes)) }
  const initiation = { radiant: clampMetric(calcInitiation(radiantHeroes)), dire: clampMetric(calcInitiation(direHeroes)) }
  const mobility = { radiant: clampMetric(calcMobility(radiantHeroes)), dire: clampMetric(calcMobility(direHeroes)) }
  const physicalDefense = { radiant: clampMetric(calcPhysicalArmor(radiantHeroes)), dire: clampMetric(calcPhysicalArmor(direHeroes)) }
  const magicDefense = { radiant: clampMetric(calcMagicDefense(radiantHeroes)), dire: clampMetric(calcMagicDefense(direHeroes)) }
  const antiIllusion = { radiant: clampMetric(calcAntiIllusion(radiantHeroes)), dire: clampMetric(calcAntiIllusion(direHeroes)) }
  const pushPotential = { radiant: clampMetric(calcPush(radiantHeroes)), dire: clampMetric(calcPush(direHeroes)) }
  const roshanPotential = { radiant: clampMetric(calcRoshan(radiantHeroes)), dire: clampMetric(calcRoshan(direHeroes)) }
  const lateGameScaling = { radiant: clampMetric(calcScaling(radiantHeroes)), dire: clampMetric(calcScaling(direHeroes)) }

  // Strengths & Weaknesses
  const radStrengths: string[] = []
  const radWeaknesses: string[] = []
  const direStrengths: string[] = []
  const direWeaknesses: string[] = []

  if (crowdControl.radiant >= 75) radStrengths.push('Превосходный командный контроль и длинные цепочки станов.')
  else if (crowdControl.radiant <= 40) radWeaknesses.push('Острый дефицит надежного оглушения: мобильные враги будут уходить.')

  if (crowdControl.dire >= 75) direStrengths.push('Плотный контроль по площади, срывающий прокасты соперника.')
  else if (crowdControl.dire <= 40) direWeaknesses.push('Мало оглушений, зависимость от покупки предметов на контроль (Eul, Hex).')

  if (pushPotential.radiant >= 70) radStrengths.push('Быстрое разрушение строений и давление на ранние вышки.')
  if (pushPotential.dire >= 70) direStrengths.push('Высокий пуш-потенциал, способный быстро зажать соперника на базе.')

  if (lateGameScaling.radiant >= 75) radStrengths.push('Отличное масштабирование в глубокий лейт (35+ минута).')
  else if (lateGameScaling.radiant <= 45) radWeaknesses.push('Падение эффективности в затяжной игре: необходимо завершать до 30-й минуты.')

  if (lateGameScaling.dire >= 75) direStrengths.push('Мощный гиперлейт потенциал коров.')
  else if (lateGameScaling.dire <= 45) direWeaknesses.push('Ограниченный лейтгейм: тайминги диктуют быструю победу.')

  if (roshanPotential.radiant >= 70) radStrengths.push('Быстрое и безопасное убийство Рошана в ранней игре.')
  if (roshanPotential.dire >= 70) direStrengths.push('Высокая скорость забора Aegis.')

  if (radStrengths.length === 0) radStrengths.push('Сбалансированный драфт без явных провалов по статам.')
  if (radWeaknesses.length === 0) radWeaknesses.push('Требуется высокая координация для реализации таймингов.')
  if (direStrengths.length === 0) direStrengths.push('Гибкий состав с хорошим темпом в мидгейме.')
  if (direWeaknesses.length === 0) direWeaknesses.push('Уязвимость к внезапной инициации из невидимости/смока.')

  const topCountersRadiantVsDire = Object.entries(radCountersMap).map(([hero, val]) => ({
    hero,
    counters: val.counters,
    reason: val.reason,
  }))

  const topCountersDireVsRadiant = Object.entries(direCountersMap).map(([hero, val]) => ({
    hero,
    counters: val.counters,
    reason: val.reason,
  }))

  return {
    overallAdvantage,
    winProbabilityRadiant,
    confidence: comparisons >= 15 ? 'High' : 'Medium',
    radiantStrengths: radStrengths,
    radiantWeaknesses: radWeaknesses,
    direStrengths: direStrengths,
    direWeaknesses: direWeaknesses,
    crowdControl,
    initiation,
    mobility,
    magicDefense,
    physicalDefense,
    antiIllusion,
    pushPotential,
    roshanPotential,
    lateGameScaling,
    timingDependencies: {
      radiant: lateGameScaling.radiant > lateGameScaling.dire ? 'Пик силы раскрывается с получением BKB и 3-го слота (22-30 мин).' : 'Критический темп: навязать доминирование до 25-й минуты.',
      dire: lateGameScaling.dire > lateGameScaling.radiant ? 'Игра от обороны до ключевых таймингов гиперкерри (30+ мин).' : 'Активные смоки с получением Blink Dagger на оффлейнере (12-16 мин).',
    },
    topCountersRadiantVsDire,
    topCountersDireVsRadiant,
  }
}
