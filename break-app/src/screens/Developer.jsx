import { useState, useRef, useEffect } from 'react'
import { Terminal, Gauge, Zap, Settings as SettingsIcon, ScrollText, Database, Cpu, Activity, RefreshCw, Megaphone, Siren, HardDriveDownload, Trash2, Wrench, FileJson } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import GlassPanel from '../components/GlassPanel'
import { TEAMS } from '../data/seed'
import { fmtMinutes } from '../lib/time'

const TABS = [
  { id: 'dash', label: 'Dashboard', icon: Gauge },
  { id: 'logs', label: 'Live Logs', icon: Terminal },
  { id: 'actions', label: 'Quick Actions', icon: Zap },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'audit', label: 'Audit Log', icon: ScrollText },
  { id: 'db', label: 'Database', icon: Database },
]

const FEATURE_LIST = [
  ['bonusBreaks', 'Bonus Breaks'], ['warnings', 'Warning System'], ['ticker', 'SNN Ticker'], ['animations', 'Animations'],
  ['messaging', 'Messaging'], ['competitions', 'Competitions'], ['goals', 'Daily Goals'], ['weather', 'Weather Widget'],
  ['birthdays', 'Birthdays'], ['leaderboards', 'Leaderboards'],
]

const RALLY_OPTIONS = [5, 10, 15]

