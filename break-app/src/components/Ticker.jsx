import { useState, useMemo } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { useApp } from '../store'
import { FUNNY_FILLERS } from '../data/seed'
import { fmtTime } from '../lib/time'

const CAT_ICON = {
  breaks: '⚡',
  warnings: '⚠️',
  bonus: '🎁',
  alerts: '🚨',
  fun: '😂',
  weather: '🌡️',
  birthday: '🎂',
  achievements: '👑',
}
const CAT_COLOR = {
  breaks: '#00E5FF', warnings: '#FFD700', bonus: '#FFCC00', alerts: '#FF003C', fun: '#ffffff', weather: '#00E5FF', birthday: '#FF006E', achievements: '#FFCC00',
}

export default function Ticker() {
  const app = useApp()
  const { headlines, newsOpen, setNewsOpen, features } = app
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const items = useMemo(() => {
    const fillers = FUNNY_FILLERS.map((f, i) => ({ id: `f${i}`, text: f, category: 'fun', priority: 'normal', time: Date.now() - i * 15000, filler: true }))
    const merged = [...headlines, ...fillers].sort((a, b) => b.time - a.time).slice(0, 40)
    // ensure an even count for the seamless loop by duplicating the list inside the marquee
    return merged
  }, [headlines])

  const marquee = useMemo(() => [...items, ...items], [items])
  const critical = headlines.some((h) => h.priority === 'critical')

  const filtered = items.filter((h) => {
    if (tab !== 'all' && h.category !== tab) return false
    if (q && !h.text.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const tabs = [
    ['all', 'All'], ['breaks', 'Breaks'], ['warnings', 'Warnings'], ['bonus', 'Bonuses'], ['fun', 'Fun'], ['alerts', 'Alerts'],
  ]

  return (
    <>
      <div className="sticky z-30 glass-thin" style={{ top: 80, height: 44, display: 'flex', alignItems: 'center', borderRadius: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        {/* Left badge */}
        <div className="relative flex items-center gap-2 px-4 h-full" style={{ background: 'linear-gradient(92deg,#FF003C,#C4002F)', clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)', width: 190 }}>
          <span className="w-2.5 h-2.5 rounded-full bg-white anim-dot-breathe" />
          <span className="font-orbitron text-[11px] font-bold text-white tracking-[0.14em] whitespace-nowrap">SNN LIVE TICKER</span>
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden relative h-full" style={{ maskImage: 'linear-gradient(90deg, transparent, black 3%, black 97%, transparent)' }}>
          <div
            className="absolute whitespace-nowrap will-change-transform"
            style={{
              animation: `marquee-scroll ${critical ? 22 : 34}s linear infinite`,
              lineHeight: '44px',
            }}
          >
            {marquee.map((h, i) => (
              <span key={`${h.id}-${i}`} className="inline-flex items-center text-[12.5px] mx-4" style={{ color: h.priority === 'urgent' ? 'rgba(255,215,0,0.95)' : h.priority === 'critical' ? '#FF5C7A' : '#c9c9cf' }}>
                <span style={{ marginRight: 7 }}>{CAT_ICON[h.category] || '💬'}</span>
                <span className="font-inter font-medium">{h.text}</span>
                <span className="text-gold mx-4 font-orbitron text-[11px]">|||</span>
              </span>
            ))}
          </div>
        </div>

        {/* VIEW ALL */}
        <button className="h-full px-5 font-orbitron text-[11px] tracking-[0.16em] text-gold hover:bg-white/5 transition-colors shrink-0 flex items-center gap-1.5" onClick={() => setNewsOpen(!newsOpen)}>
          <ExternalLink size={13} /> VIEW ALL
        </button>
      </div>

      {/* News Panel — rises from the ticker bar */}
      {newsOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 z-40 glass-thick w-[min(760px,calc(100vw-24px))] rounded-b-[24px]" style={{ top: 124, maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'news-drop 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="font-orbitron text-sm font-bold text-white tracking-tight-2">SNN NEWS PANEL</div>
              <button className="btn-glass !rounded-full px-3 py-1 text-[11px]" onClick={() => setNewsOpen(false)}>CLOSE</button>
            </div>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {tabs.map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${tab === k ? 'bg-crimson/20 text-white border border-crimson/40' : 'text-zinc-400 hover:text-white'}`}>{label}</button>
              ))}
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input className="input-glass !pl-9 !py-2" placeholder="Search headlines…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div className="overflow-y-auto px-4 pb-4 flex-1">
            {filtered.map((h) => (
              <div key={h.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                <span className="text-base mt-0.5">{CAT_ICON[h.category] || '💬'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-zinc-200 leading-snug">{h.text}</p>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">{fmtTime(new Date(h.time), 'Africa/Cairo', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                </div>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ color: CAT_COLOR[h.category], border: `1px solid ${CAT_COLOR[h.category]}44`, background: `${CAT_COLOR[h.category]}11` }}>{h.category}</span>
              </div>
            ))}
            {!filtered.length && <div className="text-center text-zinc-500 text-sm py-8">No headlines match — the night is quiet. Too quiet.</div>}
          </div>
        </div>
      )}
      <style>{`@keyframes news-drop { from { transform: translate(-50%, -12px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </>
  )
}
