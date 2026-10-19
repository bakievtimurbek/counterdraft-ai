import { Hero, Position, LaneEvaluation } from '@/types/dota'
import { getMatchupAdvantage } from '@/data/matchups'

export function evaluateLaneMatchup(
  laneName: 'Safe Lane' | 'Mid Lane' | 'Offlane',
  radiantHeroes: Hero[],
  direHeroes: Hero[]
): LaneEvaluation {
  if (radiantHeroes.length === 0 || direHeroes.length === 0) {
    return {
      laneName,
      radiantHeroes,
      direHeroes,
      advantage: 'Even',
      killThreatRadiant: 5,
      killThreatDire: 5,
      sustainRadiant: 5,
      sustainDire: 5,
      lastHitDifficulty: 'Medium',
      gankVulnerability: 'Medium',
      startingItemsAdvice: {
        radiant: ['Tango', 'Iron Branch', 'Circlet'],
        dire: ['Tango', 'Iron Branch', 'Circlet'],
      },
      gameplayTips: ['Ожидание назначения героев на линию.'],
    }
  }

  // Calculate net matchup advantage
  let radAdvantageTotal = 0
  let comparisons = 0
  for (const r of radiantHeroes) {
    for (const d of direHeroes) {
      radAdvantageTotal += getMatchupAdvantage(r.id, d.id).advantage
      comparisons++
    }
  }
  const avgAdv = comparisons > 0 ? radAdvantageTotal / comparisons : 0

  let advantage: 'Radiant Favored' | 'Dire Favored' | 'Even' = 'Even'
  if (avgAdv >= 1.5) advantage = 'Radiant Favored'
  else if (avgAdv <= -1.5) advantage = 'Dire Favored'

  // Kill threat calculations based on disables and burst
  const radStuns = radiantHeroes.filter((h) => (h.roles || []).includes('Disabler') || (h.roles || []).includes('Nuker')).length
  const direStuns = direHeroes.filter((h) => (h.roles || []).includes('Disabler') || (h.roles || []).includes('Nuker')).length

  const killThreatRadiant = Math.min(10, Math.max(2, 4 + radStuns * 2 + (avgAdv > 0 ? 1 : 0)))
  const killThreatDire = Math.min(10, Math.max(2, 4 + direStuns * 2 + (avgAdv < 0 ? 1 : 0)))

  // Sustain based on Durable or Support healers
  const radHeals = radiantHeroes.some((h) => ['Dazzle', 'Witch Doctor', 'Oracle', 'Abaddon', 'Treant Protector', 'Omniknight', 'Io'].includes(h.localized_name))
  const direHeals = direHeroes.some((h) => ['Dazzle', 'Witch Doctor', 'Oracle', 'Abaddon', 'Treant Protector', 'Omniknight', 'Io'].includes(h.localized_name))

  const sustainRadiant = radHeals ? 9 : radiantHeroes.some((h) => (h.roles || []).includes('Durable')) ? 7 : 5
  const sustainDire = direHeals ? 9 : direHeroes.some((h) => (h.roles || []).includes('Durable')) ? 7 : 5

  // CS Difficulty
  const radBaseDmg = radiantHeroes.reduce((sum, h) => sum + (h.base_attack_min + h.base_attack_max) / 2, 0) / radiantHeroes.length
  const direBaseDmg = direHeroes.reduce((sum, h) => sum + (h.base_attack_min + h.base_attack_max) / 2, 0) / direHeroes.length
  const lastHitDifficulty = Math.abs(radBaseDmg - direBaseDmg) > 12 ? 'Hard' : Math.abs(radBaseDmg - direBaseDmg) > 6 ? 'Medium' : 'Easy'

  // Gank vulnerability (Mid or high kill threat enemies)
  const gankVulnerability = (killThreatRadiant > 7 || killThreatDire > 7) ? 'High' : (laneName === 'Mid Lane' ? 'Medium' : 'Low')

  // Tailored starting items advice
  const radItems: string[] = ['Tango (x2)', 'Iron Branch (x2)']
  const direItems: string[] = ['Tango (x2)', 'Iron Branch (x2)']

  const direHasSpam = direHeroes.some((h) => ['Batrider', 'Bristleback', 'Zeus', 'Skywrath Mage', 'Phantom Assassin'].includes(h.localized_name))
  const radHasSpam = radiantHeroes.some((h) => ['Batrider', 'Bristleback', 'Zeus', 'Skywrath Mage', 'Phantom Assassin'].includes(h.localized_name))

  if (direHasSpam) radItems.push('Magic Stick (Обязательно против спама заклинаний)')
  if (radHasSpam) direItems.push('Magic Stick (Обязательно против спама заклинаний)')

  if (killThreatDire >= 7) radItems.push('Healing Salve (Экстренный хил от убийства)')
  if (killThreatRadiant >= 7) direItems.push('Healing Salve (Экстренный хил от убийства)')

  if (radiantHeroes.some((h) => h.attack_type === 'Melee')) radItems.push('Quelling Blade (Для добивания)')
  if (direHeroes.some((h) => h.attack_type === 'Melee')) direItems.push('Quelling Blade (Для добивания)')

  if (radiantHeroes.some((h) => (h.roles || []).includes('Support'))) radItems.push('Blood Grenade (Для фб)')
  if (direHeroes.some((h) => (h.roles || []).includes('Support'))) direItems.push('Blood Grenade (Для фб)')

  const tips: string[] = []
  if (advantage === 'Radiant Favored') {
    tips.push('Radiant имеет раннее преимущество по урону и контролю: держите врага вдали от волны крипов.')
  } else if (advantage === 'Dire Favored') {
    tips.push('Dire доминирует на линии: Radiant необходимо играть от пулла нейтралов и не рисковать под вышкой.')
  } else {
    tips.push('Равная линия: ключевую роль сыграет контроль малого лагеря крипов и точное добивание дальников.')
  }

  if (killThreatDire >= 7 || killThreatRadiant >= 7) {
    tips.push('Высокий потенциал First Blood на 2-м уровне: не подставляйтесь под сдвоенный стан.')
  }

  return {
    laneName,
    radiantHeroes,
    direHeroes,
    advantage,
    killThreatRadiant,
    killThreatDire,
    sustainRadiant,
    sustainDire,
    lastHitDifficulty,
    gankVulnerability,
    startingItemsAdvice: {
      radiant: radItems,
      dire: direItems,
    },
    gameplayTips: tips,
  }
}

