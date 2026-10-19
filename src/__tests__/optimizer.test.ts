import { describe, it, expect } from 'vitest'
import { solveSmartModeRoles, scoreNextPickHero, DEFAULT_DRAFT_WEIGHTS } from '@/lib/draft/optimizer'
import { HEROES } from '@/data/heroes'
import { Hero, Position } from '@/types/dota'

describe('Optimizer - Smart Mode Role Assignment', () => {
  it('should find optimal role assignment for a standard 5-hero draft', () => {
    const am = HEROES.find((h) => h.localized_name === 'Anti-Mage')!
    const storm = HEROES.find((h) => h.localized_name === 'Storm Spirit')!
    const centaur = HEROES.find((h) => h.localized_name === 'Centaur Warrunner')!
    const mirana = HEROES.find((h) => h.localized_name === 'Mirana')!
    const disruptor = HEROES.find((h) => h.localized_name === 'Disruptor')!

    const team = [am, storm, centaur, mirana, disruptor]
    const results = solveSmartModeRoles(team)

    expect(results.length).toBeGreaterThan(0)
    const top = results[0]

    // Anti-Mage should be assigned to Pos 1
    expect(top.assignment[1].localized_name).toBe('Anti-Mage')
    // Storm Spirit should be assigned to Pos 2
    expect(top.assignment[2].localized_name).toBe('Storm Spirit')
    // Centaur should be assigned to Pos 3
    expect(top.assignment[3].localized_name).toBe('Centaur Warrunner')
    // Mirana should be assigned to Pos 4
    expect(top.assignment[4].localized_name).toBe('Mirana')
    // Disruptor should be assigned to Pos 5
    expect(top.assignment[5].localized_name).toBe('Disruptor')

    expect(top.probability).toBeGreaterThan(0)
  })

  it('should respect manually locked positions', () => {
    const pudge = HEROES.find((h) => h.localized_name === 'Pudge')!
    const invoker = HEROES.find((h) => h.localized_name === 'Invoker')!
    const axe = HEROES.find((h) => h.localized_name === 'Axe')!
    const lion = HEROES.find((h) => h.localized_name === 'Lion')!
    const cm = HEROES.find((h) => h.localized_name === 'Crystal Maiden')!

    // Lock Pudge as Pos 1
    const locked = { 1: pudge }
    const results = solveSmartModeRoles([pudge, invoker, axe, lion, cm], locked)

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].assignment[1].localized_name).toBe('Pudge')
  })
})

describe('Optimizer - 5-Factor Scoring', () => {
  it('should calculate 5 factors and apply custom weights correctly', () => {
    const am = HEROES.find((h) => h.localized_name === 'Anti-Mage')!
    const medusa = HEROES.find((h) => h.localized_name === 'Medusa')!
    const axe = HEROES.find((h) => h.localized_name === 'Axe')!

    const allies: Array<{ hero: Hero; position: Position }> = []
    const enemies = [
      { hero: medusa, position: 1 as Position },
      { hero: axe, position: 3 as Position },
    ]

    const customWeights = {
      counterpick: 0.40,
      lane: 0.20,
      synergy: 0.20,
      execution: 0.10,
      scaling: 0.10,
    }

    const rec = scoreNextPickHero(am, 1, allies, enemies, customWeights)

    expect(rec.factors.counterpick.weight).toBe(0.40)
    expect(rec.factors.lane.weight).toBe(0.20)
    expect(rec.totalScore).toBeGreaterThan(0)
    expect(rec.totalScore).toBeLessThanOrEqual(100)
    expect(rec.factors.counterpick.explanation).toBeDefined()
  })
})
