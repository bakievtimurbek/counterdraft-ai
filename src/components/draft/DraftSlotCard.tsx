'use client'

import React from 'react'
import { Hero, Position, POSITION_NAMES, TeamSide } from '@/types/dota'
import { Plus, X, Lock, Unlock, Shuffle } from 'lucide-react'

interface DraftSlotCardProps {
  position: Position
  hero: Hero | null
  side: TeamSide
  onOpenPicker: () => void
  onClearHero: () => void
  onChangePosition: (newPos: Position) => void
  isLocked?: boolean
  onToggleLock?: () => void
}

export default function DraftSlotCard({
  position,
  hero,
  side,
  onOpenPicker,
  onClearHero,
  onChangePosition,
  isLocked = false,
  onToggleLock,
}: DraftSlotCardProps) {
  const posInfo = POSITION_NAMES[position]
  const isRadiant = side === 'radiant'

  // Check if current hero has flex capabilities
  const isFlex = hero
    ? Object.entries(hero.positions).filter(([p, v]) => Number(p) !== position && v >= 0.55).length > 0
    : false

  return (
    <div
      className={`relative flex flex-col rounded-xl border transition-all duration-200 overflow-hidden bg-[#111622] ${
        hero
          ? isRadiant
            ? 'border-emerald-600/50 shadow-md shadow-emerald-950/20'
            : 'border-red-600/50 shadow-md shadow-red-950/20'
          : 'border-[#222d3e] border-dashed hover:border-slate-500'
      }`}
    >
      {/* Position Header */}
      <div
        className={`px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wide border-b ${
          isRadiant
            ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-400'
            : 'bg-red-950/40 border-red-900/40 text-red-400'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center font-mono text-[10px]">
            {position}
          </span>
          {posInfo.en.split(' - ')[1]}
        </span>

        {hero && onToggleLock && (
          <button
            onClick={onToggleLock}
            title={isLocked ? 'Позиция зафиксирована вручную' : 'Позиция определяется автоматически'}
            className="text-slate-400 hover:text-white"
          >
            {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Hero Display or Empty Slot */}
      {hero ? (
        <div className="relative group">
          <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
            <img
              src={hero.img}
              alt={hero.localized_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Quick action overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={onOpenPicker}
              className="px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-xs text-white border border-slate-600"
            >
              Сменить
            </button>
            <button
              onClick={onClearHero}
              className="p-1 rounded bg-red-900/80 hover:bg-red-800 text-xs text-white border border-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Details */}
          <div className="p-2.5 bg-[#121824] flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-100 truncate">
                {hero.localized_name}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {hero.pub_win_rate}% WR
              </span>
            </div>

            {/* Position Selector Dropdown */}
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#1e2736]">
              <span className="text-[10px] text-slate-400">Слот:</span>
              <select
                value={position}
                onChange={(e) => onChangePosition(Number(e.target.value) as Position)}
                className="bg-[#182130] text-[11px] text-slate-200 rounded px-1.5 py-0.5 border border-[#2b394f] focus:outline-none"
              >
                <option value={1}>Pos 1 (Carry)</option>
                <option value={2}>Pos 2 (Mid)</option>
                <option value={3}>Pos 3 (Offlane)</option>
                <option value={4}>Pos 4 (Soft)</option>
                <option value={5}>Pos 5 (Hard)</option>
              </select>
            </div>

            {/* Flex indicator badge */}
            {isFlex && (
              <div className="flex items-center gap-1 text-[10px] text-amber-300/90 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-800/40 mt-1">
                <Shuffle className="w-3 h-3 text-amber-400" />
                <span>Flex-пик доступен</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onOpenPicker}
          className="h-32 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:bg-[#151c2a] transition group"
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-slate-600 group-hover:border-slate-400 flex items-center justify-center transition">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs">Выбрать героя</span>
        </button>
      )}
    </div>
  )
}
