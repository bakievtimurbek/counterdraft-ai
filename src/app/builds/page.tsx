'use client'

import React, { useState, useMemo } from 'react'
import { Hero, Position } from '@/types/dota'
import { HEROES } from '@/data/heroes'
import { generateHeroBuild } from '@/lib/builds/build-generator'
import HeroPickerModal from '@/components/draft/HeroPickerModal'
import { Flame, Search, Plus, X, Sparkles, Shield, Coins, Clock } from 'lucide-react'

export default function BuildsPage() {
  const [selectedHero, setSelectedHero] = useState<Hero>(
    HEROES.find((h) => h.localized_name === 'Phantom Assassin') || HEROES[0]
  )
  const [position, setPosition] = useState<Position>(1)
  const [enemyTeam, setEnemyTeam] = useState<Hero[]>([
    HEROES.find((h) => h.localized_name === 'Bristleback') || HEROES[1],
    HEROES.find((h) => h.localized_name === 'Necrophos') || HEROES[2],
  ])

  const [pickerOpen, setPickerOpen] = useState(false)
  const [enemyPickerOpen, setEnemyPickerOpen] = useState(false)

  // Generate dynamic build
  const build = useMemo(() => {
    return generateHeroBuild(selectedHero, position, enemyTeam)
  }, [selectedHero, position, enemyTeam])

  return (
    <div className="space-y-6">
      {/* Top Banner & Hero Selector */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/60 border border-[#2b3a50] shadow-xl relative shrink-0">
            <img src={selectedHero.img} alt={selectedHero.localized_name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{selectedHero.localized_name}</h1>
              {/* Position selector */}
              <select
                value={position}
                onChange={(e) => setPosition(Number(e.target.value) as Position)}
                className="px-2.5 py-1 rounded bg-[#17202e] border border-[#2a394e] text-xs font-semibold text-amber-300 focus:outline-none"
              >
                <option value={1}>Позиция 1 (Carry)</option>
                <option value={2}>Позиция 2 (Mid)</option>
                <option value={3}>Позиция 3 (Offlane)</option>
                <option value={4}>Позиция 4 (Soft Support)</option>
                <option value={5}>Позиция 5 (Hard Support)</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {build.itemizationRationale}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-lg shadow-red-950/50 transition flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" /> Сменить героя
        </button>
      </div>

      {/* Enemy Team Context Filter */}
      <div className="p-4 rounded-xl bg-[#0e131d] border border-[#1f2838] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-slate-200">
            Контекст вражеского состава (адаптирует ситуативные предметы):
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {enemyTeam.map((enemy) => (
            <div
              key={enemy.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#151c27] border border-[#243042] text-xs text-slate-200"
            >
              <img src={enemy.img} alt={enemy.localized_name} className="w-6 h-4 object-cover rounded" />
              <span>{enemy.localized_name}</span>
              <button
                onClick={() => setEnemyTeam((prev) => prev.filter((e) => e.id !== enemy.id))}
                className="text-slate-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {enemyTeam.length < 5 && (
            <button
              onClick={() => setEnemyPickerOpen(true)}
              className="px-2.5 py-1 rounded border border-dashed border-slate-600 hover:border-slate-400 text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Добавить врага
            </button>
          )}
        </div>
      </div>

      {/* Build Progression Categories */}
      <div className="space-y-6">
        {[
          { title: 'Starting Items (Стартовый закуп)', items: build.startingItems, icon: Coins },
          { title: 'Early Game (Ранняя игра 0–10 мин)', items: build.earlyGame, icon: Clock },
          { title: 'Core Items (Основные артефакты)', items: build.coreItems, icon: Flame },
          { title: 'Situational & Counter Items (Ситуативные контр-предметы)', items: build.situationalItems, icon: Sparkles },
          { title: 'Late Game (Глубокий лейт 30+ мин)', items: build.lateGame, icon: Shield },
        ].map((sec, idx) => (
          <div key={idx} className="rounded-2xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1f2838]">
              <sec.icon className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm text-slate-100">{sec.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sec.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#141b27] border border-[#222e40] hover:border-slate-500 transition space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.img}
                      alt={item.localized_name}
                      className="w-12 h-12 object-contain rounded bg-black/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-300">{item.localized_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono text-emerald-400">{item.cost} gold</span>
                        <span>•</span>
                        <span>{item.timing}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-[#0f141e] p-2 rounded border border-[#1b2331]">
                    <span className="text-amber-400 font-semibold">Зачем: </span>
                    {item.reason}
                  </p>

                  {item.alternatives.length > 0 && (
                    <div className="text-[10px] text-slate-400">
                      Альтернативы: {item.alternatives.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main hero picker */}
      <HeroPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectHero={(h) => setSelectedHero(h)}
        title="Выберите героя для генерации сборки"
      />

      {/* Enemy hero picker */}
      <HeroPickerModal
        isOpen={enemyPickerOpen}
        onClose={() => setEnemyPickerOpen(false)}
        onSelectHero={(h) => setEnemyTeam((prev) => [...prev, h])}
        excludedHeroIds={enemyTeam.map((e) => e.id)}
        title="Добавить вражеского героя для анализа контр-предметов"
      />
    </div>
  )
}
