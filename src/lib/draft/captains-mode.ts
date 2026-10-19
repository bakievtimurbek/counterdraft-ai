import { TeamSide, Hero } from '@/types/dota'

export type DraftActionType = 'ban' | 'pick'

export interface CaptainsModeStep {
  stepIndex: number // 1 to 24
  phase: 1 | 2 | 3
  type: DraftActionType
  side: TeamSide
  labelRu: string
}

// Official modern Dota 2 Captain's Mode Draft Sequence (24 actions)
export const CAPTAINS_MODE_SEQUENCE: CaptainsModeStep[] = [
  // --- Phase 1: 7 Bans & 4 Picks ---
  { stepIndex: 1, phase: 1, type: 'ban', side: 'radiant', labelRu: 'Бан 1 (Radiant)' },
  { stepIndex: 2, phase: 1, type: 'ban', side: 'dire', labelRu: 'Бан 1 (Dire)' },
  { stepIndex: 3, phase: 1, type: 'ban', side: 'radiant', labelRu: 'Бан 2 (Radiant)' },
  { stepIndex: 4, phase: 1, type: 'ban', side: 'dire', labelRu: 'Бан 2 (Dire)' },
  { stepIndex: 5, phase: 1, type: 'ban', side: 'radiant', labelRu: 'Бан 3 (Radiant)' },
  { stepIndex: 6, phase: 1, type: 'ban', side: 'dire', labelRu: 'Бан 3 (Dire)' },
  { stepIndex: 7, phase: 1, type: 'ban', side: 'radiant', labelRu: 'Бан 4 (Radiant)' },
  
  { stepIndex: 8, phase: 1, type: 'pick', side: 'radiant', labelRu: 'Пик 1 (Radiant)' },
  { stepIndex: 9, phase: 1, type: 'pick', side: 'dire', labelRu: 'Пик 1 (Dire)' },
  { stepIndex: 10, phase: 1, type: 'pick', side: 'dire', labelRu: 'Пик 2 (Dire)' },
  { stepIndex: 11, phase: 1, type: 'pick', side: 'radiant', labelRu: 'Пик 2 (Radiant)' },

  // --- Phase 2: 4 Bans & 4 Picks ---
  { stepIndex: 12, phase: 2, type: 'ban', side: 'dire', labelRu: 'Бан 4 (Dire)' },
  { stepIndex: 13, phase: 2, type: 'ban', side: 'radiant', labelRu: 'Бан 5 (Radiant)' },
  { stepIndex: 14, phase: 2, type: 'ban', side: 'dire', labelRu: 'Бан 5 (Dire)' },
  { stepIndex: 15, phase: 2, type: 'ban', side: 'radiant', labelRu: 'Бан 6 (Radiant)' },

  { stepIndex: 16, phase: 2, type: 'pick', side: 'dire', labelRu: 'Пик 3 (Dire)' },
  { stepIndex: 17, phase: 2, type: 'pick', side: 'radiant', labelRu: 'Пик 3 (Radiant)' },
  { stepIndex: 18, phase: 2, type: 'pick', side: 'radiant', labelRu: 'Пик 4 (Radiant)' },
  { stepIndex: 19, phase: 2, type: 'pick', side: 'dire', labelRu: 'Пик 4 (Dire)' },

  // --- Phase 3: 3 Bans & 2 Picks ---
  { stepIndex: 20, phase: 3, type: 'ban', side: 'dire', labelRu: 'Бан 6 (Dire)' },
  { stepIndex: 21, phase: 3, type: 'ban', side: 'radiant', labelRu: 'Бан 7 (Radiant)' },
  { stepIndex: 22, phase: 3, type: 'ban', side: 'dire', labelRu: 'Бан 7 (Dire)' },

  { stepIndex: 23, phase: 3, type: 'pick', side: 'radiant', labelRu: 'Пик 5 (Radiant)' },
  { stepIndex: 24, phase: 3, type: 'pick', side: 'dire', labelRu: 'Пик 5 (Dire)' },
]

export interface CaptainsDraftActionRecord {
  step: CaptainsModeStep
  hero: Hero
  timestamp: string
}

export interface CaptainsDraftState {
  currentStepIndex: number // 1 to 24 (or 25 when complete)
  radiantPicks: Hero[]
  direPicks: Hero[]
  radiantBans: Hero[]
  direBans: Hero[]
  history: CaptainsDraftActionRecord[]
  isComplete: boolean
}

export function createInitialCaptainsState(): CaptainsDraftState {
  return {
    currentStepIndex: 1,
    radiantPicks: [],
    direPicks: [],
    radiantBans: [],
    direBans: [],
    history: [],
    isComplete: false,
  }
}

export function executeCaptainsStep(
  state: CaptainsDraftState,
  hero: Hero
): CaptainsDraftState {
  if (state.isComplete || state.currentStepIndex > CAPTAINS_MODE_SEQUENCE.length) {
    return state
  }

  const currentStep = CAPTAINS_MODE_SEQUENCE[state.currentStepIndex - 1]
  const record: CaptainsDraftActionRecord = {
    step: currentStep,
    hero,
    timestamp: new Date().toLocaleTimeString(),
  }

  const nextRadiantPicks = [...state.radiantPicks]
  const nextDirePicks = [...state.direPicks]
  const nextRadiantBans = [...state.radiantBans]
  const nextDireBans = [...state.direBans]

  if (currentStep.type === 'pick') {
    if (currentStep.side === 'radiant') nextRadiantPicks.push(hero)
    else nextDirePicks.push(hero)
  } else {
    if (currentStep.side === 'radiant') nextRadiantBans.push(hero)
    else nextDireBans.push(hero)
  }

  const nextStepIndex = state.currentStepIndex + 1
  return {
    currentStepIndex: nextStepIndex,
    radiantPicks: nextRadiantPicks,
    direPicks: nextDirePicks,
    radiantBans: nextRadiantBans,
    direBans: nextDireBans,
    history: [...state.history, record],
    isComplete: nextStepIndex > CAPTAINS_MODE_SEQUENCE.length,
  }
}

export function undoCaptainsStep(state: CaptainsDraftState): CaptainsDraftState {
  if (state.history.length === 0) return state

  const lastAction = state.history[state.history.length - 1]
  const newHistory = state.history.slice(0, -1)

  return {
    currentStepIndex: lastAction.step.stepIndex,
    radiantPicks: state.radiantPicks.filter((h) => h.id !== lastAction.hero.id),
    direPicks: state.direPicks.filter((h) => h.id !== lastAction.hero.id),
    radiantBans: state.radiantBans.filter((h) => h.id !== lastAction.hero.id),
    direBans: state.direBans.filter((h) => h.id !== lastAction.hero.id),
    history: newHistory,
    isComplete: false,
  }
}
