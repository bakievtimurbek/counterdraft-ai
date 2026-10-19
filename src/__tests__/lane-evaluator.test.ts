import { describe, it, expect } from 'vitest'
import { evaluateLaneMatchup } from '@/lib/lanes/lane-evaluator'
import { HEROES } from '@/data/heroes'

describe('Lane Evaluator', () => {
  it('should calculate lane advantage and suggest starting items', () => {
    const am = HEROES.find((h) => h.localized_name === 'Anti-Mage')!
    const disruptor = HEROES.find((h) => h.localized_name === 'Disruptor')!
    const axe = HEROES.find((h) => h.localized_name === 'Axe')!
    const lion = HEROES.find((h) => h.localized_name === 'Lion')!

    const lane = evaluateLaneMatchup('Safe Lane', [am, disruptor], [axe, lion])

    expect(lane.killThreatDire).toBeGreaterThanOrEqual(6)
    expect(lane.startingItemsAdvice.radiant.length).toBeGreaterThan(0)
    expect(lane.gameplayTips.length).toBeGreaterThan(0)
  })
})
