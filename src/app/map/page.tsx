'use client'

import React, { useState, useMemo } from 'react'
import { TimeBracket, MapLayer, TeamSide } from '@/types/dota'
import { MAP_METADATA, getFilteredMapPoints } from '@/data/map-data'
import {
  MapPin,
  Clock,
  Layers,
  Eye,
  Shield,
  Activity,
  Skull,
  Coins,
  Footprints,
  Info,
  CheckCircle2,
} from 'lucide-react'

export default function MapAnalyticsPage() {
  const [timeBracket, setTimeBracket] = useState<TimeBracket>('0-10')
  const [activeLayer, setActiveLayer] = useState<MapLayer>('movement')
  const [sideFilter, setSideFilter] = useState<'all' | TeamSide>('all')

  const points = useMemo(() => {
    return getFilteredMapPoints(
      timeBracket,
      activeLayer,
      sideFilter === 'all' ? undefined : sideFilter
    )
  }, [timeBracket, activeLayer, sideFilter])

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-sky-400" /> Анализ карты и тепловые схемы (Map Analytics)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Исследуйте реальные координаты перемещений, лесных маршрутов, вардинга и массовых сражений по таймингам матча.
          </p>
        </div>

        {/* Real data badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#162130] border border-[#26374f] text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-left">
            <div className="font-semibold text-slate-200">
              {MAP_METADATA.tournament}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Match #{MAP_METADATA.matchId} • {MAP_METADATA.patch}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bars: Time Brackets + Layers + Sides */}
      <div className="p-4 rounded-xl bg-[#10141f] border border-[#222c3d] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Time Bracket Selector */}
        <div className="flex items-center gap-1.5 bg-[#141b27] p-1 rounded-lg border border-[#20293b]">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Минуты:
          </span>
          {(['0-10', '10-20', '20-30', '30+'] as TimeBracket[]).map((tb) => (
            <button
              key={tb}
              onClick={() => setTimeBracket(tb)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition ${
                timeBracket === tb
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tb} мин
            </button>
          ))}
        </div>

        {/* Layers Selector */}
        <div className="flex items-center gap-1.5 bg-[#141b27] p-1 rounded-lg border border-[#20293b] flex-wrap">
          {[
            { id: 'movement', label: 'Перемещения', icon: Footprints, color: 'text-sky-400' },
            { id: 'farm', label: 'Фарм', icon: Coins, color: 'text-amber-400' },
            { id: 'teamfights', label: 'Сражения', icon: Activity, color: 'text-rose-400' },
            { id: 'deaths', label: 'Смерти', icon: Skull, color: 'text-red-400' },
            { id: 'wards', label: 'Варды (Обзор)', icon: Eye, color: 'text-emerald-400' },
          ].map((layer) => {
            const Icon = layer.icon
            const isActive = activeLayer === layer.id
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#222e42] text-white border border-[#334460]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                <span>{layer.label}</span>
              </button>
            )
          })}
        </div>

        {/* Side Filter */}
        <div className="flex items-center gap-1.5 bg-[#141b27] p-1 rounded-lg border border-[#20293b]">
          <button
            onClick={() => setSideFilter('all')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              sideFilter === 'all' ? 'bg-[#222e42] text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Обе команды
          </button>
          <button
            onClick={() => setSideFilter('radiant')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              sideFilter === 'radiant' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'text-emerald-400 hover:bg-emerald-950/30'
            }`}
          >
            Radiant
          </button>
          <button
            onClick={() => setSideFilter('dire')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              sideFilter === 'dire' ? 'bg-red-950 text-red-300 border border-red-700/50' : 'text-red-400 hover:bg-red-950/30'
            }`}
          >
            Dire
          </button>
        </div>
      </div>

      {/* Main Map Canvas / SVG Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0a0d14] border border-[#222c3e] p-4 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-[650px] aspect-square rounded-xl bg-[#0e121b] border border-[#1e2637] relative overflow-hidden shadow-inner select-none">
            {/* Dota 2 stylized map schematic */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* River diagonal ribbon */}
              <path
                d="M 12 100 L 100 12"
                stroke="#1e3a5f"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 15 100 L 100 15"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />

              {/* Lanes */}
              {/* Mid Lane */}
              <line x1="20" y1="80" x2="80" y2="20" stroke="#253246" strokeWidth="2.5" strokeDasharray="1 1" />
              {/* Safe Lane Radiant / Offlane Dire (Bottom-Right path) */}
              <path d="M 20 85 L 85 85 L 85 20" stroke="#253246" strokeWidth="2" fill="none" />
              {/* Offlane Radiant / Safe Lane Dire (Top-Left path) */}
              <path d="M 15 80 L 15 15 L 80 15" stroke="#253246" strokeWidth="2" fill="none" />

              {/* Radiant Base Area */}
              <circle cx="18" cy="82" r="10" fill="#064e3b" opacity="0.3" />
              <text x="14" y="84" fill="#34d399" fontSize="3" fontWeight="bold">RADIANT</text>

              {/* Dire Base Area */}
              <circle cx="82" cy="18" r="10" fill="#7f1d1d" opacity="0.3" />
              <text x="78" y="20" fill="#f87171" fontSize="3" fontWeight="bold">DIRE</text>

              {/* Roshan Pits (Top & Bottom) */}
              <circle cx="19" cy="17" r="3.5" fill="#451a03" stroke="#f59e0b" strokeWidth="0.5" opacity="0.8" />
              <text x="16.5" y="18" fill="#fbbf24" fontSize="2.2" fontWeight="bold">ROSH</text>

              <circle cx="81" cy="83" r="3.5" fill="#451a03" stroke="#f59e0b" strokeWidth="0.5" opacity="0.8" />
              <text x="78.5" y="84" fill="#fbbf24" fontSize="2.2" fontWeight="bold">ROSH</text>

              {/* Tormentors */}
              <circle cx="22" cy="80" r="2.5" fill="#581c87" stroke="#c084fc" strokeWidth="0.5" opacity="0.7" />
              <circle cx="78" cy="20" r="2.5" fill="#581c87" stroke="#c084fc" strokeWidth="0.5" opacity="0.7" />

              {/* Plot Heatmap Points */}
              {points.map((p, idx) => {
                let color = '#38bdf8'
                let radius = 2.5
                if (p.type === 'farm') {
                  color = '#f59e0b'
                  radius = 3.0
                } else if (p.type === 'teamfight') {
                  color = '#f43f5e'
                  radius = 4.5
                } else if (p.type === 'death') {
                  color = '#ef4444'
                  radius = 2.8
                } else if (p.type === 'ward') {
                  color = p.isSentry ? '#3b82f6' : '#eab308'
                  radius = 2.8
                }

                return (
                  <g key={idx} className="cursor-pointer transition-all hover:scale-125">
                    {/* Glow circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={radius * 1.8}
                      fill={color}
                      opacity={0.25}
                      className="animate-pulse"
                    />
                    {/* Main point */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={radius}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="0.4"
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Legend & Tactical Insights */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" /> Справка и легенда карты
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0"></span>
                <span>Перемещения героев и ротации по реке</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                <span>Фарм нейтральных кемпов и стаков треугольника</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
                <span>Эпицентры тимфайтов и штурма вышек</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
                <span>Смерти (зоны наибольшего риска смок-атак)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></span>
                <span>Observer Wards (точки обзора на скалах и рунах)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
                <span>Sentry Wards (блокировка лагерей и девардинг)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-100">
              Выводы по отрезку {timeBracket} мин
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {timeBracket === '0-10' &&
                'Стадия лайнинга: основные скопления сосредоточены вдоль тир-1 вышек. Критические зоны смертей — речные руны на 4:00 и 6:00 минутах. Варды на возвышенностях мида дают раннее предупреждение о выходе саппорта.'}
              {timeBracket === '10-20' &&
                'Переход в мидгейм: керри смещаются в треугольник для зачистки стаков древних крипов. Ключевые столкновения происходят за контроль центральной вышки и спавн Терзантов на 20-й минуте.'}
              {timeBracket === '20-30' &&
                'Борьба за Рошана: день — верхнее логово Рошана, ночь — нижнее. Активная установка агрессивных вардов во вражеском лесу перед заходом на возвышенность.'}
              {timeBracket === '30+' &&
                'Осада базы (Highground Breach): боевые действия смещаются к тир-3 башням и казармам. Ошибки позиционирования здесь стоят байбеков и решают исход игры.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
