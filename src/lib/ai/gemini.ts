import { Hero, Position, DraftAnalysisReport } from '@/types/dota'

export interface GeminiDraftAnalysisInput {
  radiantHeroes: Array<{ hero: Hero; position: Position }>
  direHeroes: Array<{ hero: Hero; position: Position }>
  statisticalReport: DraftAnalysisReport
}

export interface GeminiCoachAdviceInput {
  playerRank: string
  playerPosition: Position
  focusSkill: string
  recentIssue: string
}

export async function askGeminiDraftAnalysis(
  input: GeminiDraftAnalysisInput
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return generateStatisticalFallbackDraftAnalysis(input)
  }

  try {
    const prompt = `Ты — старший аналитик и тренер профессиональных команд Dota 2 (TI level).
Проанализируй следующий драфт на основе точных статистических данных:

Состав Radiant:
${input.radiantHeroes.map((h) => `- Позиция ${h.position}: ${h.hero.localized_name} (${h.hero.attack_type}, ${h.hero.primary_attr.toUpperCase()})`).join('\n')}

Состав Dire:
${input.direHeroes.map((h) => `- Позиция ${h.position}: ${h.hero.localized_name} (${h.hero.attack_type}, ${h.hero.primary_attr.toUpperCase()})`).join('\n')}

Статистические показатели:
- Преимущество: ${input.statisticalReport.overallAdvantage} (${input.statisticalReport.winProbabilityRadiant}% винрейт Radiant)
- Контроль (CC): Radiant ${input.statisticalReport.crowdControl.radiant} vs Dire ${input.statisticalReport.crowdControl.dire}
- Инициация: Radiant ${input.statisticalReport.initiation.radiant} vs Dire ${input.statisticalReport.initiation.dire}
- Масштабирование в лейт: Radiant ${input.statisticalReport.lateGameScaling.radiant} vs Dire ${input.statisticalReport.lateGameScaling.dire}

Составь краткий экспертный стратегический отчет на русском языке:
1. Ключевое условие победы Radiant (Win Condition).
2. Ключевое условие победы Dire (Win Condition).
3. Главная дуэль на линиях и потенциальный сноуболл.
4. Рекомендованный тайминг для решающего тимфайта.`

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to expert rule engine:', err)
  }

  return generateStatisticalFallbackDraftAnalysis(input)
}

function generateStatisticalFallbackDraftAnalysis(input: GeminiDraftAnalysisInput): string {
  const { statisticalReport, radiantHeroes, direHeroes } = input
  const radCarries = radiantHeroes.filter((h) => h.position <= 2).map((h) => h.hero.localized_name).join(' и ')
  const direCarries = direHeroes.filter((h) => h.position <= 2).map((h) => h.hero.localized_name).join(' и ')

  return `### Экспертный отчет CounterDraft AI (Статистический движок)

1. **Win Condition Radiant**:
   Использовать превосходство в контроле (${statisticalReport.crowdControl.radiant}/100) для изоляции вражеского кора. Кор-связка ${radCarries || 'Radiant'} должна реализовать ключевые артефакты (BKB, Blink) до 25-й минуты и захватить контроль над Рошаном.

2. **Win Condition Dire**:
   Сдерживать раннюю агрессию и навязывать затяжные позиционные драки. ${direCarries ? `Героям ${direCarries} требуется пространство для безопасного сплит-пуша` : 'Составу Dire необходимо оттягивать игру'} к поздней стадии (${statisticalReport.lateGameScaling.dire}/100).

3. **Линии и темп**:
   Обратите внимание на распределение ресурсов в первые 10 минут. Если оффлейн проиграет размены по HP, вражеский керри получит ранний слот и заблокирует лес.

4. **Решающий тайминг**:
   ${statisticalReport.timingDependencies.radiant}`
}
