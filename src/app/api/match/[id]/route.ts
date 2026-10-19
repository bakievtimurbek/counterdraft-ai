import { NextResponse } from 'next/server'
import { getOpenDotaMatch } from '@/lib/opendota/client'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const matchId = params.id
    if (!matchId) {
      return NextResponse.json({ error: 'Missing match ID' }, { status: 400 })
    }

    const data = await getOpenDotaMatch(matchId)
    if (!data) {
      return NextResponse.json({ error: 'Матч не найден или еще не обработан в OpenDota' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
