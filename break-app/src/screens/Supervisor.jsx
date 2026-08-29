import { useState } from 'react'
import { Users, Clock, AlertTriangle, HeartPulse, NotebookPen } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import Ticker from '../components/Ticker'
import Pod from '../components/Pod'
import SidePanel from '../components/SidePanel'
import GlassPanel from '../components/GlassPanel'
import Avatar from '../components/Avatar'
import { TEAMS } from '../data/seed'
import { fmtDuration, fmtMinutes } from '../lib/time'

const statCard = (icon, label, value, sub, color, glow) => (
  <GlassPanel material="regular" glow={glow} key={label} className="p-4 flex items-center gap-3.5">
    <div className="rounded-2xl p-2.5" style={{ background: `${color}14`, border: `1px solid ${color}33` }}>
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="font-teko text-[32px] font-semibold leading-none" style={{ color, textShadow: `0 0 14px ${color}55` }}>{value}</div>
      <div className="text-[10.5px] text-zinc-500 truncate">{sub}</div>
    </div>
  </GlassPanel>
)

export default function Supervisor() {
  const app = useApp()
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(app.handover)

  const team = app.session.role === 'supervisor'
    ? app.teamBySupervisor(app.session.email)
    : TEAMS.find((t) => t.teamId === app.selectedTeamId)
  const agents = app.teamAgents(team?.teamId)
  const onbreak = agents.filter((a) => a.status === 'onbreak')
  const total = app.teamBreakTime(team?.teamId)
  const warningsToday = agents.reduce((s, a) => s + a.warnings.length, 0)
  const wellness = Math.max(58, 92 - onbreak.length * 6 - warningsToday * 4)

  return (
    <div className="min-h-screen">
      <Header />
      <Ticker />
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16 pt-5">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2">{team?.teamName} · SUPERVISOR DASHBOARD</h1>
          <span className="text-[11px] font-orbitron uppercase tracking-widest px-2.5 py-1 rounded-full text-cyan border border-cyan/40 bg-cyan/10">Team-only · isolated 🔒</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
          {statCard(<Users size={20} color="#00E5FF" />, 'Capacity', `${onbreak.length}/${app.config.breakCapacity}`, 'agents on break', '#00E5FF', 'cyan')}
          {statCard(<Clock size={20} color="#FFCC00" />, 'Total Break Time', fmtMinutes(total * 60), `of ${app.config.maxTotalBreakTime}m budget`, '#FFCC00', 'gold')}
          {statCard(<AlertTriangle size={20} color="#FFD700" />, 'Warnings Today', warningsToday, `${agents.filter((a) => a.warnings.some((w) => w.level >= 2)).length} active L2+`, '#FFD700', 'yellow')}
          {statCard(<HeartPulse size={20} color="#00FF88" />, 'Team Wellness', `${wellness}/100`, wellness > 80 ? 'healthy — good pace' : 'watch the load', '#00FF88', 'green')}
          {statCard(<Clock size={20} color="#3A86FF" />, 'Late Arrivals', `${agents.filter((a) => a.lateToday).length}`, '15-min grace window', '#3A86FF', 'white')}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          {/* Pod grid */}
          <div>
            <GlassPanel material="thin" className="px-5 py-3 mb-3 flex items-center gap-3">
              <span className="text-lg">💡</span>
              <span className="text-[12.5px] text-zinc-400">Hover any pod for the admin radial menu — force end, block, bonus, warnings, and more.</span>
            </GlassPanel>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 py-4 glass !rounded-3xl" style={{ background: 'rgba(8,8,10,0.35)' }}>
              {agents.map((a, i) => <Pod key={a.email} agent={a} index={i} onSelect={(ag) => setSelected(ag)} />)}
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-cyan mb-3">LIVE ON BREAK</div>
              {onbreak.length === 0 && <div className="text-[12px] text-zinc-500 py-3 text-center">No one on break — suspiciously productive.</div>}
              {onbreak.map((a) => (
                <button key={a.email} className="w-full flex items-center gap-3 py-2 rounded-xl hover:bg-white/5 px-1 transition-colors" onClick={() => setSelected(a)}>
                  <Avatar src={a.avatar} name={a.name} size={34} status="onbreak" />
                  <div className="flex-1 text-left">
                    <div className="text-[12.5px] font-medium text-zinc-200 leading-tight">{a.name}</div>
                    <div className="text-[10px] text-zinc-500">{a.breakType} · slot {a.breakSlot}</div>
                  </div>
                  <span className="font-orbitron text-[12px] text-cyan">{fmtDuration((Date.now() - a.breakStartedAt) / 1000)}</span>
                </button>
              ))}
            </GlassPanel>

            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">📋 SHIFT HANDOVER</div>
              {editing ? (
                <>
                  <textarea className="input-glass resize-none mb-2" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
                  <div className="flex gap-2">
                    <button className="btn-glass btn-cyan flex-1 py-1.5 rounded-xl text-[11.5px]" onClick={() => { app.setHandover(draft); setEditing(false); app.pushToast('Handover notes saved ✅', 'success') }}>Save</button>
                    <button className="btn-glass flex-1 py-1.5 rounded-xl text-[11.5px]" onClick={() => { setDraft(app.handover); setEditing(false) }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-zinc-300 leading-relaxed mb-2">{app.handover}</p>
                  <button className="text-[11px] text-gold flex items-center gap-1" onClick={() => { setEditing(true); setDraft(app.handover) }}>
                    <NotebookPen size={12} /> Edit for next supervisor
                  </button>
                </>
              )}
            </GlassPanel>

            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-warnL1 mb-3">LATE / EARLY TRACKER</div>
              {agents.filter((a) => a.lateToday).length === 0 && <div className="text-[12px] text-zinc-500">No late arrivals tonight. The discipline is real. 🫡</div>}
              {agents.filter((a) => a.lateToday).map((a) => (
                <div key={a.email} className="flex items-center gap-2 py-1.5 text-[12px]">
                  <span className="text-warnL2">🟡</span>
                  <span className="text-zinc-300">{a.name}</span>
                  <span className="text-zinc-600 ml-auto font-mono text-[10px]">+{8 + (a.email.length % 9)}m · 10:{18 + (a.email.length % 20)} PM</span>
                </div>
              ))}
              <div className="text-[10px] text-zinc-600 mt-2 border-t border-white/5 pt-2">Grace: 15 min after 10:15 PM. Tracked in monthly reports.</div>
            </GlassPanel>
          </div>
        </div>
      </main>

      {selected && <SidePanel agent={app.agentByEmail(selected.email)} onClose={() => setSelected(null)} />}
    </div>
  )
}
