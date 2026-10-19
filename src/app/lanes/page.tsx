'use client'

import React, { useState, useMemo } from 'react'
import { Hero, Position } from '@/types/dota'
import { HEROES } from '@/data/heroes'
import { evaluateAllLanes } from '@/lib/lanes/lane-evaluator'
import HeroPickerModal from '@/components/draft/HeroPickerModal'
import {
  Layers,
  Swords,
  ShieldAlert,
  Flame,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle2,
} from 'lucide-react'

export default function LaneMatchupsPage() {
  // Preset default lineup for immediate rich visualization
  const [radiantPositions, setRadiantPositions] = useState<Record<Position, Hero | null>>({
    1: HEROES.find((h) => h.localized_name === 'Anti-Mage') || null,
    2: HEROES.find((h) => h.localized_name === 'Storm Spirit') || null,
    3: HEROES.find((h) => h.localized_name === 'Centaur Warrunner') || null,
    4: HEROES.find((h) => h.localized_name === 'Mirana') || null,
    5: HEROES.find((h) => h.localized_name === 'Disruptor') || null,
  })

  const [direPositions, setDirePositions] = useState<Record<Position, Hero | null>>({
    1: HEROES.find((h) => h.localized_name === 'Medusa') || null,
    2: HEROES.find((h) => h.localized_name === 'Puck') || null,
    3: HEROES.find((h) => h.localized_name === 'Axe') || null,
    4: HEROES.find((h) => h.localized_name === 'Lion') || null,
    5: HEROES.find((h) => h.localized_name === 'Crystal Maiden') || null,
  })

  const [pickerTarget, setPickerTarget] = useState<{ side: 'radiant' | 'dire'; pos: Position } | null>(null)

  // Evaluate the 3 lanes
  const laneEvaluations = useMemo(() => {
    return evaluateAllLanes(radiantPositions, direPositions)
  }, [radiantPositions, direPositions])

  const handleSelectHero = (hero: Hero) => {
    if (!pickerTarget) return
    const { side, pos } = pickerTarget
    if (side === 'radiant') {
      setRadiantPositions((prev) => ({ ...prev, [pos]: hero }))
    } else {
      setDirePositions((prev) => ({ ...prev, [pos]: hero }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" /> Анализ линий (Lane Matchups)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Расчет ранней стадии 0–10 минут: Safe Lane (1+5 vs 3+4), Mid (2 vs 2), Offlane (3+4 vs 1+5).
            Смена позиций динамически пересчитывает матчапы и стартовый закуп.
          </p>
        </div>
      </div>

      {/* Lineup Quick Picker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radiant Lineup */}
        <div className="p-4 rounded-xl bg-[#0e131d] border border-emerald-900/40 space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Состав Radiant по позициям
          </span>
          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as Position[]).map((pos) => {
              const h = radiantPositions[pos]
              return (
                <button
                  key={pos}
                  onClick={() => setPickerTarget({ side: 'radiant', pos })}
                  className="p-1.5 rounded-lg bg-[#141a27] border border-[#222e40] hover:border-emerald-500 transition text-center group"
                >
                  <span className="text-[10px] font-mono text-emerald-400 block mb-1">
                    Pos {pos}
                  </span>
                  {h ? (
                    <img src={h.img} alt={h.localized_name} className="w-full aspect-[16/9] object-cover rounded" />
                  ) : (
                    <div className="w-full aspect-[16/9] rounded bg-black/40 flex items-center justify-center text-[10px] text-slate-500">
                      +
                    </div>
                  )}
                  <span className="text-[10px] text-slate-200 block truncate mt-1">
                    {h?.localized_name || 'Выбрать'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dire Lineup */}
        <div className="p-4 rounded-xl bg-[#0e131d] border border-red-900/40 space-y-3">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Состав Dire по позициям
          </span>
          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as Position[]).map((pos) => {
              const h = direPositions[pos]
              return (
                <button
                  key={pos}
                  onClick={() => setPickerTarget({ side: 'dire', pos })}
                  className="p-1.5 rounded-lg bg-[#141a27] border border-[#222e40] hover:border-red-500 transition text-center group"
                >
                  <span className="text-[10px] font-mono text-red-400 block mb-1">
                    Pos {pos}
                  </span>
                  {h ? (
                    <img src={h.img} alt={h.localized_name} className="w-full aspect-[16/9] object-cover rounded" />
                  ) : (
                    <div className="w-full aspect-[16/9] rounded bg-black/40 flex items-center justify-center text-[10px] text-slate-500">
                      +
                    </div>
                  )}
                  <span className="text-[10px] text-slate-200 block truncate mt-1">
                    {h?.localized_name || 'Выбрать'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3 Detailed Lane Cards */}
      <div className="space-y-6">
        {laneEvaluations.map((lane, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#10141f] border border-[#222d3e] p-6 shadow-xl space-y-5"
          >
            {/* Lane Title & Advantage Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e2736]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-[#192231] font-bold text-sm text-white">
                  {lane.laneName}
                </span>
                <span className="text-xs text-slate-400">
                  {lane.laneName === 'Safe Lane' && 'Radiant Carry + Hard Support vs Dire Offlane Duo'}
                  {lane.laneName === 'Mid Lane' && 'Radiant Mid vs Dire Mid (1v1 соло дуэль)'}
                  {lane.laneName === 'Offlane' && 'Radiant Offlane Duo vs Dire Carry + Hard Support'}
                </span>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${
                  lane.advantage === 'Radiant Favored'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                    : lane.advantage === 'Dire Favored'
                    ? 'bg-red-950 text-red-400 border border-red-700/50'
                    : 'bg-slate-800 text-slate-300 border border-slate-600'
                }`}
              >
                {lane.advantage}
              </div>
            </div>

            {/* Heroes on this lane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radiant side */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {lane.radiantHeroes.map((h) => (
                    <div key={h.id} className="text-center">
                      <img src={h.img} alt={h.localized_name} className="w-16 h-10 object-cover rounded bg-black/50" />
                      <span className="text-[10px] text-slate-300 block truncate mt-1">{h.localized_name}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-emerald-400 font-semibold">Radiant сторона</div>
                  <div className="text-slate-400">Килл-угроза: <span className="font-mono text-white font-bold">{lane.killThreatRadiant}/10</span></div>
                  <div className="text-slate-400">Сустейн / Хил: <span className="font-mono text-white font-bold">{lane.sustainRadiant}/10</span></div>
                </div>
              </div>

              {/* Dire side */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-right">
                  <div className="text-red-400 font-semibold">Dire сторона</div>
                  <div className="text-slate-400">Килл-угроза: <span className="font-mono text-white font-bold">{lane.killThreatDire}/10</span></div>
                  <div className="text-slate-400">Сустейн / Хил: <span className="font-mono text-white font-bold">{lane.sustainDire}/10</span></div>
                </div>
                <div className="flex items-center gap-2">
                  {lane.direHeroes.map((h) => (
                    <div key={h.id} className="text-center">
                      <img src={h.img} alt={h.localized_name} className="w-16 h-10 object-cover rounded bg-black/50" />
                      <span className="text-[10px] text-slate-300 block truncate mt-1">{h.localized_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Starting Items Advice for this lane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1e2736]">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Стартовый закуп Radiant:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lane.startingItemsAdvice.radiant.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#17202d] border border-[#273549] text-xs text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Стартовый закуп Dire:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lane.startingItemsAdvice.dire.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#17202d] border border-[#273549] text-xs text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tactical Tips */}
            <div className="p-3 rounded-lg bg-[#141b27] border border-[#1f293a] space-y-1">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Тактические рекомендации по линии:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {lane.gameplayTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <HeroPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelectHero={handleSelectHero}
        title="Выбрать героя на линию"
      />
    </div>
  )
}
