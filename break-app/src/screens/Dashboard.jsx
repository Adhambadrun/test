import { useState } from 'react'
import { useApp } from '../store'
import Header from '../components/Header'
import Ticker from '../components/Ticker'
import Pod from '../components/Pod'
import SidePanel from '../components/SidePanel'
import GlassPanel from '../components/GlassPanel'
import { TEAMS } from '../data/seed'
import { shiftPhase, fmtMinutes, inRestrictedHour } from '../lib/time'

function WeatherChip() {
  return (
    <div className="glass-ultrathin !rounded-2xl px-4 py-2.5 flex items-center gap-3">
      <span className="text-2xl">🌙</span>
      <div>
        <div className="font-orbitron text-lg font-bold text-zinc-100 leading-none">24°C</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Cairo · Clear night</div>
      </div>
      <div className="text-[10px] text-zinc-500 italic max-w-[140px] leading-tight">Outfit: hoodie. It is Cairo at 1 AM. You know.</div>
    </div>
  )
}

function ShiftBanner() {
  const app = useApp()
  const phase = shiftPhase(new Date())
  if (phase.phase === 'active') {
    return (
      <GlassPanel material="thin" className="px-5 py-3 flex items-center gap-4">
        <span className="w-2.5 h-2.5 rounded-full bg-success anim-dot-breathe" />
        <div className="font-orbitron text-[12px] font-bold text-zinc-100 tracking-widest">SHIFT ACTIVE</div>
        <div className="text-[12px] text-zinc-400">{fmtMinutes(phase.endsInMin * 60)} remaining — restricted hours {inRestrictedHour() ? 'NOW (regular breaks locked)' : '11 PM–5 AM window open'} · WC always available</div>
        <div className="ml-auto hidden md:block font-mono text-[11px] text-zinc-500">shift 22:00 → 06:00 · Africa/Cairo</div>
      </GlassPanel>
    )
  }
  return (
    <GlassPanel material="thin" className="px-5 py-3 flex items-center gap-4">
      <span className="w-2.5 h-2.5 rounded-full bg-gold anim-pulse-glow" />
      <div className="font-orbitron text-[12px] font-bold text-gold tracking-widest">SHIFT STARTS IN {fmtMinutes(phase.startsInMin * 60)}</div>
      <div className="text-[12px] text-zinc-400">Pods unlock at 10:00 PM. Go hydrate, rest, and charge up.</div>
    </GlassPanel>
  )
}

export default function Dashboard() {
  const app = useApp()
  const { session } = app
  const [selected, setSelected] = useState(null)

  const isAgent = session?.role === 'agent'
  const team = isAgent
    ? (app.teamBySupervisor(session.email) || TEAMS.find((t) => t.teamId === session.teamId))
    : TEAMS.find((t) => t.teamId === app.selectedTeamId)

  const agents = app.teamAgents(team?.teamId)
  const onbreakCount = agents.filter((a) => a.status === 'onbreak').length
  const me = isAgent ? app.agentByEmail(session.email) : null
  const canAdmin = !isAgent

  return (
    <div className="min-h-screen">
      <Header />
      <Ticker />
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16 pt-4">
        <ShiftBanner />
        <div className="flex flex-wrap items-center gap-3 mt-4 mb-2">
          <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2">{team?.teamName} — FLOOR</h1>
          <span className="text-[11px] font-orbitron uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ color: '#00E5FF', border: '1px solid rgba(0,229,255,0.4)', background: 'rgba(0,229,255,0.08)' }}>
            {onbreakCount}/{app.config.breakCapacity} on break
          </span>
          {canAdmin && (
            <span className="text-[11px] font-orbitron uppercase tracking-widest px-2.5 py-1 rounded-full text-gold border border-gold/40 bg-gold/10">
              SUPERVISOR MODE — click any pod for controls
            </span>
          )}
          <div className="ml-auto hidden sm:block"><WeatherChip /></div>
        </div>

        {isAgent && me && (
          <GlassPanel material="thin" className="mb-4 px-5 py-3 flex flex-wrap items-center gap-4">
            <div className="font-teko text-3xl font-semibold text-gold leading-none">{me.goalProgress}%</div>
            <div className="flex-1 min-w-[180px]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Tonight's Goal</div>
              <div className="h-[6px] rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${me.goalProgress}%`, background: 'linear-gradient(90deg,#FF003C,#FFCC00)', boxShadow: '0 0 10px rgba(255,204,0,0.5)', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
              </div>
            </div>
            <div className="text-[11.5px] text-zinc-400 hidden md:block">Hover your pod → pick a break. Hover teammates → name & status only. Privacy is sacred. 🤫</div>
          </GlassPanel>
        )}

        <div className="flex flex-wrap justify-center lg:justify-start gap-3 py-4">
          {agents.map((a, i) => (
            <Pod key={a.email} agent={a} index={i} onSelect={(ag) => setSelected(ag)} />
          ))}
        </div>
      </main>

      {selected && <SidePanel agent={app.agentByEmail(selected.email)} onClose={() => setSelected(null)} />}
    </div>
  )
}
