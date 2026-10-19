'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { CoachSkillTrack, Position, ProPlayer, WeeklyImprovementPlan } from '@/types/dota'
import { PRO_PLAYERS, getProPlayersByPosition, getProPlayersBySkill } from '@/data/pro-coach'
import {
  Trophy,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Layers,
  Activity,
  Flame,
  Award,
} from 'lucide-react'

const SKILL_TRACKS: Array<{ id: CoachSkillTrack; titleRu: string; description: string; icon: string }> = [
  { id: 'farming', titleRu: '1. Farming (Эффективность фарма)', description: 'CS/мин, лесной треугольник, тайминги стаков и зачистка волн.', icon: '🌾' },
  { id: 'positioning', titleRu: '2. Positioning (Позиционирование)', description: 'Дистанция атаки, сброс фокуса, игра за деревьями и ожидание BKB.', icon: '🎯' },
  { id: 'laning', titleRu: '3. Laning (Стадия лайнинга)', description: 'Крип-агр, контроль регена, блокировка лагерей и отводы.', icon: '⚔️' },
  { id: 'map_awareness', titleRu: '4. Map Awareness (Чтение карты)', description: 'Контроль рун мудрости, чтение смок-атак и реакция на миникарту.', icon: '🗺️' },
  { id: 'teamfight_decisions', titleRu: '5. Teamfight Decisions (Драки)', description: 'Приоритет фокуса, тайминги ультимейтов и байбек-дисциплина.', icon: '💥' },
  { id: 'itemization', titleRu: '6. Itemization (Сборки артефактов)', description: 'Контр-билды (Vessel, MKB, Silver Edge) и расчет таймингов.', icon: '🛡️' },
  { id: 'death_analysis', titleRu: '7. Death Analysis (Анализ смертей)', description: 'Исключение смертей без вижна и предотвращение бессмысленных фидов.', icon: '💀' },
]