export function evaluateAllLanes(
  radiantPositions: Record<Position, Hero | null>,
  direPositions: Record<Position, Hero | null>
): LaneEvaluation[] {
  // Safe Lane: Radiant (Pos 1 + Pos 5) vs Dire Offlane (Pos 3 + Pos 4)
  const radSafe = [radiantPositions[1], radiantPositions[5]].filter(Boolean) as Hero[]
  const direOff = [direPositions[3], direPositions[4]].filter(Boolean) as Hero[]
  const safeLane = evaluateLaneMatchup('Safe Lane', radSafe, direOff)

  // Mid Lane: Radiant Pos 2 vs Dire Pos 2
  const radMid = [radiantPositions[2]].filter(Boolean) as Hero[]
  const direMid = [direPositions[2]].filter(Boolean) as Hero[]
  const midLane = evaluateLaneMatchup('Mid Lane', radMid, direMid)

  // Offlane: Radiant (Pos 3 + Pos 4) vs Dire Safe Lane (Pos 1 + Pos 5)
  const radOff = [radiantPositions[3], radiantPositions[4]].filter(Boolean) as Hero[]
  const direSafe = [direPositions[1], direPositions[5]].filter(Boolean) as Hero[]
  const offLane = evaluateLaneMatchup('Offlane', radOff, direSafe)

  return [safeLane, midLane, offLane]
}
