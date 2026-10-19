import { NextResponse } from 'next/server'
import { Hero, Position } from '@/types/dota'
import { solveSmartModeRoles } from '@/lib/draft/optimizer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const heroes: Hero[] = body.heroes || []
    const lockedPositions: Partial<Record<Position, Hero>> = body.lockedPositions || {}

    if (heroes.length !== 5) {
      return NextResponse.json({ error: 'Для расчета требуется ровно 5 героев команды' }, { status: 400 })
    }

    const distributions = solveSmartModeRoles(heroes, lockedPositions)

    return NextResponse.json({
      distributions,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Smart roles failed' }, { status: 500 })
  }
}
