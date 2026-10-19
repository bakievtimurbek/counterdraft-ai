import { NextResponse } from 'next/server'
import { Hero, Position, DraftWeights } from '@/types/dota'
import { scoreNextPickHero, DEFAULT_DRAFT_WEIGHTS } from '@/lib/draft/optimizer'
import { HEROES } from '@/data/heroes'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const targetPosition: Position = body.targetPosition || 1
    const allies: Array<{ hero: Hero; position: Position }> = body.allies || []
    const enemies: Array<{ hero: Hero; position: Position }> = body.enemies || []
    const bannedHeroIds: number[] = body.bannedHeroIds || []
    const customWeights: DraftWeights = body.weights || DEFAULT_DRAFT_WEIGHTS

    // Exclude already picked allies, enemies, and bans
    const pickedHeroIds = new Set<number>([
      ...allies.map((a) => a.hero.id),
      ...enemies.map((e) => e.hero.id),
      ...bannedHeroIds,
    ])

    const availableHeroes = HEROES.filter((h) => !pickedHeroIds.has(h.id))

    // Score all available heroes
    const scored = availableHeroes.map((candidate) =>
      scoreNextPickHero(candidate, targetPosition, allies, enemies, customWeights)
    )

    // Sort descending by total score
    scored.sort((a, b) => b.totalScore - a.totalScore)

    // Return top 5 recommendations
    const top5 = scored.slice(0, 5)

    return NextResponse.json({
      recommendations: top5,
      targetPosition,
      evaluatedCount: availableHeroes.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Next pick calculation failed' }, { status: 500 })
  }
}
