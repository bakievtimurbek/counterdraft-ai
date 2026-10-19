import { NextResponse } from 'next/server'
import { Hero, Position } from '@/types/dota'
import { analyzeFullDraft } from '@/lib/draft/full-analysis'
import { askGeminiDraftAnalysis } from '@/lib/ai/gemini'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const radiantList: Array<{ hero: Hero; position: Position }> = body.radiant || []
    const direList: Array<{ hero: Hero; position: Position }> = body.dire || []

    const radiantHeroes = radiantList.map((item) => item.hero)
    const direHeroes = direList.map((item) => item.hero)

    const statisticalReport = analyzeFullDraft(radiantHeroes, direHeroes)

    let aiExplanation = ''
    if (radiantHeroes.length > 0 && direHeroes.length > 0) {
      aiExplanation = await askGeminiDraftAnalysis({
        radiantHeroes: radiantList,
        direHeroes: direList,
        statisticalReport,
      })
    }

    return NextResponse.json({
      report: statisticalReport,
      aiExplanation,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Draft analysis failed' }, { status: 500 })
  }
}
