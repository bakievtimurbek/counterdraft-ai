import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'CounterDraft AI — Аналитический помощник по драфтам Dota 2',
  description: 'Профессиональная платформа драфтов, умного распределения позиций 1-5, анализа линий, контрпиков и персонального коучинга Dota 2.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-[#0a0c12] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-red-900/60 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-[#1e2633] bg-[#0d1017] py-6 text-center text-xs text-slate-500">
          <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <span className="font-semibold text-slate-300">CounterDraft AI</span> — Интеллектуальная аналитика Dota 2
            </div>
            <div>
              Данные предоставлены OpenDota API & Valve Dota 2 CDN • Патч 7.37e
            </div>
            <div className="text-slate-400">
              Разработано для соревновательных и рейтинговых драфтов
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