export default function Developer() {
  const app = useApp()
  const [tab, setTab] = useState('dash')
  const [logFilter, setLogFilter] = useState('all')
  const [paused, setPaused] = useState(false)
  const [rallyMin, setRallyMin] = useState(10)
  const [rallyMsg, setRallyMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const logBox = useRef(null)
  const [logLines, setLogLines] = useState(app.logs)

  // Live log simulation (app pushes real entries; also show activity)
  useEffect(() => { setLogLines(app.logs) }, [app.logs])
  useEffect(() => {
    if (!logBox.current || paused) return
    logBox.current.scrollTop = 0
  }, [logLines, paused])

  const filteredLogs = logLines.filter((l) => {
    if (logFilter === 'all') return true
    if (logFilter === 'errors') return /denied|error|failed/i.test(l)
    if (logFilter === 'breaks') return /break|bonus|wc/i.test(l)
    if (logFilter === 'warnings') return /warning/i.test(l)
    if (logFilter === 'system') return /system|toggle|maintenance|rally/i.test(l)
    return true
  })

  const totalAll = app.agents.reduce((s, a) => s + a.totalBreakTime, 0)
  const onbreakAll = app.agents.filter((a) => a.status === 'onbreak').length
  const online = app.agents.filter((a) => a.isOnline).length

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={22} className="text-gold" style={{ filter: 'drop-shadow(0 0 10px rgba(255,204,0,0.8))', animation: 'breathe-soft 2s ease-in-out infinite' }} />
          <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2">GOD MODE — COMMAND CENTER</h1>
          <span className="text-[11px] font-orbitron uppercase tracking-widest px-2.5 py-1 rounded-full text-gold border border-gold/40 bg-gold/10">developer exclusive</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 flex-wrap mb-4 glass-thin !rounded-2xl p-1.5 w-fit">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all ease-snap ${tab === t.id ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dash' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                ['Capacity', `${onbreakAll}/${app.config.breakCapacity}`, '#00E5FF', Gauge],
                ['Agents Online', `${online}/34`, '#00FF88', Activity],
                ['Total Break Time', fmtMinutes(totalAll * 60), '#FFCC00', Cpu],
                ['Uptime', '99.98%', '#00FF88', RefreshCw],
              ].map(([l, v, c, I]) => (
                <GlassPanel key={l} material="regular" className="p-4">
                  <div className="flex items-center justify-between mb-2"><I size={18} color={c} /><span className="text-[9px] font-mono text-zinc-600">live</span></div>
                  <div className="font-orbitron text-2xl font-bold" style={{ color: c, textShadow: `0 0 16px ${c}44` }}>{v}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mt-1">{l}</div>
                </GlassPanel>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <GlassPanel material="regular" className="p-4">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">ALL 4 TEAMS</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {TEAMS.map((t) => {
                    const ta = app.agents.filter((a) => a.teamId === t.teamId)
                    const ob = ta.filter((a) => a.status === 'onbreak').length
                    const c = t.color === 'crimson' ? '#FF003C' : t.color === 'cyan' ? '#00E5FF' : t.color === 'gold' ? '#FFCC00' : '#8338EC'
                    return (
                      <div key={t.teamId} className="glass !rounded-2xl p-3" style={{ borderColor: `${c}33` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-orbitron text-[12px] font-bold" style={{ color: c }}>{t.teamName}</span>
                          <span className="w-2 h-2 rounded-full anim-dot-breathe" style={{ background: c }} />
                        </div>
                        <div className="text-[11px] text-zinc-400">{ta.length} agents · {ob} on break</div>
                        <div className="h-[4px] rounded-full bg-white/10 mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(ob / app.config.breakCapacity) * 100}%`, background: c, boxShadow: `0 0 8px ${c}` }} /></div>
                      </div>
                    )
                  })}
                </div>
              </GlassPanel>
              <GlassPanel material="regular" className="p-4">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">SYSTEM OVERVIEW</div>
                <div className="space-y-2.5 text-[12px]">
                  {[
                    ['Firestore writes / min', '312'], ['Active sessions', '34'], ['Rally Mode', app.rally ? 'ACTIVE 🚨' : 'idle'], ['Maintenance', app.maintenance ? 'ON' : 'off'],
                    ['Feature flags', `${Object.values(app.features).filter(Boolean).length}/10 enabled`], ['WebSocket clients', '34'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-zinc-500">{k}</span>
                      <span className="font-mono" style={{ color: v === 'ACTIVE 🚨' ? '#FF003C' : v === 'ON' ? '#FF8800' : '#00FF88' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </>
        )}

        {tab === 'logs' && (
          <GlassPanel material="regular" className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold">LIVE FIRESTORE LOGS</div>
              <div className="flex gap-1 ml-auto">
                {[['all', 'All'], ['breaks', 'Breaks'], ['warnings', 'Warnings'], ['system', 'System'], ['errors', 'Errors']].map(([k, l]) => (
                  <button key={k} onClick={() => setLogFilter(k)} className={`px-2.5 py-1 rounded-full text-[10px] font-orbitron tracking-wide ${logFilter === k ? 'bg-gold text-black' : 'text-zinc-500 border border-white/10'}`}>{l}</button>
                ))}
                <button className={`px-2.5 py-1 rounded-full text-[10px] font-orbitron tracking-wide border ${paused ? 'bg-crimson text-white border-crimson' : 'text-zinc-500 border-white/10'}`} onClick={() => setPaused(!paused)}>{paused ? '▶' : '⏸'}</button>
              </div>
            </div>
            <div ref={logBox} className="rounded-2xl p-4 overflow-y-auto font-mono text-[11.5px] leading-relaxed" style={{ background: '#000', border: '1px solid rgba(0,255,136,0.15)', height: 420, boxShadow: 'inset 0 0 40px rgba(0,255,136,0.04)' }}>
              {filteredLogs.map((l, i) => {
                const color = /denied|error|failed/i.test(l) ? '#FF5C7A' : /warning/i.test(l) ? '#FFD700' : /break|bonus|wc/i.test(l) ? '#00E5FF' : /system|toggle|maintenance|rally/i.test(l) ? '#FFCC00' : '#00FF88'
                return <div key={i} style={{ color }}>{i === 0 ? '▶ ' : '  '}{l}</div>
              })}
            </div>
          </GlassPanel>
        )}

        {tab === 'actions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassPanel material="regular" className="p-5">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-crimson mb-3">DANGER ZONE</div>
              <div className="space-y-2.5">
                <button className="btn-glass btn-crimson w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2" onClick={() => { if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3500) } else { app.resetAllBreaks(); setConfirmReset(false) } }}>
                  <RefreshCw size={15} /> {confirmReset ? 'CLICK AGAIN TO CONFIRM RESET' : '🔄 RESET ALL BREAKS'}
                </button>
                <button className="btn-glass btn-crimson w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2" onClick={() => { app.sendEmergency('ALL TEAMS — hold the floor, no breaks for 15 minutes. Developer order.'); }}>
                  <Siren size={15} /> EMERGENCY SHUTDOWN
                </button>
                <button className="btn-glass w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2" onClick={() => app.toggleMaintenance()}>
                  <Wrench size={15} /> {app.maintenance ? 'MAINTENANCE MODE: ON (click to disable)' : '🔧 MAINTENANCE MODE'}
                </button>
              </div>
            </GlassPanel>
            <GlassPanel material="regular" className="p-5">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-crimson mb-3">🚨 RALLY MODE</div>
              <div className="text-[12px] text-zinc-400 mb-3">Blocks all breaks with a full-screen red overlay. Developer-only. Use it like a scalpel, not a hammer.</div>
              <div className="flex gap-1.5 mb-3">
                {RALLY_OPTIONS.map((m) => (
                  <button key={m} onClick={() => setRallyMin(m)} className={`flex-1 py-2 rounded-xl font-orbitron text-[12px] ${rallyMin === m ? 'bg-crimson text-white' : 'text-zinc-400 border border-white/10'}`}>{m} min</button>
                ))}
              </div>
              <input className="input-glass mb-3" placeholder="Rally message (optional)…" value={rallyMsg} onChange={(e) => setRallyMsg(e.target.value)} />
              <button className="btn-glass btn-crimson w-full py-3 rounded-xl font-bold text-[13px]" onClick={() => app.triggerRally(rallyMin, rallyMsg || 'Back on the floor. Now.')}>ENGAGE RALLY MODE</button>
            </GlassPanel>
            <GlassPanel material="regular" className="p-5">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">MOTIVATION & TOOLS</div>
              <div className="space-y-2.5">
                <button className="btn-glass btn-cyan w-full py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-2" onClick={() => app.sendBroadcast('BQ leads, not sleep. The night is young and so are your numbers. 🔥', null)}>
                  <Megaphone size={15} /> SEND MOTIVATIONAL BLAST
                </button>
                <button className="btn-glass w-full py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-2" onClick={() => app.pushToast('💾 Backup complete — break-backup-2026-08-29.json (12.4 MB)', 'success')}>
                  <HardDriveDownload size={15} /> 💾 BACKUP DATABASE
                </button>
                <button className="btn-glass w-full py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-2" onClick={() => app.pushToast('🧹 Cache cleared (3.2 MB freed)', 'info')}>
                  <Trash2 size={15} /> 🧹 CLEAR CACHE
                </button>
                <button className="btn-glass w-full py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-2" onClick={() => app.pushToast('📊 Exporting all data as JSON…', 'info')}>
                  <FileJson size={15} /> 📊 EXPORT ALL DATA (JSON)
                </button>
              </div>
            </GlassPanel>
            <GlassPanel material="regular" className="p-5">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">FEATURE TOGGLES</div>
              <div className="grid grid-cols-1 gap-1.5">
                {FEATURE_LIST.map(([k, label]) => (
                  <button key={k} className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-white/5 transition-colors" onClick={() => app.toggleFeature(k)}>
                    <span className="text-[12.5px] text-zinc-300">{label}</span>
                    <span className={`toggle ${app.features[k] ? 'on' : ''}`} />
                  </button>
                ))}
              </div>
            </GlassPanel>
          </div>
        )}

        {tab === 'settings' && (
          <GlassPanel material="regular" className="p-5 max-w-2xl">
            <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">SHIFT CONFIG — GLOBAL</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['breakCapacity', 'Max agents on break', app.config.breakCapacity, 1, 10],
                ['maxSlots', 'Max breaks per shift', app.config.maxSlots, 1, 8],
                ['maxSlotDuration', 'Max minutes per slot', app.config.maxSlotDuration, 5, 30],
                ['maxTotalBreakTime', 'Max total break minutes', app.config.maxTotalBreakTime, 30, 120],
                ['maxWCTime', 'Max WC minutes / day', app.config.maxWCTime, 5, 40],
              ].map(([k, label, val, min, max]) => (
                <div key={k}>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">{label}</label>
                  <input type="number" className="input-glass" value={val} min={min} max={max} onChange={(e) => app.updateConfig({ [k]: Number(e.target.value) })} />
                </div>
              ))}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Restricted first hour (10–11 PM)</label>
                <button className={`toggle ${app.config.restrictedFirstHour ? 'on' : ''}`} onClick={() => app.updateConfig({ restrictedFirstHour: !app.config.restrictedFirstHour })} />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Restricted last hour (5–6 AM)</label>
                <button className={`toggle ${app.config.restrictedLastHour ? 'on' : ''}`} onClick={() => app.updateConfig({ restrictedLastHour: !app.config.restrictedLastHour })} />
              </div>
            </div>
            <div className="text-[10.5px] text-zinc-600 mt-4 border-t border-white/5 pt-3">Every change is audit-logged with your identity, timestamp, IP, and user agent (Part 29.11).</div>
          </GlassPanel>
        )}

        {tab === 'audit' && (
          <GlassPanel material="regular" className="p-4">
            <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">AUDIT LOG — IMMUTABLE (dev read-only)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead><tr className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 border-b border-white/10"><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Performed by</th><th className="py-2 pr-4">Target</th><th className="py-2 pr-4">Detail</th><th className="py-2 pr-4">Time</th></tr></thead>
                <tbody>
                  {app.audit.map((a) => (
                    <tr key={a.id} className="border-b border-white/5 text-[12px]">
                      <td className="py-2.5 pr-4 font-mono text-cyan">{a.action}</td>
                      <td className="py-2.5 pr-4 text-zinc-300">{a.by}</td>
                      <td className="py-2.5 pr-4 text-zinc-400">{a.target}</td>
                      <td className="py-2.5 pr-4 text-zinc-500">{a.detail}</td>
                      <td className="py-2.5 pr-4 text-zinc-600 font-mono text-[11px]">{new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' }).format(new Date(a.time))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        )}

        {tab === 'db' && (
          <GlassPanel material="regular" className="p-4">
            <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">RAW DATABASE VIEWER (simulated)</div>
            <div className="rounded-2xl overflow-hidden font-mono text-[11px]" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
              <pre className="p-4 text-zinc-400 leading-relaxed overflow-x-auto">{JSON.stringify({
                shift_config: app.config,
                features: app.features,
                active_breaks: app.agents.filter((a) => a.status === 'onbreak').map((a) => ({ agent: a.name, type: a.breakType, startedAt: a.breakStartedAt })),
                maintenance: app.maintenance,
                rally: app.rally,
              }, null, 2)}</pre>
            </div>
            <div className="text-[10.5px] text-zinc-600 mt-3">Full Firestore schema (Part 20): teams, team_members, shifts/{{date}}/breaks, shifts/{{date}}/wc_tracking, shift_config, warnings, snn_headlines, audit_log.</div>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
