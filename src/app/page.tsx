'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Swords,
  ShieldAlert,
  Flame,
  Layers,
  MapPin,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shuffle,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { HEROES } from '@/data/heroes'
import { PRO_PLAYERS } from '@/data/pro-coach'

export default function DashboardPage() {
  const [topWinrateHeroes, setTopWinrateHeroes] = useState<any[]>([])
  const [trendingFlexHeroes, setTrendingFlexHeroes] = useState<any[]>([])

  useEffect(() => {
    // Sort heroes by pub winrate
    const sorted = [...HEROES].sort((a, b) => b.pub_win_rate - a.pub_win_rate)
    setTopWinrateHeroes(sorted.slice(0, 5))

    // Select prominent flex heroes
    const flex = HEROES.filter((h) => {
      const viable = Object.values(h.positions).filter((v) => v >= 0.65)
      return viable.length >= 2
    }).slice(0, 4)
    setTrendingFlexHeroes(flex)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#141a27] via-[#161f30] to-[#121622] border border-[#233146] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/50 text-red-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Интеллектуальная система драфтов Dota 2</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Побеждайте в матчах еще на стадии{' '}
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              драфта и расстановки линий
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            CounterDraft AI объединяет статистику OpenDota, гибкую математическую модель позиций 1–5,
            тепловые карты перемещений и рекомендации профессиональных тренеров.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/draft"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-medium text-sm shadow-lg shadow-red-950/60 transition"
            >
              <Swords className="w-4 h-4" /> Начать анализ драфта
            </Link>
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2332] hover:bg-[#222d40] border border-[#2e3e56] text-amber-300 font-medium text-sm transition"
            >
              <Trophy className="w-4 h-4" /> Personal Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/draft"
          className="group p-5 rounded-xl bg-[#111622] hover:bg-[#161d2d] border border-[#212c3e] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center mb-3 text-red-400 group-hover:scale-110 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-red-400 transition-colors">
            Draft Analyzer
          </h3>
          <p className="text-xs text-slate-400">
            Сетка 5v5, Smart Mode распределения позиций, 5-факторная оценка и Captain's Mode.
          </p>
        </Link>

        <Link
          href="/lanes"
          className="group p-5 rounded-xl bg-[#111622] hover:bg-[#161d2d] border border-[#212c3e] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-emerald-400 transition-colors">
            Lane Matchups
          </h3>
          <p className="text-xs text-slate-400">
            Динамическая оценка Safe, Mid и Offlane. Закуп на старте и расчет килл-потенциала.
          </p>
        </Link>

        <Link
          href="/map"
          className="group p-5 rounded-xl bg-[#111622] hover:bg-[#161d2d] border border-[#212c3e] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center mb-3 text-sky-400 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-sky-400 transition-colors">
            Map Analytics
          </h3>
          <p className="text-xs text-slate-400">
            Тепловые карты перемещений, фарма, файтов и расстановки вардов по таймингам.
          </p>
        </Link>

        <Link
          href="/coach"
          className="group p-5 rounded-xl bg-[#111622] hover:bg-[#161d2d] border border-[#212c3e] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-amber-400 transition-colors">
            Personal Coach
          </h3>
          <p className="text-xs text-slate-400">
            7 ключевых навыков, разборы про-игроков (Yatoro, Nisha, Collapse) и недельный план.
          </p>
        </Link>
      </div>

      {/* Meta Grid: Top Winrates + Trending Flex Picks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Winrate Heroes */}
        <div className="rounded-xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2838]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="font-semibold text-sm text-slate-100">
                Лидеры винрейта в текущем патче
              </h2>
            </div>
            <Link href="/heroes" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              Все герои <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topWinrateHeroes.map((hero, idx) => (
              <div
                key={hero.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[#151b27] border border-[#20293a] hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500 w-4">
                    #{idx + 1}
                  </span>
                  <img
                    src={hero.img}
                    alt={hero.localized_name}
                    className="w-12 h-7 object-cover rounded bg-black/50"
                  />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">
                      {hero.localized_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {hero.attack_type} • {hero.primary_attr.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-emerald-400">
                    {hero.pub_win_rate}%
                  </div>
                  <div className="text-[10px] text-slate-500">Public Winrate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Flex Picks */}
        <div className="rounded-xl bg-[#10141f] border border-[#222c3d] p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2838]">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold text-sm text-slate-100">
                Популярные Flex-пики (Мультипозиционность)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Smart Mode</span>
          </div>

          <div className="space-y-3">
            {trendingFlexHeroes.map((hero) => (
              <div
                key={hero.id}
                className="p-2.5 rounded-lg bg-[#151b27] border border-[#20293a] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={hero.img}
                      alt={hero.localized_name}
                      className="w-10 h-6 object-cover rounded bg-black/50"
                    />
                    <span className="font-semibold text-xs text-slate-200">
                      {hero.localized_name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300/90">
                    Гибкий выбор
                  </span>
                </div>

                {/* Role viability bars */}
                <div className="grid grid-cols-5 gap-1 pt-1 border-t border-[#1e2636]">
                  {[1, 2, 3, 4, 5].map((pos) => {
                    const val = Math.round((hero.positions[pos] || 0) * 100)
                    const isViable = val >= 60
                    return (
                      <div key={pos} className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 font-mono">
                          P{pos}
                        </span>
                        <div className="w-full h-1.5 bg-[#202a3a] rounded-full overflow-hidden mt-0.5">
                          <div
                            className={`h-full ${
                              isViable ? 'bg-amber-400' : 'bg-slate-600'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                          {val}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Tip of the Day */}
      <div className="rounded-xl bg-gradient-to-r from-amber-950/20 via-[#141b27] to-[#121722] border border-amber-800/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Совет дня от тренера: Yatoro (Team Spirit)
          </div>
          <p className="text-xs text-slate-300">
            "{PRO_PLAYERS[0].coachingPhilosophy}"
          </p>
        </div>
        <Link
          href="/coach"
          className="shrink-0 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition"
        >
          Перейти в Personal Coach →
        </Link>
      </div>
    </div>
  )
}
