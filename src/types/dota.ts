export type HeroAttribute = 'str' | 'agi' | 'int' | 'all'
export type AttackType = 'Melee' | 'Ranged'
export type HeroRole = 'Carry' | 'Support' | 'Nuker' | 'Disabler' | 'Jungler' | 'Durable' | 'Escape' | 'Pusher' | 'Initiator'

export type Position = 1 | 2 | 3 | 4 | 5

export const POSITION_NAMES: Record<Position, { en: string; ru: string; roleRu: string; laneRu: string }> = {
  1: { en: 'Position 1 - Carry', ru: 'Позиция 1 (Керри)', roleRu: 'Керри / Фармер', laneRu: 'Легкая линия (Safe Lane)' },
  2: { en: 'Position 2 - Mid', ru: 'Позиция 2 (Мид)', roleRu: 'Мидлейнер / Создатель темпа', laneRu: 'Центральная линия (Mid Lane)' },
  3: { en: 'Position 3 - Offlane', ru: 'Позиция 3 (Оффлейн)', roleRu: 'Хардлейнер / Инициатор / Танк', laneRu: 'Сложная линия (Offlane)' },
  4: { en: 'Position 4 - Soft Support', ru: 'Позиция 4 (Семи-саппорт)', roleRu: 'Роумер / Семи-саппорт', laneRu: 'Сложная линия (Offlane)' },
  5: { en: 'Position 5 - Hard Support', ru: 'Позиция 5 (Фулл-саппорт)', roleRu: 'Фулл-саппорт / Опекун керри', laneRu: 'Легкая линия (Safe Lane)' },
}

export interface Hero {
  id: number
  name: string // e.g. "npc_dota_hero_antimage"
  localized_name: string // e.g. "Anti-Mage"
  primary_attr: HeroAttribute
  attack_type: AttackType
  roles: HeroRole[]
  img: string
  icon: string
  base_health: number
  base_mana: number
  base_armor: number
  base_attack_min: number
  base_attack_max: number
  base_str: number
  base_agi: number
  base_int: number
  str_gain: number
  agi_gain: number
  int_gain: number
  attack_range: number
  move_speed: number
  pro_pick_rate?: number
  pro_win_rate?: number
  pub_win_rate: number
  complexity: 1 | 2 | 3 // 1: Low, 2: Medium, 3: High
  // Position viability (0.0 to 1.0)
  positions: Record<Position, number>
  // Short strategic summary
  description: string
  counterNotes?: string
}

export interface DraftSlot {
  heroId: number | null
  position: Position | null
  isManual: boolean
  isFlex: boolean
  potentialPositions?: Position[]
}

export type TeamSide = 'radiant' | 'dire'

export interface TeamDraft {
  side: TeamSide
  slots: DraftSlot[]
}

export interface DraftWeights {
  counterpick: number // default 0.30
  lane: number // default 0.25
  synergy: number // default 0.20
  execution: number // default 0.15
  scaling: number // default 0.10
}

export interface FactorBreakdown {
  score: number // 0 to 100
  weight: number
  explanation: string
}

export interface HeroRecommendation {
  hero: Hero
  bestPosition: Position
  totalScore: number
  factors: {
    counterpick: FactorBreakdown
    lane: FactorBreakdown
    synergy: FactorBreakdown
    execution: FactorBreakdown
    scaling: FactorBreakdown
  }
  flexPotential: boolean
  whyBetterThanAlternatives: string
  whyWorseAlternatives: string
}

export interface LaneEvaluation {
  laneName: 'Safe Lane' | 'Mid Lane' | 'Offlane'
  radiantHeroes: Hero[]
  direHeroes: Hero[]
  advantage: 'Radiant Favored' | 'Dire Favored' | 'Even'
  killThreatRadiant: number // 1-10
  killThreatDire: number // 1-10
  sustainRadiant: number // 1-10
  sustainDire: number // 1-10
  lastHitDifficulty: 'Easy' | 'Medium' | 'Hard'
  gankVulnerability: 'Low' | 'Medium' | 'High'
  startingItemsAdvice: {
    radiant: string[]
    dire: string[]
  }
  gameplayTips: string[]
}

export interface DraftAnalysisReport {
  overallAdvantage: 'Radiant' | 'Dire' | 'Even'
  winProbabilityRadiant: number // e.g. 52.4%
  confidence: 'High' | 'Medium' | 'Low (Needs more games)'
  radiantStrengths: string[]
  radiantWeaknesses: string[]
  direStrengths: string[]
  direWeaknesses: string[]
  crowdControl: { radiant: number; dire: number }
  initiation: { radiant: number; dire: number }
  mobility: { radiant: number; dire: number }
  magicDefense: { radiant: number; dire: number }
  physicalDefense: { radiant: number; dire: number }
  antiIllusion: { radiant: number; dire: number }
  pushPotential: { radiant: number; dire: number }
  roshanPotential: { radiant: number; dire: number }
  lateGameScaling: { radiant: number; dire: number }
  timingDependencies: {
    radiant: string
    dire: string
  }
  topCountersRadiantVsDire: Array<{ hero: string; counters: string[]; reason: string }>
  topCountersDireVsRadiant: Array<{ hero: string; counters: string[]; reason: string }>
}

export interface ItemDetail {
  id: number
  name: string
  localized_name: string
  cost: number
  img: string
  tier?: 'starting' | 'early' | 'core' | 'situational' | 'late'
  reason: string
  timing: string
  alternatives: string[]
  countersHeroId?: number[]
}

export interface HeroBuildRecommendation {
  hero: Hero
  position: Position
  startingItems: ItemDetail[]
  earlyGame: ItemDetail[]
  coreItems: ItemDetail[]
  situationalItems: ItemDetail[]
  lateGame: ItemDetail[]
  generalPlaystyle: string
  itemizationRationale: string
}

export interface MapPoint {
  x: number // Map coordinate (e.g. 64 to 192 or normal 0 to 100)
  y: number
  weight: number
  heroId?: number
  heroName?: string
  position?: Position
  side?: TeamSide
  minute?: number
  type?: 'movement' | 'farm' | 'teamfight' | 'death' | 'ward'
  isSentry?: boolean
}

export type TimeBracket = '0-10' | '10-20' | '20-30' | '30+'
export type MapLayer = 'movement' | 'farm' | 'teamfights' | 'deaths' | 'wards'

export type CoachSkillTrack =
  | 'farming'
  | 'positioning'
  | 'laning'
  | 'map_awareness'
  | 'teamfight_decisions'
  | 'itemization'
  | 'death_analysis'

export interface ProPlayerMatch {
  matchId: string
  heroId: number
  heroName: string
  opponent: string
  tournament: string
  date: string
  vodTimestamp?: string
  keyTakeaway: string
  csAt10?: number
  networthAt20?: number
  wardsPlaced?: number
}

export interface PracticeDrill {
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  objective: string
  howToMeasure: string
  targetBenchmark: string
}

export interface ProPlayer {
  id: string
  name: string
  team: string
  position: Position
  country: string
  signatureHeroes: number[]
  skillSpecialties: CoachSkillTrack[]
  coachingPhilosophy: string
  notableMatches: ProPlayerMatch[]
  drills: PracticeDrill[]
}

export interface WeeklyImprovementPlan {
  id: string
  createdAt: string
  targetPosition: Position
  currentRank: string
  selectedHeroes: string[]
  prioritySkills: CoachSkillTrack[]
  assignedPros: string[]
  drills: PracticeDrill[]
  measurableGoals: string[]
  reviewDate: string
}
