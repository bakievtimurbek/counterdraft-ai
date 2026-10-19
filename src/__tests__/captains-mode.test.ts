import { describe, it, expect } from 'vitest'
import {
  CAPTAINS_MODE_SEQUENCE,
  createInitialCaptainsState,
  executeCaptainsStep,
  undoCaptainsStep,
} from '@/lib/draft/captains-mode'
import { HEROES } from '@/data/heroes'

describe('Captains Mode State Machine', () => {
  it('should have exactly 24 actions (14 bans, 10 picks)', () => {
    expect(CAPTAINS_MODE_SEQUENCE.length).toBe(24)
    const bans = CAPTAINS_MODE_SEQUENCE.filter((s) => s.type === 'ban')
    const picks = CAPTAINS_MODE_SEQUENCE.filter((s) => s.type === 'pick')
    expect(bans.length).toBe(14)
    expect(picks.length).toBe(10)
  })

  it('should step through draft actions correctly and record history', () => {
    let state = createInitialCaptainsState()
    expect(state.currentStepIndex).toBe(1)
    expect(state.isComplete).toBe(false)

    // Step 1: Radiant Ban
    const banHero1 = HEROES[0]
    state = executeCaptainsStep(state, banHero1)
    expect(state.currentStepIndex).toBe(2)
    expect(state.radiantBans.length).toBe(1)
    expect(state.radiantBans[0].id).toBe(banHero1.id)

    // Step 2: Dire Ban
    const banHero2 = HEROES[1]
    state = executeCaptainsStep(state, banHero2)
    expect(state.currentStepIndex).toBe(3)
    expect(state.direBans.length).toBe(1)

    // Undo Step 2
    state = undoCaptainsStep(state)
    expect(state.currentStepIndex).toBe(2)
    expect(state.direBans.length).toBe(0)
  })
})
