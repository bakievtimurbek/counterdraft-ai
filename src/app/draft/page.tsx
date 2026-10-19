'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Hero,
  Position,
  DraftWeights,
  HeroRecommendation,
  DraftAnalysisReport,
  TeamSide,
  POSITION_NAMES,
} from '@/types/dota'
import { DEFAULT_DRAFT_WEIGHTS } from '@/lib/draft/optimizer'
import {
  CAPTAINS_MODE_SEQUENCE,
  CaptainsDraftState,
  createInitialCaptainsState,
  executeCaptainsStep,
  undoCaptainsStep,
} from '@/lib/draft/captains-mode'
import DraftSlotCard from '@/components/draft/DraftSlotCard'
import HeroPickerModal from '@/components/draft/HeroPickerModal'
import WeightsConfigModal from '@/components/draft/WeightsConfigModal'
import {
  Swords,
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Shuffle,
  AlertTriangle,
} from 'lucide-react'

export default function DraftAnalyzerPage() {
  // Mode: Ranked Draft vs Captain's Mode
  const [draftMode, setDraftMode] = useState<'ranked' | 'captains'>('ranked')

  // Role Assignment Mode: Manual vs Smart
  const [roleMode, setRoleMode] = useState<'manual' | 'smart'>('smart')

  // Draft Slots for Radiant and Dire
  const [radiantSlots, setRadiantSlots] = useState<Record<Position, Hero | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  })
  const [direSlots, setDireSlots] = useState<Record<Position, Hero | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  })

  // Captain's Mode State
  const [captainsState, setCaptainsState] = useState<CaptainsDraftState>(createInitialCaptainsState())

  // Customizable Scoring Weights
  const [weights, setWeights] = useState<DraftWeights>(DEFAULT_DRAFT_WEIGHTS)
  const [weightsModalOpen, setWeightsModalOpen] = useState(false)

  // Picker Modal State
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<{
    side: TeamSide
    position?: Position
    isCaptainsAction?: boolean
  } | null>(null)

  // Smart Mode Permutations
  const [smartDistributions, setSmartDistributions] = useState<any[]>([])

  // Reports and Recommendations
  const [analysisReport, setAnalysisReport] = useState<DraftAnalysisReport | null>(null)
  const [aiExplanation, setAiExplanation] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Next Pick Candidate state
  const [nextPickSide, setNextPickSide] = useState<TeamSide>('radiant')
  const [nextPickPos, setNextPickPos] = useState<Position>(1)
  const [nextPickRecs, setNextPickRecs] = useState<HeroRecommendation[]>([])
  const [isLoadingRecs, setIsLoadingRecs] = useState(false)

  // List of all currently selected hero IDs to avoid duplicates
  const allSelectedHeroIds = useMemo(() => {
    const ids: number[] = []
    Object.values(radiantSlots).forEach((h) => h && ids.push(h.id))
    Object.values(direSlots).forEach((h) => h && ids.push(h.id))
    if (draftMode === 'captains') {
      captainsState.radiantBans.forEach((h) => ids.push(h.id))
      captainsState.direBans.forEach((h) => ids.push(h.id))
    }
    return ids
  }, [radiantSlots, direSlots, draftMode, captainsState])

  // Recalculate Smart Mode distributions when heroes change
  useEffect(() => {
    const radHeroes = Object.values(radiantSlots).filter(Boolean) as Hero[]
    if (radHeroes.length === 5 && roleMode === 'smart') {
      fetch('/api/smart-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroes: radHeroes }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.distributions) setSmartDistributions(d.distributions)
        })
        .catch(console.error)
    } else {
      setSmartDistributions([])
    }
  }, [radiantSlots, roleMode])

  // Recalculate Draft Analysis Report
  useEffect(() => {
    const radList = (Object.entries(radiantSlots) as [any, Hero | null][])
      .filter(([_, h]) => h !== null)
      .map(([pos, h]) => ({ hero: h!, position: Number(pos) as Position }))

    const direList = (Object.entries(direSlots) as [any, Hero | null][])
      .filter(([_, h]) => h !== null)
      .map(([pos, h]) => ({ hero: h!, position: Number(pos) as Position }))

    if (radList.length > 0 || direList.length > 0) {
      setIsAnalyzing(true)
      fetch('/api/analyze-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ radiant: radList, dire: direList }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.report) setAnalysisReport(data.report)
          if (data.aiExplanation) setAiExplanation(data.aiExplanation)
        })
        .catch(console.error)
        .finally(() => setIsAnalyzing(false))
    } else {
      setAnalysisReport(null)
      setAiExplanation('')
    }
  }, [radiantSlots, direSlots])

  // Recalculate Next Pick Recommendations
  useEffect(() => {
    const allies = (Object.entries(nextPickSide === 'radiant' ? radiantSlots : direSlots) as [any, Hero | null][])
      .filter(([_, h]) => h !== null)
      .map(([pos, h]) => ({ hero: h!, position: Number(pos) as Position }))

    const enemies = (Object.entries(nextPickSide === 'radiant' ? direSlots : radiantSlots) as [any, Hero | null][])
      .filter(([_, h]) => h !== null)
      .map(([pos, h]) => ({ hero: h!, position: Number(pos) as Position }))

    const bannedHeroIds = draftMode === 'captains'
      ? [...captainsState.radiantBans.map((h) => h.id), ...captainsState.direBans.map((h) => h.id)]
      : []

    setIsLoadingRecs(true)
    fetch('/api/next-pick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetPosition: nextPickPos,
        allies,
        enemies,
        bannedHeroIds,
        weights,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations) setNextPickRecs(data.recommendations)
      })
      .catch(console.error)
      .finally(() => setIsLoadingRecs(false))
  }, [nextPickSide, nextPickPos, radiantSlots, direSlots, weights, draftMode, captainsState])

  // Handle picking a hero from Modal
  const handleSelectHero = (hero: Hero) => {
    if (!pickerTarget) return

    if (pickerTarget.isCaptainsAction) {
      const nextState = executeCaptainsStep(captainsState, hero)
      setCaptainsState(nextState)

      // Also update slot grids if action is pick
      const currentStep = CAPTAINS_MODE_SEQUENCE[captainsState.currentStepIndex - 1]
      if (currentStep && currentStep.type === 'pick') {
        const targetSide = currentStep.side
        const slots = targetSide === 'radiant' ? radiantSlots : direSlots
        // find first empty slot
        const emptyPos = ([1, 2, 3, 4, 5] as Position[]).find((p) => slots[p] === null)
        if (emptyPos) {
          if (targetSide === 'radiant') {
            setRadiantSlots((prev) => ({ ...prev, [emptyPos]: hero }))
          } else {
            setDireSlots((prev) => ({ ...prev, [emptyPos]: hero }))
          }
        }
      }
      return
    }

    const { side, position } = pickerTarget
    if (!position) return

    if (side === 'radiant') {
      setRadiantSlots((prev) => ({ ...prev, [position]: hero }))
    } else {
      setDireSlots((prev) => ({ ...prev, [position]: hero }))
    }
  }

  // Clear slot
  const handleClearSlot = (side: TeamSide, position: Position) => {
    if (side === 'radiant') {
      setRadiantSlots((prev) => ({ ...prev, [position]: null }))
    } else {
      setDireSlots((prev) => ({ ...prev, [position]: null }))
    }
  }

  // Re-assign position manually
  const handleChangePosition = (side: TeamSide, fromPos: Position, toPos: Position) => {
    if (fromPos === toPos) return
    const setter = side === 'radiant' ? setRadiantSlots : setDireSlots
    setter((prev) => {
      const movedHero = prev[fromPos]
      const existingAtTo = prev[toPos]
      return {
        ...prev,
        [fromPos]: existingAtTo,
        [toPos]: movedHero,
      }
    })
  }

  // Reset entire draft
  const handleResetDraft = () => {
    setRadiantSlots({ 1: null, 2: null, 3: null, 4: null, 5: null })
    setDireSlots({ 1: null, 2: null, 3: null, 4: null, 5: null })
    setCaptainsState(createInitialCaptainsState())
    setSmartDistributions([])
    setAnalysisReport(null)
    setAiExplanation('')
  }

  // Current Captains action step
  const currentCaptainsStep =
    draftMode === 'captains' && captainsState.currentStepIndex <= CAPTAINS_MODE_SEQUENCE.length
      ? CAPTAINS_MODE_SEQUENCE[captainsState.currentStepIndex - 1]
      : null

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#111622] border border-[#212c3e] shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-[#0d1017] border border-[#202a3a]">
            <button
              onClick={() => setDraftMode('ranked')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                draftMode === 'ranked'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ranked Draft
            </button>
            <button
              onClick={() => setDraftMode('captains')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                draftMode === 'captains'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Captain's Mode (24 шага)
            </button>
          </div>

          {/* Role Assignment Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-[#0d1017] border border-[#202a3a]">
            <button
              onClick={() => setRoleMode('smart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                roleMode === 'smart'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Smart Mode (Flex)
            </button>
            <button
              onClick={() => setRoleMode('manual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                roleMode === 'manual'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Manual Mode
            </button>
          </div>
        </div>

        {/* Right side: Weights modal + Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeightsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#182130] hover:bg-[#202b3e] border border-[#29374d] text-xs text-amber-300 font-medium transition"
          >
            <Sliders className="w-3.5 h-3.5" /> Настроить веса (5 факторов)
          </button>
          <button
            onClick={handleResetDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#182130] hover:bg-red-950/40 hover:border-red-700/50 border border-[#29374d] text-xs text-slate-400 hover:text-red-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Сбросить драфт
          </button>
        </div>
      </div>

      {/* Captain's Mode Action Banner */}
      {draftMode === 'captains' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#171e2c] to-[#121622] border border-[#273549] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>Шаг {captainsState.currentStepIndex} из 24</span>
              <span>•</span>
              <span className="uppercase tracking-wider">Фаза {currentCaptainsStep?.phase || 3}</span>
            </div>
            {currentCaptainsStep ? (
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    currentCaptainsStep.side === 'radiant'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                      : 'bg-red-950 text-red-400 border border-red-700/50'
                  }`}
                >
                  {currentCaptainsStep.side.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-white">
                  Очередь: {currentCaptainsStep.type === 'ban' ? 'БАН героя' : 'ПИК героя'} ({currentCaptainsStep.labelRu})
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-emerald-400">
                Драфт Captain's Mode полностью завершен!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentCaptainsStep && (
              <button
                onClick={() => {
                  setPickerTarget({ side: currentCaptainsStep.side, isCaptainsAction: true })
                  setPickerModalOpen(true)
                }}
                className={`px-4 py-2 rounded-lg font-medium text-xs text-white shadow-lg transition ${
                  currentCaptainsStep.type === 'ban'
                    ? 'bg-red-700 hover:bg-red-600 shadow-red-950/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                }`}
              >
                {currentCaptainsStep.type === 'ban' ? 'Забанить героя' : 'Пикнуть героя'}
              </button>
            )}
            {captainsState.history.length > 0 && (
              <button
                onClick={() => setCaptainsState(undoCaptainsStep(captainsState))}
                className="px-3 py-2 rounded-lg bg-[#1a2333] hover:bg-[#222d40] border border-[#28374d] text-xs text-slate-300"
              >
                Отменить шаг
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bans Summary in Captain's Mode */}
      {draftMode === 'captains' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1e2634] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-emerald-400 shrink-0">Баны Radiant:</span>
            {captainsState.radiantBans.map((b) => (
              <div key={b.id} className="relative group">
                <img src={b.img} alt={b.localized_name} className="w-8 h-5 object-cover rounded opacity-60 grayscale hover:grayscale-0" />
                <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs pointer-events-none">✕</div>
              </div>
            ))}
            {captainsState.radiantBans.length === 0 && <span className="text-xs text-slate-500">Нет банов</span>}
          </div>

          <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1e2634] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-red-400 shrink-0">Баны Dire:</span>
            {captainsState.direBans.map((b) => (
              <div key={b.id} className="relative group">
                <img src={b.img} alt={b.localized_name} className="w-8 h-5 object-cover rounded opacity-60 grayscale hover:grayscale-0" />
                <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs pointer-events-none">✕</div>
              </div>
            ))}
            {captainsState.direBans.length === 0 && <span className="text-xs text-slate-500">Нет банов</span>}
          </div>
        </div>
      )}

      {/* Draft Grids: Radiant vs Dire */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* RADIANT TEAM */}
        <div className="rounded-2xl bg-[#0e131d] border border-emerald-900/30 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2636]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <h2 className="font-bold text-base text-white tracking-wide">RADIANT</h2>
              <span className="text-xs text-emerald-400/80 font-mono">Свет</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {Object.values(radiantSlots).filter(Boolean).length}/5 героев
            </span>
          </div>

          {/* 5 Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {([1, 2, 3, 4, 5] as Position[]).map((pos) => (
              <DraftSlotCard
                key={pos}
                position={pos}
                hero={radiantSlots[pos]}
                side="radiant"
                onOpenPicker={() => {
                  setPickerTarget({ side: 'radiant', position: pos })
                  setPickerModalOpen(true)
                }}
                onClearHero={() => handleClearSlot('radiant', pos)}
                onChangePosition={(newPos) => handleChangePosition('radiant', pos, newPos)}
              />
            ))}
          </div>
        </div>

        {/* DIRE TEAM */}
        <div className="rounded-2xl bg-[#0e131d] border border-red-900/30 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2636]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
              <h2 className="font-bold text-base text-white tracking-wide">DIRE</h2>
              <span className="text-xs text-red-400/80 font-mono">Тьма</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {Object.values(direSlots).filter(Boolean).length}/5 героев
            </span>
          </div>

          {/* 5 Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {([1, 2, 3, 4, 5] as Position[]).map((pos) => (
              <DraftSlotCard
                key={pos}
                position={pos}
                hero={direSlots[pos]}
                side="dire"
                onOpenPicker={() => {
                  setPickerTarget({ side: 'dire', position: pos })
                  setPickerModalOpen(true)
                }}
                onClearHero={() => handleClearSlot('dire', pos)}
                onChangePosition={(newPos) => handleChangePosition('dire', pos, newPos)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Smart Mode Distributions Drawer */}
      {roleMode === 'smart' && smartDistributions.length > 0 && (
        <div className="p-4 rounded-xl bg-[#111724] border border-emerald-800/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Shuffle className="w-4 h-4" /> Smart Mode: Оптимальные распределения Flex-пиков Radiant
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {smartDistributions.map((dist, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#161d2d] border border-[#233044] hover:border-emerald-500/50 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white">Вариант #{idx + 1}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                      {dist.probability}% шанс
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{dist.explanationRu}</p>
                </div>
                <button
                  onClick={() => {
                    setRadiantSlots({
                      1: dist.assignment[1],
                      2: dist.assignment[2],
                      3: dist.assignment[3],
                      4: dist.assignment[4],
                      5: dist.assignment[5],
                    })
                  }}
                  className="w-full py-1.5 rounded bg-emerald-800/40 hover:bg-emerald-700/60 text-emerald-200 text-xs font-medium border border-emerald-600/50 transition"
                >
                  Применить это распределение
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Pick Advisor (Section 8 of TЗ) */}
      <div className="p-5 rounded-2xl bg-[#101520] border border-[#212c3f] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1d2738]">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Подбор следующего пика (Next Pick Advisor)
              </h3>
              <p className="text-xs text-slate-400">
                Взвешенная оценка по 5 факторам с учетом контрпиков и синергии
              </p>
            </div>
          </div>

          {/* Side & Position Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-md bg-[#161e2b] border border-[#253246]">
              <button
                onClick={() => setNextPickSide('radiant')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  nextPickSide === 'radiant' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Для Radiant
              </button>
              <button
                onClick={() => setNextPickSide('dire')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  nextPickSide === 'dire' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Для Dire
              </button>
            </div>

            <select
              value={nextPickPos}
              onChange={(e) => setNextPickPos(Number(e.target.value) as Position)}
              className="px-2.5 py-1.5 rounded-md bg-[#161e2b] border border-[#253246] text-xs text-slate-200 focus:outline-none"
            >
              <option value={1}>Позиция 1 (Carry)</option>
              <option value={2}>Позиция 2 (Mid)</option>
              <option value={3}>Позиция 3 (Offlane)</option>
              <option value={4}>Позиция 4 (Soft Support)</option>
              <option value={5}>Позиция 5 (Hard Support)</option>
            </select>
          </div>
        </div>

        {/* Top 5 Recommendations Cards */}
        {isLoadingRecs ? (
          <div className="h-40 flex items-center justify-center text-xs text-slate-400">
            Расчет оптимальных кандидатов...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {nextPickRecs.map((rec, idx) => (
              <div
                key={rec.hero.id}
                className="p-3 rounded-xl bg-[#141b27] border border-[#222e40] hover:border-amber-500/60 transition flex flex-col justify-between gap-3 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-amber-400">
                      Top #{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-white bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
                      {rec.totalScore} / 100
                    </span>
                  </div>

                  <div className="aspect-[16/9] w-full rounded overflow-hidden bg-black/50">
                    <img src={rec.hero.img} alt={rec.hero.localized_name} className="w-full h-full object-cover" />
                  </div>

                  <div className="font-bold text-xs text-slate-100 truncate">
                    {rec.hero.localized_name}
                  </div>

                  {/* 5 Factors Breakdown */}
                  <div className="space-y-1 text-[10px] pt-1 border-t border-[#1e2736]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Контрпик (30%):</span>
                      <span className="font-mono font-medium text-red-400">{rec.factors.counterpick.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Линия (25%):</span>
                      <span className="font-mono font-medium text-emerald-400">{rec.factors.lane.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Синергия (20%):</span>
                      <span className="font-mono font-medium text-sky-400">{rec.factors.synergy.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Исполнение (15%):</span>
                      <span className="font-mono font-medium text-amber-400">{rec.factors.execution.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Лейт (10%):</span>
                      <span className="font-mono font-medium text-purple-400">{rec.factors.scaling.score}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {rec.whyBetterThanAlternatives}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (nextPickSide === 'radiant') {
                      setRadiantSlots((prev) => ({ ...prev, [nextPickPos]: rec.hero }))
                    } else {
                      setDireSlots((prev) => ({ ...prev, [nextPickPos]: rec.hero }))
                    }
                  }}
                  className="w-full py-1.5 rounded bg-red-700/80 hover:bg-red-600 text-white text-xs font-semibold shadow transition"
                >
                  Выбрать в слот {nextPickPos}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Structured Draft Analysis Report (Section 6 of TЗ) */}
      {analysisReport && (
        <div className="rounded-2xl bg-[#10141f] border border-[#243144] p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#212b3b]">
            <div>
              <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" /> Полный аналитический отчет драфта
              </h3>
              <p className="text-xs text-slate-400">
                10 ключевых параметров состава, сильные и слабые стороны, тайминги
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#17202e] border border-[#28374d]">
                <span className="text-xs text-slate-400">Винрейт Radiant:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">
                  {analysisReport.winProbabilityRadiant}%
                </span>
              </div>
            </div>
          </div>

          {/* 9 Core Parameters Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Контроль (Crowd Control)', rad: analysisReport.crowdControl.radiant, dire: analysisReport.crowdControl.dire },
              { label: 'Инициация (Initiation)', rad: analysisReport.initiation.radiant, dire: analysisReport.initiation.dire },
              { label: 'Мобильность (Mobility)', rad: analysisReport.mobility.radiant, dire: analysisReport.mobility.dire },
              { label: 'Магическая защита', rad: analysisReport.magicDefense.radiant, dire: analysisReport.magicDefense.dire },
              { label: 'Физическая защита', rad: analysisReport.physicalDefense.radiant, dire: analysisReport.physicalDefense.dire },
              { label: 'Анти-иллюзии / AoE', rad: analysisReport.antiIllusion.radiant, dire: analysisReport.antiIllusion.dire },
              { label: 'Потенциал пуша', rad: analysisReport.pushPotential.radiant, dire: analysisReport.pushPotential.dire },
              { label: 'Потенциал Рошана', rad: analysisReport.roshanPotential.radiant, dire: analysisReport.roshanPotential.dire },
              { label: 'Масштабирование в лейт', rad: analysisReport.lateGameScaling.radiant, dire: analysisReport.lateGameScaling.dire },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#141b27] border border-[#1f293a] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{stat.rad}</span>
                  <span className="text-slate-300 font-medium text-center">{stat.label}</span>
                  <span className="font-mono text-red-400 font-bold">{stat.dire}</span>
                </div>
                <div className="h-2 w-full bg-[#1e2738] rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(stat.rad / (stat.rad + stat.dire)) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(stat.dire / (stat.rad + stat.dire)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-900/40 space-y-3">
              <h4 className="font-semibold text-xs text-emerald-400 uppercase tracking-wider">
                Radiant: Сильные стороны и уязвимости
              </h4>
              <div className="space-y-1.5">
                {analysisReport.radiantStrengths.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
                {analysisReport.radiantWeaknesses.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/40 space-y-3">
              <h4 className="font-semibold text-xs text-red-400 uppercase tracking-wider">
                Dire: Сильные стороны и уязвимости
              </h4>
              <div className="space-y-1.5">
                {analysisReport.direStrengths.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
                {analysisReport.direWeaknesses.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Strategic Gameplan Report */}
          {aiExplanation && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#172030] to-[#131724] border border-[#2b3a50] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4" /> Анализ плана на игру (AI Win Condition)
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {aiExplanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Picker Modal */}
      <HeroPickerModal
        isOpen={pickerModalOpen}
        onClose={() => setPickerModalOpen(false)}
        onSelectHero={handleSelectHero}
        excludedHeroIds={allSelectedHeroIds}
        title={pickerTarget?.isCaptainsAction ? 'Выбор в Captain\'s Mode' : `Выбор героя для ${pickerTarget?.side?.toUpperCase()} (Слот ${pickerTarget?.position})`}
      />

      {/* Weights Config Modal */}
      <WeightsConfigModal
        isOpen={weightsModalOpen}
        onClose={() => setWeightsModalOpen(false)}
        currentWeights={weights}
        onSaveWeights={(w) => setWeights(w)}
      />
    </div>
  )
}
