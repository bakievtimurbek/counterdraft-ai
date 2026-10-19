'use client'

import React, { useState } from 'react'
import { DraftWeights } from '@/types/dota'
import { Sliders, RotateCcw, X, Check } from 'lucide-react'

interface WeightsConfigModalProps {
  isOpen: boolean
  onClose: () => void
  currentWeights: DraftWeights
  onSaveWeights: (weights: DraftWeights) => void
}

export default function WeightsConfigModal({
  isOpen,
  onClose,
  currentWeights,
  onSaveWeights,
}: WeightsConfigModalProps) {
  const [weights, setWeights] = useState<DraftWeights>({ ...currentWeights })

  if (!isOpen) return null

  const sum = Object.values(weights).reduce((a, b) => a + b, 0)
  const isExact100 = Math.abs(sum - 1.0) < 0.01

  const handleSliderChange = (key: keyof DraftWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.round(val) / 100,
    }))
  }

  const applyPreset = (preset: 'default' | 'ranked' | 'competitive') => {
    if (preset === 'default') {
      setWeights({ counterpick: 0.30, lane: 0.25, synergy: 0.20, execution: 0.15, scaling: 0.10 })
    } else if (preset === 'ranked') {
      setWeights({ counterpick: 0.35, lane: 0.30, synergy: 0.15, execution: 0.15, scaling: 0.05 })
    } else if (preset === 'competitive') {
      setWeights({ counterpick: 0.25, lane: 0.20, synergy: 0.30, execution: 0.10, scaling: 0.15 })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#10141f] border border-[#243144] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212b3b] flex items-center justify-between bg-[#141b29]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-slate-100 text-sm">
              Настройка весов оценки драфта (Draft Scoring)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-[#0d1017]">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Пресеты:</span>
            <button
              onClick={() => applyPreset('default')}
              className="px-2.5 py-1 rounded bg-[#161d2a] hover:bg-[#1f293b] border border-[#283549] text-xs text-slate-200"
            >
              Сбалансированный
            </button>
            <button
              onClick={() => applyPreset('ranked')}
              className="px-2.5 py-1 rounded bg-[#161d2a] hover:bg-[#1f293b] border border-[#283549] text-xs text-red-300"
            >
              Ranked Pubs
            </button>
            <button
              onClick={() => applyPreset('competitive')}
              className="px-2.5 py-1 rounded bg-[#161d2a] hover:bg-[#1f293b] border border-[#283549] text-xs text-amber-300"
            >
              Captain's Mode
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">1. Контрпик (Counterpick)</span>
                <span className="font-mono text-red-400">{Math.round(weights.counterpick * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={Math.round(weights.counterpick * 100)}
                onChange={(e) => handleSliderChange('counterpick', Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Преимущество по матчапам против вражеского состава.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">2. Матчап на линии (Laning)</span>
                <span className="font-mono text-emerald-400">{Math.round(weights.lane * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={Math.round(weights.lane * 100)}
                onChange={(e) => handleSliderChange('lane', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Успех дуэли 1v1 / 2v2 на первых 10 минутах.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">3. Синергия с союзниками (Synergy)</span>
                <span className="font-mono text-sky-400">{Math.round(weights.synergy * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={Math.round(weights.synergy * 100)}
                onChange={(e) => handleSliderChange('synergy', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Комбинации ультимейтов и совместимость темпа.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">4. Простота исполнения (Execution)</span>
                <span className="font-mono text-amber-400">{Math.round(weights.execution * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={Math.round(weights.execution * 100)}
                onChange={(e) => handleSliderChange('execution', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Штраф за избыточную сложность и микроконтроль.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">5. Лейтгейм масштабирование (Scaling)</span>
                <span className="font-mono text-purple-400">{Math.round(weights.scaling * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={Math.round(weights.scaling * 100)}
                onChange={(e) => handleSliderChange('scaling', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Сила героя в глубокой поздней стадии (35+ мин).
              </p>
            </div>
          </div>

          {/* Sum Indicator */}
          <div className="pt-2 border-t border-[#1e2634] flex items-center justify-between text-xs">
            <span className="text-slate-400">Сумма весов:</span>
            <span
              className={`font-mono font-bold ${
                isExact100 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {Math.round(sum * 100)}% {isExact100 ? '✓' : '(желательно 100%)'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#212b3b] bg-[#141b29] flex items-center justify-between">
          <button
            onClick={() => applyPreset('default')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Сбросить
          </button>
          <button
            onClick={() => {
              onSaveWeights(weights)
              onClose()
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-lg shadow-red-950/50"
          >
            <Check className="w-3.5 h-3.5" /> Сохранить веса
          </button>
        </div>
      </div>
    </div>
  )
}