export default function PersonalCoachPage() {
  const [selectedSkill, setSelectedSkill] = useState<CoachSkillTrack>('farming')
  const [selectedPosition, setSelectedPosition] = useState<number>(0) // 0: all positions
  const [selectedPro, setSelectedPro] = useState<ProPlayer>(PRO_PLAYERS[0])

  // Weekly Plan Generator State
  const [userRank, setUserRank] = useState('Legend / Ancient')
  const [userPos, setUserPos] = useState<Position>(1)
  const [planPrioritySkill, setPlanPrioritySkill] = useState<CoachSkillTrack>('farming')
  const [activePlan, setActivePlan] = useState<WeeklyImprovementPlan | null>(null)

  // Load saved plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('counterdraft_weekly_plan')
      if (saved) setActivePlan(JSON.parse(saved))
    } catch (e) {}
  }, [])

  // Filter pro players
  const filteredPros = useMemo(() => {
    return PRO_PLAYERS.filter((p) => {
      if (selectedPosition !== 0 && p.position !== selectedPosition) return false
      if (!p.skillSpecialties.includes(selectedSkill)) return false
      return true
    })
  }, [selectedSkill, selectedPosition])

  // Generate Weekly Improvement Plan
  const handleGeneratePlan = () => {
    const prosForPos = PRO_PLAYERS.filter((p) => p.position === userPos && p.skillSpecialties.includes(planPrioritySkill))
    const proMentor = prosForPos[0] || PRO_PLAYERS[0]

    const newPlan: WeeklyImprovementPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      targetPosition: userPos,
      currentRank: userRank,
      selectedHeroes: ['Anti-Mage', 'Morphling', 'Faceless Void'],
      prioritySkills: [planPrioritySkill],
      assignedPros: [proMentor.name],
      drills: proMentor.drills,
      measurableGoals: [
        'Достичь >= 75 CS на 10-й минуте в 4 из 5 следующих рейтинговых матчей.',
        'Снизить количество смертей до 15-й минуты до <= 2 за игру.',
        'Выполнить упражнение по таймингу первого артефакта.',
      ],
      reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
    }

    setActivePlan(newPlan)
    try {
      localStorage.setItem('counterdraft_weekly_plan', JSON.stringify(newPlan))
    } catch (e) {}
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#141b27] to-[#121622] border border-amber-800/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Система персонального совершенствования (Personal Improvement Coach)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Тренируйтесь по методикам чемпионов The International
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Разбор ошибок по 7 ключевым навыкам, паттерны фарма от Yatoro и Satanic,
            инициация от Collapse, вардинг от Miposhka и измеримые практические упражнения.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('plan-generator')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-950/50 transition shrink-0"
        >
          Составить план на неделю →
        </button>
      </div>

      {/* 7 Skill Tracks Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SKILL_TRACKS.map((track) => {
          const isActive = selectedSkill === track.id
          return (
            <button
              key={track.id}
              onClick={() => setSelectedSkill(track.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30 scale-[1.02]'
                  : 'bg-[#111622] hover:bg-[#161d2d] border-[#202b3c] text-slate-300'
              }`}
            >
              <div className="text-lg mb-1">{track.icon}</div>
              <div className={`font-bold text-xs truncate ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                {track.titleRu.split(' ')[1]}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {track.description}
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter by Position (1-5) */}
      <div className="flex items-center gap-2 p-1 bg-[#10141f] rounded-xl border border-[#20293b] w-fit">
        <span className="text-xs text-slate-400 px-3">Фильтр по позиции:</span>
        <button
          onClick={() => setSelectedPosition(0)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            selectedPosition === 0 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Все позиции
        </button>
        {[1, 2, 3, 4, 5].map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
              selectedPosition === pos ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pos {pos}
          </button>
        ))}
      </div>

      {/* Pro Directory & Deep Dive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Verified Pros Cards */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2 border-b border-[#202a3a]">
            Профессиональные наставники ({filteredPros.length})
          </div>

          {filteredPros.map((pro) => (
            <button
              key={pro.id}
              onClick={() => setSelectedPro(pro)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedPro.id === pro.id
                  ? 'bg-[#192233] border-amber-500 shadow-md'
                  : 'bg-[#111622] hover:bg-[#161d2d] border-[#222d3e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-sm text-white">{pro.name}</div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-600/30">
                  Pos {pro.position}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {pro.team} • {pro.country}
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                "{pro.coachingPhilosophy}"
              </p>
            </button>
          ))}
        </div>

        {/* Right: Selected Pro Deep Dive */}
        <div className="lg:col-span-2 rounded-2xl bg-[#10141f] border border-[#232f42] p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#212b3b]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-white">{selectedPro.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 text-xs font-semibold">
                  {selectedPro.team}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Основная философия: "{selectedPro.coachingPhilosophy}"
              </p>
            </div>

            <div className="text-xs font-mono text-slate-300 bg-[#16202e] px-3 py-1.5 rounded-lg border border-[#26374f]">
              Специализации: {selectedPro.skillSpecialties.join(', ')}
            </div>
          </div>

          {/* Notable Matches & Replay Evidence (Section E of TЗ) */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Подтвержденные матчи и ключевые решения
            </h3>

            <div className="space-y-3">
              {selectedPro.notableMatches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#141b27] border border-[#222c3d] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-white">
                      <span>{m.tournament}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">vs {m.opponent}</span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                      Match #{m.matchId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-[#0f141f] p-2.5 rounded border border-[#1d2636]">
                    <span className="text-amber-400 font-semibold">Ключевое решение: </span>
                    {m.keyTakeaway}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    {m.csAt10 !== undefined && (
                      <span>CS на 10-й мин: <strong className="text-emerald-400">{m.csAt10}</strong></span>
                    )}
                    {m.networthAt20 !== undefined && (
                      <span>Нетворс на 20-й мин: <strong className="text-amber-400">{m.networthAt20}g</strong></span>
                    )}
                    {m.vodTimestamp && (
                      <span>Таймкод разбора: <strong className="text-sky-400">{m.vodTimestamp}</strong></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Drills (Section D of TЗ) */}
          <div className="space-y-3 pt-2 border-t border-[#1f2838]">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> Практические упражнения для рейтинга
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPro.drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141b27] border border-[#202a3a] space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-100">{drill.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2738] text-slate-300">
                        {drill.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{drill.objective}</p>
                  </div>

                  <div className="text-[10px] bg-[#0e131d] p-2 rounded border border-[#1b2332] space-y-1">
                    <div className="text-slate-400">
                      Как измерить: <span className="text-slate-200">{drill.howToMeasure}</span>
                    </div>
                    <div className="text-amber-400 font-semibold">
                      Целевой бенчмарк: {drill.targetBenchmark}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Plan Generator & Saved Plan (Section F of TЗ) */}
      <div id="plan-generator" className="rounded-2xl bg-[#10141f] border border-[#232f42] p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1f2838]">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h2 className="font-extrabold text-base text-white">
            Генератор персонального плана развития на неделю
          </h2>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Ваш ранг:</label>
            <select
              value={userRank}
              onChange={(e) => setUserRank(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#141b27] border border-[#20293b] text-xs text-slate-200 focus:outline-none"
            >
              <option value="Herald / Guardian">Herald / Guardian (0 - 1500 MMR)</option>
              <option value="Crusader / Archon">Crusader / Archon (1500 - 3000 MMR)</option>
              <option value="Legend / Ancient">Legend / Ancient (3000 - 4500 MMR)</option>
              <option value="Divine / Immortal">Divine / Immortal (4500+ MMR)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Ваша основная позиция:</label>
            <select
              value={userPos}
              onChange={(e) => setUserPos(Number(e.target.value) as Position)}
              className="w-full px-3 py-2 rounded-lg bg-[#141b27] border border-[#20293b] text-xs text-slate-200 focus:outline-none"
            >
              <option value={1}>Позиция 1 (Carry)</option>
              <option value={2}>Позиция 2 (Mid)</option>
              <option value={3}>Позиция 3 (Offlane)</option>
              <option value={4}>Позиция 4 (Soft Support)</option>
              <option value={5}>Позиция 5 (Hard Support)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Приоритетная слабость:</label>
            <select
              value={planPrioritySkill}
              onChange={(e) => setPlanPrioritySkill(e.target.value as CoachSkillTrack)}
              className="w-full px-3 py-2 rounded-lg bg-[#141b27] border border-[#20293b] text-xs text-slate-200 focus:outline-none"
            >
              {SKILL_TRACKS.map((t) => (
                <option key={t.id} value={t.id}>{t.titleRu}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-red-950/50 transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Сгенерировать персональный план на неделю
        </button>

        {/* Render Generated / Saved Plan */}
        {activePlan && (
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#161f2e] to-[#121622] border border-[#29394f] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#212d3e]">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Активный недельный план (до {activePlan.reviewDate})
                </span>
                <h3 className="font-bold text-sm text-white mt-0.5">
                  Позиция {activePlan.targetPosition} • Наставник: {activePlan.assignedPros.join(', ')}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Создан: {activePlan.createdAt}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Измеримые цели на неделю:</span>
              <ul className="space-y-1.5">
                {activePlan.measurableGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
