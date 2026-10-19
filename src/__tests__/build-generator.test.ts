import { describe, it, expect } from 'vitest'
import { generateHeroBuild } from '@/lib/builds/build-generator'
import { HEROES } from '@/data/heroes'

describe('Build Generator - Contextual Itemization', () => {
  it('should recommend Spirit Vessel or Skadi when enemy has high regen/heals', () => {
    const necro = HEROES.find((h) => h.localized_name === 'Necrophos')!
    const mirana = HEROES.find((h) => h.localized_name === 'Mirana')!

    const build = generateHeroBuild(mirana, 4, [necro])

    // Should include Spirit Vessel in situational items
    const hasVessel = build.situationalItems.some((i) => i.localized_name === 'Spirit Vessel')
    expect(hasVessel).toBe(true)
    expect(build.itemizationRationale).toContain('снижение регенерации')
  })

  it('should recommend Monkey King Bar against evasion heroes', () => {
    const pa = HEROES.find((h) => h.localized_name === 'Phantom Assassin')!
    const jugg = HEROES.find((h) => h.localized_name === 'Juggernaut')!

    const build = generateHeroBuild(jugg, 1, [pa])

    const hasMkb = build.situationalItems.some((i) => i.localized_name === 'Monkey King Bar')
    expect(hasMkb).toBe(true)
  })
})
