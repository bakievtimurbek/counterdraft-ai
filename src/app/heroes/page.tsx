'use client'

import React, { useState, useMemo } from 'react'
import { Hero, HeroAttribute, Position } from '@/types/dota'
import { HEROES } from '@/data/heroes'
import { Search, Shield, Zap, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export default function HeroDatabasePage() {
  const [search, setSearch] = useState('')
  const [attrFilter, setAttrFilter] = useState<'all' | HeroAttribute>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'winrate' | 'pro'>('winrate')
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)

  const filteredHeroes = useMemo(() => {
    return HEROES.filter((h) => {
      if (search && !h.localized_name.toLowerCase().includes(search.toLowerCase())) return false
      if (attrFilter !== 'all' && h.primary_attr !== attrFilter) return false
      if (roleFilter !== 'all' && !(h.roles || []).includes(roleFilter as any)) return false
      return true
    }).sort((a, b) => {
      if (sortBy === 'winrate') return b.pub_win_rate - a.pub_win_rate
      if (sortBy === 'pro') return (b.pro_pick_rate || 0) - (a.pro_pick_rate || 0)
      return a.localized_name.localeCompare(b.localized_name)
    })
  }, [search, attrFilter, roleFilter, sortBy])

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">База данных героев Dota 2 (Hero Database)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Все 127 героев текущего патча: базовые характеристики, винрейты, роли и распределение по позициям 1–5.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-[#16202f] px-3 py-1.5 rounded-lg border border-[#26374f]">
          Найдено: <span className="text-white font-bold">{filteredHeroes.length}</span> героев
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#10141f] border border-[#222c3d] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск героя по имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#141b27] border border-[#20293b] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Attribute Pills */}
        <div className="flex items-center gap-1 bg-[#141b27] p-1 rounded-lg border border-[#20293b] w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setAttrFilter('all')}
            className={`px-3 py-1 rounded text-xs transition ${
              attrFilter === 'all' ? 'bg-[#222e42] text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setAttrFilter('str')}
            className={`px-3 py-1 rounded text-xs flex items-center gap-1 transition ${
              attrFilter === 'str' ? 'bg-red-950 text-red-300 font-semibold border border-red-700/50' : 'text-red-400 hover:bg-red-950/30'
            }`}
          >
            <Shield className="w-3 h-3" /> Сила
          </button>
          <button
            onClick={() => setAttrFilter('agi')}
            className={`px-3 py-1 rounded text-xs flex items-center gap-1 transition ${
              attrFilter === 'agi' ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/50' : 'text-emerald-400 hover:bg-emerald-950/30'
            }`}
          >
            <Zap className="w-3 h-3" /> Ловкость
          </button>
          <button
            onClick={() => setAttrFilter('int')}
            className={`px-3 py-1 rounded text-xs flex items-center gap-1 transition ${
              attrFilter === 'int' ? 'bg-sky-950 text-sky-300 font-semibold border border-sky-700/50' : 'text-sky-400 hover:bg-sky-950/30'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Интеллект
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 shrink-0">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141b27] border border-[#20293b] text-xs text-slate-200 focus:outline-none"
          >
            <option value="winrate">Винрейт в пабах</option>
            <option value="pro">Популярность в PRO</option>
            <option value="name">По алфавиту (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Heroes Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredHeroes.map((hero) => (
          <button
            key={hero.id}
            onClick={() => setSelectedHero(hero)}
            className="p-2 rounded-xl bg-[#111622] hover:bg-[#161d2d] border border-[#212c3e] hover:border-slate-500 transition-all text-left group flex flex-col justify-between shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/50 relative mb-2">
                <img
                  src={hero.img}
                  alt={hero.localized_name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-emerald-400 font-bold">
                  {hero.pub_win_rate}%
                </div>
              </div>

              <div className="font-bold text-xs text-slate-100 group-hover:text-red-400 transition-colors truncate">
                {hero.localized_name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {hero.attack_type} • {hero.primary_attr.toUpperCase()}
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#1d2737] flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>Сложность: {hero.complexity === 1 ? '★☆☆' : hero.complexity === 2 ? '★★☆' : '★★★'}</span>
              <span>Pro: {hero.pro_pick_rate || 0}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Hero Detail Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10141f] border border-[#243144] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedHero.img}
                  alt={selectedHero.localized_name}
                  className="w-20 h-12 object-cover rounded-lg bg-black/50 border border-[#2a394e]"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-white">{selectedHero.localized_name}</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedHero.attack_type} • {selectedHero.primary_attr.toUpperCase()} • Сложность {selectedHero.complexity}/3
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#141a26] p-3 rounded-lg border border-[#202b3c]">
              {selectedHero.description}
            </p>

            {/* Base Stats Table */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#141b27] border border-[#1f293a]">
                <div className="text-[10px] text-slate-500">HP / Мана</div>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{selectedHero.base_health} / {selectedHero.base_mana}</div>
              </div>
              <div className="p-2 rounded bg-[#141b27] border border-[#1f293a]">
                <div className="text-[10px] text-slate-500">Броня / Скорость</div>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{selectedHero.base_armor} / {selectedHero.move_speed}</div>
              </div>
              <div className="p-2 rounded bg-[#141b27] border border-[#1f293a]">
                <div className="text-[10px] text-slate-500">Урон с руки</div>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{selectedHero.base_attack_min} - {selectedHero.base_attack_max}</div>
              </div>
              <div className="p-2 rounded bg-[#141b27] border border-[#1f293a]">
                <div className="text-[10px] text-slate-500">Дальность атаки</div>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{selectedHero.attack_range}</div>
              </div>
            </div>

            {/* Positions Viability Bars */}
            <div className="space-y-1.5 pt-2 border-t border-[#1e2736]">
              <span className="text-xs font-semibold text-slate-300">Пригодность по позициям (1-5):</span>
              <div className="grid grid-cols-5 gap-2">
                {([1, 2, 3, 4, 5] as Position[]).map((pos) => {
                  const val = Math.round((selectedHero.positions[pos] || 0) * 100)
                  return (
                    <div key={pos} className="p-2 rounded bg-[#141b27] border border-[#1f293a] text-center">
                      <div className="text-[10px] text-slate-400 font-mono">Pos {pos}</div>
                      <div className="font-mono font-bold text-xs text-amber-300 mt-0.5">{val}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
