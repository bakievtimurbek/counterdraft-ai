import { NextResponse } from 'next/server'
import { checkDataSourcesHealth } from '@/lib/opendota/client'

export async function GET() {
  try {
    const statuses = await checkDataSourcesHealth()
    return NextResponse.json({
      sources: statuses,
      systemTime: new Date().toISOString(),
      patch: '7.37e / 7.38 Meta',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
