import { X, Power, Ban, Gift, AlertTriangle, Camera, Pencil, FileText, MessageSquare, Trash2 } from 'lucide-react'
import { useApp } from '../store'
import { TEAMS } from '../data/seed'
import { fmtDuration, fmtTime } from '../lib/time'
import Avatar from './Avatar'
import { MiniBars } from './Charts'

export default function SidePanel({ agent, onClose }) {
  const app = useApp()
  if (!agent) return null
  const team = TEAMS.find((t) => t.teamId === agent.teamId)
  const lv = agent.warnings.reduce((m, w) => Math.max(m, w.level || 0), 0)
  const onbreak = agent.status === 'onbreak'
  const elapsed = onbreak && agent.breakStartedAt ? (Date.now() - agent.breakStartedAt) / 60000 : 0
  const wcPct = Math.min(100, (agent.wcTime / app.config.maxWCTime) * 100)
  const totalsPct = Math.min(100, (agent.totalBreakTime / app.config.maxTotalBreakTime) * 100)

  const actions = [
    { label: 'Force End', icon: Power, color: '#FF003C', action: () => app.forceEnd(agent.email), disabled: !onbreak },
    { label: 'Block', icon: Ban, color: '#FF003C', action: () => app.toggleBlock(agent.email) },
    { label: 'Grant Bonus', icon: Gift, color: '#FFCC00', action: () => app.grantBonus(agent.email), disabled: agent.bonusGranted },
    { label: 'Issue Warning', icon: AlertTriangle, color: '#FFD700', action: () => window.__openWarning?.(agent) },
    { label: 'Change Picture', icon: Camera, color: '#8338EC', action: () => app.pushToast('📷 Picture manager', 'info') },
    { label: 'Edit Details', icon: Pencil, color: '#3A86FF', action: () => app.pushToast('✏️ Edit agent details', 'info') },
    { label: 'View Report', icon: FileText, color: '#00E5FF', action: () => app.pushToast('📊 Full monthly report', 'info') },
    { label: 'Message', icon: MessageSquare, color: '#00FF88', action: () => app.pushToast('💬 Open conversation', 'info') },
  ]

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-[70] glass-thick overflow-y-auto" style={{ width: 'min(480px, 100vw)', borderRadius: '24px 0 0 24px', animation: 'panel-in 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="font-orbitron text-lg font-bold text-white tracking-tight-2">AGENT DETAIL</div>
            <button onClick={onClose} className="btn-glass !rounded-full p-2"><X size={16} /></button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={agent.avatar} name={agent.name} size={120} ring="crimson" status={agent.status} />
            <div>
              <div className="font-orbitron text-xl font-bold text-white tracking-tight-2">{agent.name} {agent.powerEmoji}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] font-orbitron uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${team?.color === 'crimson' ? '#FF003C' : team?.color === 'cyan' ? '#00E5FF' : team?.color === 'gold' ? '#FFCC00' : '#8338EC'}22`, color: team?.color === 'crimson' ? '#FF003C' : team?.color === 'cyan' ? '#00E5FF' : team?.color === 'gold' ? '#FFCC00' : '#a78bfa', border: `1px solid ${team?.color === 'crimson' ? '#FF003C' : team?.color === 'cyan' ? '#00E5FF' : team?.color === 'gold' ? '#FFCC00' : '#8338EC'}55` }}>{team?.teamName}</span>
                <span className="text-[9px] font-orbitron uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">Agent</span>
              </div>
              <div className="font-inter text-[11px] text-zinc-500 mt-2 italic">“{agent.personalMotto}”</div>
              <div className="text-[12px] mt-1 font-medium" style={{ color: onbreak ? '#00E5FF' : agent.status === 'blocked' ? '#FF003C' : '#00FF88' }}>
                {onbreak ? '● ON BREAK' : agent.status === 'blocked' ? '● BLOCKED' : '● ONLINE & AVAILABLE'}
              </div>
            </div>
          </div>

          {/* Current session grid */}
          <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-2">CURRENT SESSION</div>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className="glass !rounded-2xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Total Break Time</div>
              <div className="font-teko text-3xl font-semibold text-zinc-100 leading-none">{Math.round(agent.totalBreakTime)}<span className="text-lg text-zinc-500">/{app.config.maxTotalBreakTime}m</span></div>
              <div className="h-[4px] rounded-full bg-white/10 mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${totalsPct}%`, background: 'linear-gradient(90deg,#FFCC00,#FF8800)' }} /></div>
            </div>
            <div className="glass !rounded-2xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Slots Used</div>
              <div className="flex gap-1.5 mt-1">
                {Array.from({ length: app.config.maxSlots }).map((_, i) => (
                  <span key={i} className="w-4 h-4 rounded-full" style={{ background: i < agent.slotsUsed ? '#FFCC00' : 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: i < agent.slotsUsed ? '0 0 8px rgba(255,204,0,0.6)' : undefined }} />
                ))}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1.5">{agent.slotsUsed}/{app.config.maxSlots} used</div>
            </div>
            <div className="glass !rounded-2xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Warnings</div>
              <div className="font-teko text-3xl font-semibold leading-none" style={{ color: lv === 0 ? '#00FF88' : lv === 1 ? '#FFD700' : lv === 2 ? '#FF8800' : '#FF003C' }}>{agent.warnings.length}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{lv > 0 ? `Level ${lv} active` : 'Clean slate ✨'}</div>
            </div>
            <div className="glass !rounded-2xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Bonus Time</div>
              <div className="font-teko text-3xl font-semibold leading-none text-gold">{agent.bonusGranted ? '+10m' : '—'}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{agent.bonusUsed ? 'Used' : agent.bonusGranted ? 'Ready' : 'None'}</div>
            </div>
            {onbreak ? (
              <>
                <div className="glass !rounded-2xl p-3" style={{ boxShadow: '0 0 20px rgba(0,229,255,0.15), var(--glass-shadow-ambient)' }}>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Current Slot Time</div>
                  <div className="font-orbitron text-2xl font-bold leading-none text-cyan" style={{ textShadow: '0 0 14px rgba(0,229,255,0.5)' }}>{fmtDuration(elapsed * 60)}</div>
                  <div className="text-[11px] text-cyan/70 mt-0.5">LIVE</div>
                </div>
                <div className="glass !rounded-2xl p-3">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Break Started</div>
                  <div className="font-orbitron text-xl font-bold text-zinc-100 leading-tight">{fmtTime(new Date(agent.breakStartedAt), 'Africa/Cairo', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{agent.breakType} slot {agent.breakSlot}</div>
                </div>
              </>
            ) : (
              <div className="col-span-2 glass !rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">Status</div>
                  <div className="font-orbitron text-xl font-bold" style={{ color: agent.status === 'blocked' ? '#FF003C' : '#00FF88' }}>{agent.status === 'blocked' ? 'BLOCKED' : 'AVAILABLE'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">Daily Goal</div>
                  <div className="font-teko text-2xl font-semibold text-gold">{agent.goalProgress}%</div>
                </div>
              </div>
            )}
          </div>

          {/* WC tracking */}
          <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-2">🚻 WC TRACKING — TODAY</div>
          <div className="glass !rounded-2xl p-4 mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-teko text-3xl font-semibold text-zinc-100">{agent.wcTime}<span className="text-lg text-zinc-500">/{app.config.maxWCTime}m</span></span>
              <span className="text-[11px] text-zinc-500">{wcPct >= 90 ? 'Limit approaching — be kind to the door' : 'Within limits'}</span>
            </div>
            <div className="h-[6px] rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all ease-glide" style={{ width: `${wcPct}%`, transitionDuration: '700ms', background: wcPct >= 90 ? 'linear-gradient(90deg,#FF8800,#FF003C)' : 'linear-gradient(90deg,#3A86FF,#00E5FF)', boxShadow: '0 0 10px rgba(0,229,255,0.5)' }} />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">{agent.wcTime > 0 ? `Weekly trend: ${Math.round(agent.wcTime * 1.4)}m across 3 days` : 'No WC breaks yet'}</div>
          </div>

          {/* Monthly overview */}
          <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-2">MONTHLY OVERVIEW</div>
          <div className="glass !rounded-2xl p-4 mb-5">
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              {[['Breaks', '145'], ['Avg', '8m 20s'], ['Warnings', `${agent.warnings.length}`], ['Bonuses', agent.bonusGranted ? '1' : '0']].map(([k, v]) => (
                <div key={k}>
                  <div className="font-teko text-2xl font-semibold text-zinc-100 leading-none">{v}</div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1">{k}</div>
                </div>
              ))}
            </div>
            <MiniBars data={[3, 5, 4, 6, 5, 8, 4, 7, 6, 5, 4, 5, 6, 7, 5, 4]} color="#FF003C" height={54} />
            <button className="btn-glass !rounded-xl w-full mt-3 py-2 text-[12px] text-cyan">View Full Report 📊</button>
          </div>

          {/* Actions */}
          <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-2">QUICK ACTIONS</div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {actions.map((a) => (
              <button key={a.label} disabled={a.disabled} onClick={a.action} className="glass !rounded-xl flex flex-col items-center gap-1.5 py-3 px-1 hover:bg-white/5 transition-colors disabled:opacity-35 disabled:cursor-not-allowed">
                <a.icon size={18} color={a.disabled ? '#555' : a.color} style={a.disabled ? {} : { filter: `drop-shadow(0 0 5px ${a.color}66)` }} />
                <span className="text-[9.5px] text-zinc-400 text-center leading-tight">{a.label}</span>
              </button>
            ))}
            <button onClick={() => window.__openRemove?.(agent)} className="glass !rounded-xl flex flex-col items-center gap-1.5 py-3 px-1 hover:bg-white/5 transition-colors">
              <Trash2 size={18} color="#FF003C" style={{ filter: 'drop-shadow(0 0 5px rgba(255,0,60,0.6))' }} />
              <span className="text-[9.5px] text-zinc-400 text-center leading-tight">Remove</span>
            </button>
          </div>

          {/* Recent activity */}
          <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-2">RECENT ACTIVITY</div>
          <div className="space-y-2 mb-4">
            {[
              { t: 'Break ended (24m) · Regular', time: Date.now() - 3600e3, c: '#00E5FF' },
              { t: `Warning ${lv > 0 ? `Level ${lv}` : 'dismissed'}`, time: Date.now() - 7200e3, c: lv > 0 ? '#FFD700' : '#00FF88' },
              { t: 'Daily goal updated to 80%', time: Date.now() - 10800e3, c: '#3A86FF' },
              { t: 'Login · 10:04 PM', time: Date.now() - 14400e3, c: '#00FF88' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.c, boxShadow: `0 0 6px ${ev.c}` }} />
                <span className="text-zinc-300 flex-1">{ev.t}</span>
                <span className="text-[10px] text-zinc-600 font-mono">{fmtTime(new Date(ev.time), 'Africa/Cairo', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes panel-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  )
}
