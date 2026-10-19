import { Hero, Position, DraftWeights, HeroRecommendation, POSITION_NAMES } from '@/types/dota'
import { getMatchupAdvantage, getSynergyScore } from '@/data/matchups'

export const DEFAULT_DRAFT_WEIGHTS: DraftWeights = {
  counterpick: 0.30,
  lane: 0.25,
  synergy: 0.20,
  execution: 0.15,
  scaling: 0.10,
}

export interface PermutationResult {
  assignment: Record<Position, Hero>
  score: number
  probability: number // 0% to 100%
  explanationRu: string
}

// Generate all permutations of an array
function permute<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr]
  const result: T[][] = []
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1))
    const subPerms = permute(remaining)
    for (const sub of subPerms) {
      result.push([current, ...sub])
    }
  }
  return result
}

/**
 * Smart Mode Role Distribution
 * Evaluates all 120 permutations of 5 heroes to positions 1-5
 * Considers individual position viability + safe/offlane duos
 */
export function solveSmartModeRoles(
  heroes: Hero[],
  lockedPositions?: Partial<Record<Position, Hero>>
): PermutationResult[] {
  if (heroes.length !== 5) {
    return []
  }

  const allPerms = permute(heroes)
  const evaluated: Array<{
    assignment: Record<Position, Hero>
    rawScore: number
    flexNotes: string[]
  }> = []

  for (const perm of allPerms) {
    const p1 = perm[0]
    const p2 = perm[1]
    const p3 = perm[2]
    const p4 = perm[3]
    const p5 = perm[4]

    // If user locked certain positions manually, skip non-matching
    if (lockedPositions) {
      let matchesLocked = true
      for (const [posStr, hero] of Object.entries(lockedPositions)) {
        const pos = Number(posStr) as Position
        if (hero && perm[pos - 1].id !== hero.id) {
          matchesLocked = false
          break
        }
      }
      if (!matchesLocked) continue
    }

    // Role affinity score (0.01 to 1.0)
    const posScores = [
      p1.positions[1] || 0.01,
      p2.positions[2] || 0.01,
      p3.positions[3] || 0.01,
      p4.positions[4] || 0.01,
      p5.positions[5] || 0.01,
    ]

    // Severe penalty if any hero has < 0.15 viability for the assigned role
    const minScore = Math.min(...posScores)
    if (minScore < 0.1) continue

    // Lane duos synergy: Pos 1 + Pos 5 (Safe Lane) and Pos 3 + Pos 4 (Offlane)
    const safeLaneSynergy = getSynergyScore(p1.id, p5.id).score / 10
    const offLaneSynergy = getSynergyScore(p3.id, p4.id).score / 10

    // Sum log scores for joint probability
    const rawScore =
      posScores.reduce((sum, s) => sum + Math.log(s), 0) +
      safeLaneSynergy * 0.4 +
      offLaneSynergy * 0.4

    const flexNotes: string[] = []
    if ((p1.positions[2] || 0) > 0.5) flexNotes.push(`${p1.localized_name} может флекситься на Мид`)
    if ((p2.positions[1] || 0) > 0.5) flexNotes.push(`${p2.localized_name} может флекситься на Керри`)
    if ((p3.positions[1] || 0) > 0.5 || (p3.positions[4] || 0) > 0.5) flexNotes.push(`${p3.localized_name} — гибкий оффлейн`)
    if ((p4.positions[5] || 0) > 0.6) flexNotes.push(`${p4.localized_name} способен играть как 5-ка`)

    evaluated.push({
      assignment: { 1: p1, 2: p2, 3: p3, 4: p4, 5: p5 },
      rawScore,
      flexNotes,
    })
  }

  if (evaluated.length === 0) return []

  // Sort descending by score
  evaluated.sort((a, b) => b.rawScore - a.rawScore)

  // Softmax normalization for top distributions
  const topCandidates = evaluated.slice(0, 3)
  const maxScore = topCandidates[0].rawScore
  const expScores = topCandidates.map((c) => Math.exp(c.rawScore - maxScore))
  const sumExp = expScores.reduce((a, b) => a + b, 0)

  return topCandidates.map((candidate, idx) => {
    const probability = Math.round((expScores[idx] / sumExp) * 100)
    const p = candidate.assignment
    const noteText = candidate.flexNotes.length > 0 ? ` [Flex: ${candidate.flexNotes.join('; ')}]` : ''
    const explanationRu = `Вариант #${idx + 1} (${probability}%): 1 - ${p[1].localized_name}, 2 - ${p[2].localized_name}, 3 - ${p[3].localized_name}, 4 - ${p[4].localized_name}, 5 - ${p[5].localized_name}.${noteText}`

    return {
      assignment: candidate.assignment,
      score: candidate.rawScore,
      probability,
      explanationRu,
    }
  })
}

