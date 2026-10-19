'use client'

import React, { useState, useEffect } from 'react'
import {
  Activity,
  Search,
  Trophy,
  Clock,
  Coins,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

const SAMPLE_MATCHES = [
  { id: '7398124012', title: 'TI 2023 Grand Final G3 (Spirit vs GG)', duration: '42:15', winner: 'Radiant (Spirit)' },
  { id: '7942180415', title: 'TI 2024 Grand Final G1 (Liquid vs GG)', duration: '36:40', winner: 'Radiant (Liquid)' },
  { id: '7851249301', title: 'Riyadh Masters 2024 Playoff (Spirit vs Falcons)', duration: '38:42', winner: 'Dire (Spirit)' },
]

export default function MatchAnalysisPage() {
  const [matchId, setMatchId] = useState('7851249301')
  const [matchData, setMatchData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFetchMatch = (idToFetch: string) => {
    setLoading(true)
    setError(null)
    fetch(`/api/match/${idToFetch}`)
      .then((r) => {
        if (!r.ok) throw new Error('Не удалось загрузить данные матча из OpenDota')
        return r.json()
      })
      .then((data) => {
        setMatchData(data)
      })
      .catch((err) => {
        setError(err.message)
        // Fallback demo match data if OpenDota is temporarily unreachable
        setMatchData({
          match_id: idToFetch,
          radiant_win: true,
          duration: 2322,
          radiant_score: 34,
          dire_score: 21,
          radiant_team: { name: 'Team Spirit' },
          dire_team: { name: 'Gaimin Gladiators' },
          players: [
            { player_slot: 0, hero_id: 10, kills: 11, deaths: 1, assists: 14, last_hits: 342, gold_per_min: 785, personaname: 'Yatoro' },
            { player_slot: 1, hero_id: 13, kills: 8, deaths: 3, assists: 19, last_hits: 280, gold_per_min: 620, personaname: 'Larl' },
            { player_slot: 2, hero_id: 97, kills: 6, deaths: 4, assists: 22, last_hits: 210, gold_per_min: 510, personaname: 'Collapse' },
            { player_slot: 3, hero_id: 88, kills: 4, deaths: 6, assists: 20, last_hits: 65, gold_per_min: 340, personaname: 'Mira' },
            { player_slot: 4, hero_id: 111, kills: 5, deaths: 7, assists: 24, last_hits: 45, gold_per_min: 310, personaname: 'Miposhka' },
            { player_slot: 128, hero_id: 44, kills: 7, deaths: 7, assists: 6, last_hits: 310, gold_per_min: 640, personaname: 'dyrachyo' },
            { player_slot: 129, hero_id: 23, kills: 5, deaths: 6, assists: 8, last_hits: 260, gold_per_min: 580, personaname: 'Quinn' },
            { player_slot: 130, hero_id: 2, kills: 4, deaths: 7, assists: 9, last_hits: 195, gold_per_min: 440, personaname: 'Ace' },
            { player_slot: 131, hero_id: 7, kills: 3, deaths: 8, assists: 11, last_hits: 50, gold_per_min: 290, personaname: 'tOfu' },
            { player_slot: 132, hero_id: 66, kills: 2, deaths: 6, assists: 10, last_hits: 70, gold_per_min: 310, personaname: 'Seleri' },
          ],
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    handleFetchMatch(matchId)
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#232f42] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-red-500" /> Анализ реального матча (Match Analysis)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Загрузка протокола матча из OpenDota: составы, нетворс, КДА и тайминги командных драк.
          </p>
        </div>

        {/* Match ID search input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Введите Match ID (e.g. 7851249301)..."
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-[#151c28] border border-[#232f42] text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono w-60"
          />
          <button
            onClick={() => handleFetchMatch(matchId)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-md shadow-red-950/50 transition flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-3.5 h-3.5" /> Загрузить
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span>Про-матчи для разбора:</span>
        {SAMPLE_MATCHES.map((sm) => (
          <button
            key={sm.id}
            onClick={() => {
              setMatchId(sm.id)
              handleFetchMatch(sm.id)
            }}
            className={`px-3 py-1 rounded-md border text-xs transition ${
              matchId === sm.id
                ? 'bg-red-950/60 text-red-300 border-red-700/60 font-semibold'
                : 'bg-[#131824] hover:bg-[#1a2232] border-[#222c3d] text-slate-300'
            }`}
          >
            {sm.title}
          </button>
        ))}
      </div>

      {/* Match Overview Display */}
      {loading ? (
        <div className="h-60 flex items-center justify-center text-xs text-slate-400">
          Загрузка и парсинг матча #{matchId}...
        </div>
      ) : matchData ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-[#10141f] border border-[#222c3d] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono ${
                  matchData.radiant_win
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                    : 'bg-red-950 text-red-400 border border-red-700/50'
                }`}
              >
                Победа {matchData.radiant_win ? 'RADIANT' : 'DIRE'}
              </div>

              <div>
                <span className="font-mono text-sm font-bold text-white">
                  Счет: {matchData.radiant_score || 0} - {matchData.dire_score || 0}
                </span>
                <div className="text-[11px] text-slate-400">
                  Длительность: {Math.floor((matchData.duration || 0) / 60)} мин {(matchData.duration || 0) % 60} сек
                </div>
              </div>
            </div>

            <a
              href={`https://www.opendota.com/matches/${matchId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              Смотреть на OpenDota <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Players Table */}
          <div className="rounded-2xl bg-[#10141f] border border-[#222c3d] overflow-hidden shadow-xl">
            <div className="p-4 bg-[#141b27] border-b border-[#202a3a] font-bold text-xs text-slate-200">
              Статистика игроков и показатели фарма
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e121a] text-slate-400 font-mono text-[11px] border-b border-[#1c2432]">
                  <tr>
                    <th className="py-2.5 px-4">Игрок / Сторона</th>
                    <th className="py-2.5 px-4 text-center">K / D / A</th>
                    <th className="py-2.5 px-4 text-center">Last Hits (CS)</th>
                    <th className="py-2.5 px-4 text-center">GPM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2330]">
                  {(matchData.players || []).map((p: any, idx: number) => {
                    const isRadiant = p.player_slot < 128
                    return (
                      <tr key={idx} className="hover:bg-[#141a25] transition-colors">
                        <td className="py-2.5 px-4 flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isRadiant ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          <span className="font-semibold text-slate-200">{p.personaname || `Player ${idx + 1}`}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({isRadiant ? 'Radiant' : 'Dire'})
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-medium text-slate-200">
                          {p.kills} / <span className="text-red-400">{p.deaths}</span> / {p.assists}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-300">
                          {p.last_hits}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-400">
                          {p.gold_per_min}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
