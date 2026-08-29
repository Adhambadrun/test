import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, TrendingUp, AlertTriangle, Wifi, LayoutDashboard, UserRound, Timer, ShieldAlert, FileBarChart, Zap, ScrollText, Settings as SettingsIcon } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import Ticker from '../components/Ticker'
import SidePanel from '../components/SidePanel'
import GlassPanel from '../components/GlassPanel'
import Avatar from '../components/Avatar'
import { AreaChart } from '../components/Charts'
import { TEAMS } from '../data/seed'
import { fmtMinutes } from '../lib/time'

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agents', label: 'Agents', icon: UserRound },
  { id: 'breaks', label: 'Breaks', icon: Timer },
  { id: 'warnings', label: 'Warnings', icon: ShieldAlert },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'rally', label: 'Rally Mode', icon: Zap },
  { id: 'logs', label: 'System Logs', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function Admin() {
  const app = useApp()
  const nav = useNavigate()
  const [section, setSection] = useState('overview')
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('total')
  const [sortDir, setSortDir] = useState(-1)

  const allAgents = app.agents
  const onbreakAll = allAgents.filter((a) => a.status === 'onbreak').length
  const totalAll = allAgents.reduce((s, a) => s + a.totalBreakTime, 0)
  const warningsAll = allAgents.reduce((s, a) => s + a.warnings.length, 0)
  const breaksToday = 28 + onbreakAll

  const sorted = useMemo(() => {
    const arr = [...allAgents]
    const f = (a) => sortBy === 'name' ? a.name : sortBy === 'total' ? a.totalBreakTime : sortBy === 'slots' ? a.slotsUsed : sortBy === 'warnings' ? a.warnings.length : 0
    arr.sort((a, b) => (f(a) > f(b) ? sortDir : f(b) > f(a) ? -sortDir : 0))
    return arr
  }, [allAgents, sortBy, sortDir])

  const topTakers = [...allAgents].sort((a, b) => b.totalBreakTime - a.totalBreakTime).slice(0, 10)

  const handleNav = (id) => {
    if (id === 'settings') { nav('/settings'); return }
    if (id === 'logs') { app.pushToast('System logs live in God Mode (developer only)', 'info'); return }
    if (id === 'rally') { app.pushToast('Rally Mode is developer-only — see God Mode ⚡', 'info'); return }
    setSection(id)
  }

  const stat = (icon, label, value, sub, color, glow, trend) => (
    <GlassPanel material="regular" glow={glow} key={label} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="rounded-xl p-2" style={{ background: `${color}14`, border: `1px solid ${color}33` }}>{icon}</span>
        {trend && <span className="text-[10px] font-orbitron px-1.5 py-0.5 rounded-full" style={{ color: '#00FF88', background: 'rgba(0,255,136,0.1)' }}>{trend}</span>}
      </div>
      <div className="font-teko text-[30px] font-semibold leading-none" style={{ color, textShadow: `0 0 14px ${color}44` }}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-1">{label}</div>
      <div className="text-[10.5px] text-zinc-600 mt-0.5">{sub}</div>
    </GlassPanel>
  )

  return (
    <div className="min-h-screen">
      <Header />
      <Ticker />
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pb-16 pt-5 flex gap-5">
        {/* Left nav */}
        <nav className="hidden lg:flex flex-col gap-1 w-[220px] shrink-0 sticky top-32 self-start glass-thin !rounded-2xl p-2" style={{ top: 132 }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => handleNav(n.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ease-snap ${section === n.id ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`} style={section === n.id ? { boxShadow: 'inset 0 0 0 1px rgba(0,229,255,0.2), 0 0 16px rgba(0,229,255,0.08)' } : {}}>
              <n.icon size={16} style={{ color: section === n.id ? '#00E5FF' : 'inherit' }} />
              {n.label}
            </button>
          ))}
          <div className="mt-2 p-3 rounded-xl border border-gold/20 bg-gold/5">
            <div className="text-[10px] font-orbitron text-gold tracking-widest mb-1">⚠️ PRIVACY NOTE</div>
            <div className="text-[10.5px] text-zinc-500 leading-snug">Admins see everything across teams. Agents see nothing but names & status. God Mode stays locked.</div>
          </div>
        </nav>

        {/* Main column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2">ADMIN COMMAND</h1>
            <div className="flex gap-1.5 ml-auto">
              {TEAMS.map((t) => (
                <button key={t.teamId} onClick={() => app.setSelectedTeamId(t.teamId)} className={`px-3 py-1 rounded-full text-[11px] font-orbitron tracking-wide transition-colors ${app.selectedTeamId === t.teamId ? 'bg-crimson/20 text-white border border-crimson/50' : 'text-zinc-500 border border-white/10 hover:text-white'}`}>
                  {t.teamName}
                </button>
              ))}
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
            {stat(<Users size={20} color="#00E5FF" />, 'Capacity', `${onbreakAll}/${app.config.breakCapacity}`, 'across all teams', '#00E5FF', 'cyan')}
            {stat(<Clock size={20} color="#FFCC00" />, 'Total Break Time', fmtMinutes(totalAll * 60), 'sum of all teams', '#FFCC00', 'gold')}
            {stat(<TrendingUp size={20} color="#00FF88" />, 'Breaks Today', breaksToday, 'last 24h', '#00FF88', 'green', '▲12%')}
            {stat(<AlertTriangle size={20} color="#FFD700" />, 'Warnings Today', warningsAll, `${allAgents.filter((a) => a.warnings.some((w) => w.level === 3)).length} L3 active`, '#FFD700', 'yellow', '▲50%')}
            {stat(<Wifi size={20} color="#00FF88" />, 'System Status', 'ONLINE', 'Firestore · 42ms', '#00FF88', 'green')}
          </div>

          {section === 'overview' && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4 mb-4">
                {/* Breaks over time */}
                <GlassPanel material="regular" className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold">BREAKS OVER TIME — TONIGHT</div>
                    <span className="text-[10px] text-zinc-500 font-mono">updates every minute</span>
                  </div>
                  <AreaChart data={[2, 3, 5, 4, 8, 6, 9, 12, 10, 14, 11, 13, 9, 7, 5, 4]} height={180} color="#FFCC00" />
                </GlassPanel>

                {/* Top break takers */}
                <GlassPanel material="regular" className="p-4">
                  <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">TOP BREAK TAKERS</div>
                  <div className="flex items-end justify-center gap-3 mb-4">
                    {[1, 0, 2].map((pos) => {
                      const a = topTakers[pos]
                      const h = pos === 0 ? 64 : pos === 1 ? 44 : 32
                      const c = pos === 0 ? '#FFCC00' : pos === 1 ? '#c0c0c8' : '#CD7F32'
                      return (
                        <div key={pos} className="flex flex-col items-center gap-1.5" style={{ width: 76 }}>
                          <div className="text-[9.5px] text-zinc-400 text-center leading-tight truncate w-full">{a.name}</div>
                          <div className="font-orbitron text-[12px] font-bold" style={{ color: c }}>{Math.round(a.totalBreakTime)}m</div>
                          <div className="w-full rounded-t-lg flex items-start justify-center pt-1" style={{ height: h, background: `linear-gradient(180deg, ${c}33, ${c}11)`, border: `1px solid ${c}44`, borderBottom: 'none' }}>
                            <span className="text-base">{pos === 0 ? '👑' : pos === 1 ? '🥈' : '🥉'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="space-y-1">
                    {topTakers.slice(3).map((a, i) => (
                      <div key={a.email} className="flex items-center gap-2 text-[11.5px] py-1 border-b border-white/5 last:border-0">
                        <span className="text-zinc-600 font-mono w-5">{i + 4}</span>
                        <Avatar src={a.avatar} name={a.name} size={24} />
                        <span className="text-zinc-300 flex-1 truncate">{a.name}</span>
                        <span className="font-teko text-lg text-gold leading-none">{Math.round(a.totalBreakTime)}m</span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Live agents table */}
              <GlassPanel material="regular" className="p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-orbitron text-[11px] tracking-[0.2em] text-cyan">LIVE AGENTS — ALL TEAMS</div>
                  <span className="text-[10px] text-zinc-500">click a row for the full detail panel</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[760px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 border-b border-white/10">
                        {[
                          ['name', 'Agent'], ['status', 'Status'], ['team', 'Team'], ['total', 'Total Time'], ['slots', 'Slots'], ['wc', 'WC'], ['warnings', 'Warnings'], ['bonus', 'Bonus'],
                        ].map(([k, label]) => (
                          <th key={k} className="py-2.5 pr-4 cursor-pointer select-none hover:text-white transition-colors" onClick={() => { if (sortBy === k) setSortDir((d) => -d); else { setSortBy(k); setSortDir(-1) } }}>
                            {label} {sortBy === k ? (sortDir === -1 ? '↓' : '↑') : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((a) => (
                        <tr key={a.email} className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors" onClick={() => setSelected(a)}>
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar src={a.avatar} name={a.name} size={30} status={a.status} />
                              <span className="text-[12.5px] font-medium text-zinc-200">{a.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="text-[10.5px] font-orbitron uppercase tracking-wider" style={{ color: a.status === 'onbreak' ? '#00E5FF' : a.status === 'blocked' ? '#FF003C' : '#00FF88' }}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-[11.5px] text-zinc-400">{TEAMS.find((t) => t.teamId === a.teamId)?.teamName}</td>
                          <td className="py-2.5 pr-4 font-teko text-lg text-gold leading-none">{Math.round(a.totalBreakTime)}m</td>
                          <td className="py-2.5 pr-4 text-[12px] text-zinc-300">{a.slotsUsed}/{app.config.maxSlots}</td>
                          <td className="py-2.5 pr-4 text-[12px] text-zinc-300">{a.wcTime}m</td>
                          <td className="py-2.5 pr-4">
                            {a.warnings.length > 0 ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${a.warnings.reduce((m, w) => Math.max(m, w.level), 0) === 1 ? '#FFD700' : a.warnings.reduce((m, w) => Math.max(m, w.level), 0) === 2 ? '#FF8800' : '#FF003C'}22`, color: a.warnings.reduce((m, w) => Math.max(m, w.level), 0) === 1 ? '#FFD700' : a.warnings.reduce((m, w) => Math.max(m, w.level), 0) === 2 ? '#FF8800' : '#FF003C' }}>
                                L{a.warnings.reduce((m, w) => Math.max(m, w.level), 0)}
                              </span>
                            ) : <span className="text-zinc-600">—</span>}
                          </td>
                          <td className="py-2.5 pr-4 text-[12px]">{a.bonusGranted ? <span className="text-gold">🎁</span> : <span className="text-zinc-600">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>

              {/* Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {[
                  { t: '⏰ Peak break time', d: '1:30 AM — 2:00 AM across all teams. Expect 80% capacity in that window.', c: '#00E5FF' },
                  { t: '📊 Pattern insight', d: 'Team B takes 30% more warnings than Team A. Supervisors briefed.', c: '#FFCC00' },
                  { t: '🚻 WC forecast', d: '2 agents likely to exceed 20-min WC limit before 3 AM (predictive).', c: '#FF8800' },
                ].map((k) => (
                  <GlassPanel key={k.t} material="regular" className="p-4" style={{ borderColor: `${k.c}33` }}>
                    <div className="font-orbitron text-[12px] font-bold mb-1.5" style={{ color: k.c }}>{k.t}</div>
                    <div className="text-[12px] text-zinc-400 leading-relaxed">{k.d}</div>
                  </GlassPanel>
                ))}
              </div>
            </>
          )}

          {section === 'agents' && (
            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-cyan mb-3">AGENT ROSTER — {TEAMS.length} TEAMS · {allAgents.length} AGENTS</div>
              <div className="flex flex-wrap gap-2">
                {allAgents.map((a) => (
                  <button key={a.email} className="glass !rounded-2xl px-3 py-2 flex items-center gap-2.5 hover:bg-white/5 transition-colors" onClick={() => setSelected(a)}>
                    <Avatar src={a.avatar} name={a.name} size={28} status={a.status} />
                    <div className="text-left">
                      <div className="text-[12px] font-medium text-zinc-200 leading-tight">{a.name}</div>
                      <div className="text-[9.5px] text-zinc-500">{TEAMS.find((t) => t.teamId === a.teamId)?.teamName}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-[10.5px] text-zinc-600 mt-4 border-t border-white/5 pt-3">Add / edit / bulk-import agents from the roster manager (CSV import supported in the full build).</div>
            </GlassPanel>
          )}

          {section === 'warnings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((lv) => {
                const list = allAgents.filter((a) => a.warnings.some((w) => w.level === lv))
                const c = lv === 1 ? '#FFD700' : lv === 2 ? '#FF8800' : '#FF003C'
                return (
                  <GlassPanel key={lv} material="regular" className="p-4" style={{ borderColor: `${c}44` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${c}22`, border: `1px solid ${c}55` }}>{lv === 1 ? '⚠️' : lv === 2 ? '🔶' : '🟥'}</span>
                      <div>
                        <div className="font-orbitron text-[13px] font-bold" style={{ color: c }}>LEVEL {lv}</div>
                        <div className="text-[10px] text-zinc-500">{lv === 1 ? 'Gentle Reminder' : lv === 2 ? 'Manager Alert' : 'Escalate to Admin'} · {list.length} agents</div>
                      </div>
                    </div>
                    {list.length === 0 && <div className="text-[12px] text-zinc-500">None — impressive restraint.</div>}
                    {list.map((a) => <div key={a.email} className="flex items-center justify-between py-1.5 text-[12px] border-b border-white/5 last:border-0"><span className="text-zinc-300">{a.name}</span><span className="text-zinc-600 font-mono text-[10px]">{a.warnings.filter((w) => w.level === lv).length}x</span></div>)}
                  </GlassPanel>
                )
              })}
            </div>
          )}

          {section === 'breaks' && (
            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-cyan mb-3">BREAK ENGINE — LIVE</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['Active now', `${onbreakAll}`, '#00E5FF'], ['Slots used today', `${allAgents.reduce((s, a) => s + a.slotsUsed, 0)}`, '#FFCC00'],
                  ['WC minutes', `${allAgents.reduce((s, a) => s + a.wcTime, 0)}m`, '#3A86FF'], ['Bonus breaks', `${allAgents.filter((a) => a.bonusUsed).length}`, '#00FF88'],
                ].map(([l, v, c]) => (
                  <div key={l} className="glass !rounded-2xl p-4 text-center">
                    <div className="font-teko text-4xl font-semibold leading-none" style={{ color: c, textShadow: `0 0 16px ${c}44` }}>{v}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-1.5">{l}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-glass flex-1 py-2.5 rounded-xl text-[12.5px]" onClick={() => app.pushToast('⏳ Replay timeline (Shift Replay) — Part 19.H', 'info')}>▶ Shift Replay (Time Machine)</button>
                <button className="btn-glass flex-1 py-2.5 rounded-xl text-[12.5px]" onClick={() => app.pushToast('📥 Export CSV / JSON / PDF — Part 19.U', 'info')}>📥 Export Data</button>
              </div>
            </GlassPanel>
          )}

          {section === 'reports' && (
            <GlassPanel material="regular" className="p-4">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">MONTHLY REPORTS — ALL TEAMS</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TEAMS.map((t) => {
                  const ta = allAgents.filter((a) => a.teamId === t.teamId)
                  return (
                    <GlassPanel key={t.teamId} material="thin" className="p-4">
                      <div className="font-orbitron text-[13px] font-bold text-white mb-1">{t.teamName}</div>
                      <div className="text-[11px] text-zinc-500 mb-3">Supervisor: {t.supervisorEmail.split('@')[0].split('.').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[['Breaks', '145'], ['Avg', '8m 20s'], ['Warnings', `${ta.reduce((s, a) => s + a.warnings.length, 0)}`]].map(([k, v]) => (
                          <div key={k} className="glass !rounded-xl py-2">
                            <div className="font-teko text-2xl font-semibold text-gold leading-none">{v}</div>
                            <div className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">{k}</div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-glass !rounded-xl w-full mt-3 py-1.5 text-[11.5px] text-cyan" onClick={() => app.pushToast(`📄 ${t.teamName} monthly report`, 'info')}>Open Report</button>
                    </GlassPanel>
                  )
                })}
              </div>
            </GlassPanel>
          )}
        </div>
      </main>

      {selected && <SidePanel agent={app.agentByEmail(selected.email)} onClose={() => setSelected(null)} />}
    </div>
  )
}
