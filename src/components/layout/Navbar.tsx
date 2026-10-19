'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Swords,
  ShieldAlert,
  Flame,
  Layers,
  MapPin,
  Users,
  Trophy,
  Activity,
  Menu,
  X,
  Sparkles,
  BarChart3,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/draft', label: 'Draft Analyzer', icon: Swords },
  { href: '/counters', label: 'Counter Picks', icon: ShieldAlert },
  { href: '/lanes', label: 'Lane Matchups', icon: Layers },
  { href: '/builds', label: 'Builds', icon: Flame },
  { href: '/map', label: 'Map Analytics', icon: MapPin },
  { href: '/heroes', label: 'Hero Database', icon: Users },
  { href: '/matches', label: 'Match Analysis', icon: Activity },
  { href: '/coach', label: 'Personal Coach', icon: Trophy, isHighlight: true },
  { href: '/data-status', label: 'Data Status', icon: Sparkles },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0d111a]/95 backdrop-blur-md border-b border-[#212b3b] shadow-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 via-rose-700 to-amber-600 p-[1px] shadow-lg shadow-red-950/40">
              <div className="w-full h-full bg-[#10141f] rounded-[7px] flex items-center justify-center group-hover:bg-[#151b29] transition">
                <Swords className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-red-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
                CounterDraft <span className="text-white text-xs px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700/50">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">
                Dota 2 Meta Intel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm'
                      : link.isHighlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#18212e]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Status pill & Mobile trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141b26] border border-[#233045] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-mono text-[11px]">Patch 7.37e</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#141b26] border border-[#233045] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#212b3b] bg-[#0d111a] px-4 pt-3 pb-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                    : 'text-slate-300 hover:bg-[#18212e] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