/**
 * 5-Factor Weighted Draft Scoring for Next Pick Candidate
 */
export function scoreNextPickHero(
  candidate: Hero,
  targetPosition: Position,
  allies: Array<{ hero: Hero; position: Position }>,
  enemies: Array<{ hero: Hero; position: Position }>,
  customWeights: DraftWeights = DEFAULT_DRAFT_WEIGHTS
): HeroRecommendation {
  // 1. Counterpick factor (30%)
  let counterSum = 0
  const counterDetails: string[] = []
  for (const enemy of enemies) {
    const { advantage, reason } = getMatchupAdvantage(candidate.id, enemy.hero.id)
    counterSum += advantage
    if (reason && Math.abs(advantage) >= 2.0) {
      counterDetails.push(`${enemy.hero.localized_name}: ${advantage > 0 ? '+' : ''}${advantage.toFixed(1)}% (${reason})`)
    }
  }
  // Base 50 + normalized advantage swing (-15..+15)
  const counterpickScore = Math.max(0, Math.min(100, Math.round(50 + counterSum * 2.5)))

  // 2. Lane Matchup factor (25%)
  let laneScore = 50
  let laneDetails = 'Стандартное противостояние на линии.'
  if (targetPosition === 2) {
    // Mid vs enemy mid
    const enemyMid = enemies.find((e) => e.position === 2)
    if (enemyMid) {
      const adv = getMatchupAdvantage(candidate.id, enemyMid.hero.id).advantage
      laneScore = Math.max(10, Math.min(95, Math.round(50 + adv * 4)))
      laneDetails = `Матчап 1v1 в миде против ${enemyMid.hero.localized_name}: ${adv >= 0 ? '+' : ''}${adv.toFixed(1)}% преимущества.`
    }
  } else if (targetPosition === 1 || targetPosition === 5) {
    // Safe lane vs enemy offlane (pos 3 & 4)
    const enemyOff = enemies.filter((e) => e.position === 3 || e.position === 4)
    if (enemyOff.length > 0) {
      const avgAdv = enemyOff.reduce((acc, e) => acc + getMatchupAdvantage(candidate.id, e.hero.id).advantage, 0) / enemyOff.length
      laneScore = Math.max(15, Math.min(95, Math.round(50 + avgAdv * 3.5)))
      laneDetails = `Линия Safe vs Offlane против ${enemyOff.map((e) => e.hero.localized_name).join(' & ')}.`
    }
  } else if (targetPosition === 3 || targetPosition === 4) {
    // Offlane vs enemy safe lane (pos 1 & 5)
    const enemySafe = enemies.filter((e) => e.position === 1 || e.position === 5)
    if (enemySafe.length > 0) {
      const avgAdv = enemySafe.reduce((acc, e) => acc + getMatchupAdvantage(candidate.id, e.hero.id).advantage, 0) / enemySafe.length
      laneScore = Math.max(15, Math.min(95, Math.round(50 + avgAdv * 3.5)))
      laneDetails = `Сложная линия Offlane против керри/саппорта ${enemySafe.map((e) => e.hero.localized_name).join(' & ')}.`
    }
  }

  // 3. Synergy factor (20%)
  let synergySum = 0
  const synergyDetails: string[] = []
  for (const ally of allies) {
    const { score, comboName, reason } = getSynergyScore(candidate.id, ally.hero.id)
    synergySum += score
    if (comboName) {
      synergyDetails.push(`Связка "${comboName}" с ${ally.hero.localized_name}: ${reason || ''}`)
    }
  }
  const avgSynergy = allies.length > 0 ? synergySum / allies.length : 5.0
  const synergyFinalScore = Math.max(20, Math.min(98, Math.round(avgSynergy * 10)))

  // 4. Execution difficulty (15%)
  // Complexity 1 (easy) -> 90, 2 -> 75, 3 (hard: Meepo, Invoker) -> 55
  let executionScore = candidate.complexity === 1 ? 90 : candidate.complexity === 2 ? 75 : 55
  let executionDetail = `Сложность исполнения: ${candidate.complexity === 1 ? 'Низкая (надежно)' : candidate.complexity === 2 ? 'Средняя' : 'Высокая (требует микроконтроля)'}.`

  // 5. Late Game Scaling (10%)
  let scalingScore = 50
  if (targetPosition === 1) {
    scalingScore = candidate.attack_type === 'Ranged' ? 82 : 88
    if (['Medusa', 'Spectre', 'Faceless Void', 'Phantom Assassin', 'Anti-Mage', 'Terrorblade'].includes(candidate.localized_name)) {
      scalingScore = 96
    }
  } else if (targetPosition === 2) {
    scalingScore = candidate.primary_attr === 'int' ? 74 : 85
  } else if (targetPosition === 3) {
    scalingScore = 70
  } else {
    scalingScore = 60
  }
  const scalingDetail = `Масштабирование в лейт: ${scalingScore >= 85 ? 'Ультралейт гиперкерри' : scalingScore >= 70 ? 'Высокое' : 'Стандартное'}.`

  // Position suitability multiplier
  const posAptitude = candidate.positions[targetPosition] || 0.1
  const weightedSum =
    counterpickScore * customWeights.counterpick +
    laneScore * customWeights.lane +
    synergyFinalScore * customWeights.synergy +
    executionScore * customWeights.execution +
    scalingScore * customWeights.scaling

  const totalScore = Math.round(weightedSum * (0.6 + posAptitude * 0.4))

  // Flex potential check
  const viablePositions = ([1, 2, 3, 4, 5] as Position[]).filter((p) => (candidate.positions[p] || 0) >= 0.55)
  const flexPotential = viablePositions.length > 1

  const whyBetter = `Превосходит аналоги за счет баланса контрпика (${counterpickScore}/100) и комфортного лайнинга (${laneScore}/100)${flexPotential ? ', плюс оставляет соперника в неведении о линии (Flex)' : ''}.`
  const whyWorse = `Альтернативные варианты либо уступают в синергии со связками союзников, либо рискуют проиграть стадию раннего лайнинга.`

  return {
    hero: candidate,
    bestPosition: targetPosition,
    totalScore,
    factors: {
      counterpick: {
        score: counterpickScore,
        weight: customWeights.counterpick,
        explanation: counterDetails.length > 0 ? counterDetails.join(' | ') : 'Нейтральные контрпики против текущего драфта.',
      },
      lane: {
        score: laneScore,
        weight: customWeights.lane,
        explanation: laneDetails,
      },
      synergy: {
        score: synergyFinalScore,
        weight: customWeights.synergy,
        explanation: synergyDetails.length > 0 ? synergyDetails.join(' | ') : 'Базовая синергия с составом союзников.',
      },
      execution: {
        score: executionScore,
        weight: customWeights.execution,
        explanation: executionDetail,
      },
      scaling: {
        score: scalingScore,
        weight: customWeights.scaling,
        explanation: scalingDetail,
      },
    },
    flexPotential,
    whyBetterThanAlternatives: whyBetter,
    whyWorseAlternatives: whyWorse,
  }
}
