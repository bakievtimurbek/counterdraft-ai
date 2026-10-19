'use client'

import React, { useState, useMemo } from 'react'
import { Hero } from '@/types/dota'
import { HEROES } from '@/data/heroes'
import { MATCHUP_DATA, getMatchupAdvantage } from '@/data/matchups'
import { ITEMS } from '@/data/items'
import HeroPickerModal from '@/components/draft/HeroPickerModal'
import { ShieldAlert, Swords, Search, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'

export default function CounterPicksPage() {
  const [selectedHero, setSelectedHero] = useState<Hero>(HEROES.find((h) => h.localized_name === 'Anti-Mage') || HEROES[0])
  const [pickerOpen, setPickerOpen] = useState(false)

  // Calculate best matchups (heroes that selectedHero counters)
  const bestMatchups = useMemo(() => {
    return HEROES.map((target) => {
      if (target.id === selectedHero.id) return null
      const { advantage, reason } = getMatchupAdvantage(selectedHero.id, target.id)
      return {
        target,
        advantage,
        reason: reason || `${selectedHero.localized_name} имеет статистический перевес по винрейту в текущем патче.`,
      }
    })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.advantage > 0)
      .sort((a, b) => b.advantage - a.advantage)
      .slice(0, 5)
  }, [selectedHero])

  // Calculate worst matchups (heroes that counter selectedHero)
  const worstMatchups = useMemo(() => {
    return HEROES.map((enemy) => {
      if (enemy.id === selectedHero.id) return null
      const { advantage, reason } = getMatchupAdvantage(enemy.id, selectedHero.id)
      return {
        enemy,
        advantage,
        reason: reason || `${enemy.localized_name} побеждает за счет раннего темпа и контроля.`,
      }
    })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.advantage > 0)
      .sort((a, b) => b.advantage - a.advantage)
      .slice(0, 5)
  }, [selectedHero])

  // Items that counter this hero
  const counterItems = useMemo(() => {
    return ITEMS.filter((item) => {
      if (item.countersHeroId && item.countersHeroId.includes(selectedHero.id)) {
        return true
      }
      // General item counters based on hero properties
      if (['Phantom Assassin', 'Windranger'].includes(selectedHero.localized_name) && item.localized_name === 'Monkey King Bar') return true
      if (['Bristleback', 'Spectre', 'Timbersaw'].includes(selectedHero.localized_name) && item.localized_name === 'Silver Edge') return true
      if (['Necrophos', 'Alchemist', 'Huskar', 'Morphling', 'Pudge'].includes(selectedHero.localized_name) && (item.localized_name === 'Spirit Vessel' || item.localized_name === 'Eye of Skadi')) return true
      return false
    })
  }, [selectedHero])

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Selector */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/60 border border-[#2b3a50] shadow-xl relative shrink-0">
            <img src={selectedHero.img} alt={selectedHero.localized_name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{selectedHero.localized_name}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#182130] border border-[#29384e] text-slate-300">
                {selectedHero.primary_attr.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {selectedHero.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-lg shadow-red-950/50 transition flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" /> Выбрать другого героя
        </button>
      </div>

      {/* Grid of Worst and Best Matchups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WORST MATCHUPS (COUNTERS AGAINST THIS HERO) */}
        <div className="rounded-2xl bg-[#10141f] border border-red-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1f2838]">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-sm text-slate-100">
              Кто контрит {selectedHero.localized_name} (Худшие матчапы)
            </h2>
          </div>

          <div className="space-y-3">
            {worstMatchups.map((entry, idx) => (
              <div
                key={entry.enemy.id}
                className="p-3 rounded-xl bg-[#151b27] border border-[#222c3d] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={entry.enemy.img}
                    alt={entry.enemy.localized_name}
                    className="w-14 h-8 object-cover rounded bg-black/50 shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-100">
                      {entry.enemy.localized_name}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {entry.reason}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-extrabold text-xs text-red-400">
                    -{entry.advantage.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-slate-500">Недостаток</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BEST MATCHUPS (WHO THIS HERO COUNTERS) */}
        <div className="rounded-2xl bg-[#10141f] border border-emerald-900/30 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1f2838]">
            <Swords className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm text-slate-100">
              Кого контрит {selectedHero.localized_name} (Лучшие матчапы)
            </h2>
          </div>

          <div className="space-y-3">
            {bestMatchups.map((entry, idx) => (
              <div
                key={entry.target.id}
                className="p-3 rounded-xl bg-[#151b27] border border-[#222c3d] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={entry.target.img}
                    alt={entry.target.localized_name}
                    className="w-14 h-8 object-cover rounded bg-black/50 shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-100">
                      {entry.target.localized_name}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {entry.reason}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-extrabold text-xs text-emerald-400">
                    +{entry.advantage.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-slate-500">Преимущество</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Counters Section */}
      <div className="rounded-2xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1f2838]">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-sm text-slate-100">
            Предметы-контрпики против {selectedHero.localized_name}
          </h2>
        </div>

        {counterItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {counterItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#151b27] border border-[#222d3e] flex items-start gap-3"
              >
                <img src={item.img} alt={item.localized_name} className="w-10 h-10 object-contain rounded bg-black/40 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300">{item.localized_name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item.cost}g</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Против {selectedHero.localized_name} эффективны универсальные предметы контроля (Scythe of Vyse, Black King Bar, Blink Dagger).
          </p>
        )}
      </div>

      {/* Hero Picker Modal */}
      <HeroPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectHero={(h) => setSelectedHero(h)}
        title="Выберите героя для просмотра контрпиков"
      />
    </div>
  )
}
