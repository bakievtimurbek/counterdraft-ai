'use client'

import React, { useState, useMemo } from 'react'
import { Hero, HeroAttribute } from '@/types/dota'
import { HEROES } from '@/data/heroes'
import { Search, X, Shield, Zap, Sparkles, Crosshair } from 'lucide-react'

interface HeroPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectHero: (hero: Hero) => void
  excludedHeroIds?: number[]
  title?: string
}

export default function HeroPickerModal({
  isOpen,
  onClose,
  onSelectHero,
  excludedHeroIds = [],
  title = 'Выберите героя для драфта',
}: HeroPickerModalProps) {
  const [search, setSearch] = useState('')
  const [attrFilter, setAttrFilter] = useState<'all' | HeroAttribute>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const excludedSet = useMemo(() => new Set(excludedHeroIds), [excludedHeroIds])

  const filteredHeroes = useMemo(() => {
    return HEROES.filter((h) => {
      if (excludedSet.has(h.id)) return false

      if (search) {
        const query = search.toLowerCase()
        const matchesName = h.localized_name.toLowerCase().includes(query)
        if (!matchesName) return false
      }

      if (attrFilter !== 'all' && h.primary_attr !== attrFilter) {
        return false
      }

      if (roleFilter !== 'all') {
        if (roleFilter === 'Carry' && (h.positions[1] || 0) < 0.6) return false
        if (roleFilter === 'Mid' && (h.positions[2] || 0) < 0.6) return false
        if (roleFilter === 'Offlane' && (h.positions[3] || 0) < 0.6) return false
        if (roleFilter === 'Support' && (h.positions[4] || 0) < 0.6 && (h.positions[5] || 0) < 0.6) return false
      }

      return true
    })
  }, [search, attrFilter, roleFilter, excludedSet])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#10141f] border border-[#243144] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#212b3b] flex items-center justify-between bg-[#141b29]">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h3>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredHeroes.length} доступно)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#20293a] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#1b2333] bg-[#0c0f17] flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по имени героя (e.g. Invoker, Pudge, Axe)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#141a26] border border-[#232e3f] rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
              autoFocus
            />
          </div>

          {/* Primary Attribute Filters */}
          <div className="flex items-center gap-1 bg-[#141a26] p-1 rounded-md border border-[#232e3f]">
            <button
              onClick={() => setAttrFilter('all')}
              className={`px-2 py-1 rounded text-xs transition ${
                attrFilter === 'all' ? 'bg-[#222d40] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setAttrFilter('str')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                attrFilter === 'str' ? 'bg-red-950 text-red-300 font-medium border border-red-700/50' : 'text-red-400 hover:bg-red-950/40'
              }`}
              title="Strength"
            >
              <Shield className="w-3 h-3" /> STR
            </button>
            <button
              onClick={() => setAttrFilter('agi')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                attrFilter === 'agi' ? 'bg-emerald-950 text-emerald-300 font-medium border border-emerald-700/50' : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
              title="Agility"
            >
              <Zap className="w-3 h-3" /> AGI
            </button>
            <button
              onClick={() => setAttrFilter('int')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                attrFilter === 'int' ? 'bg-sky-950 text-sky-300 font-medium border border-sky-700/50' : 'text-sky-400 hover:bg-sky-950/40'
              }`}
              title="Intelligence"
            >
              <Sparkles className="w-3 h-3" /> INT
            </button>
            <button
              onClick={() => setAttrFilter('all')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                attrFilter === ('all' as any) && false ? 'bg-purple-950 text-purple-300' : 'text-purple-400 hover:bg-purple-950/40'
              }`}
              title="Universal"
            >
              UNI
            </button>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-[#141a26] p-1 rounded-md border border-[#232e3f]">
            {['all', 'Carry', 'Mid', 'Offlane', 'Support'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2 py-1 rounded text-xs transition ${
                  roleFilter === role ? 'bg-red-700/30 text-red-300 border border-red-600/40 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Любая роль' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {filteredHeroes.map((hero) => {
            const attrColor =
              hero.primary_attr === 'str'
                ? 'border-red-600/30 hover:border-red-500'
                : hero.primary_attr === 'agi'
                ? 'border-emerald-600/30 hover:border-emerald-500'
                : hero.primary_attr === 'int'
                ? 'border-sky-600/30 hover:border-sky-500'
                : 'border-purple-600/30 hover:border-purple-500'

            return (
              <button
                key={hero.id}
                onClick={() => {
                  onSelectHero(hero)
                  onClose()
                }}
                className={`group relative flex flex-col items-center bg-[#141a25] hover:bg-[#1c2433] rounded-lg border ${attrColor} p-1.5 transition-all duration-150 hover:scale-[1.03] hover:shadow-lg`}
              >
                <div className="w-full aspect-[16/9] rounded overflow-hidden bg-black/50 relative">
                  <img
                    src={hero.img}
                    alt={hero.localized_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      // Fallback placeholder if CDN is blocked
                      ;(e.target as any).src = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png'
                    }}
                  />
                  <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/80 font-mono text-[9px] text-slate-300">
                    {hero.pub_win_rate}%
                  </div>
                </div>
                <span className="mt-1 text-[11px] font-medium text-slate-200 truncate w-full text-center group-hover:text-red-400 transition-colors">
                  {hero.localized_name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
