import { useRef, useState, useEffect } from 'react'
import {
  Coffee, Droplets, UtensilsCrossed, Phone, Gift, Power, Ban, AlertTriangle, Camera, FileText, Pencil, Trash2,
} from 'lucide-react'
import { useApp } from '../store'
import { BREAK_TYPES } from '../data/seed'
import { fmtDuration } from '../lib/time'
import Avatar from './Avatar'

const RING_C = 2 * Math.PI * 46

function ringColor(pct) {
  if (pct < 0.3) return '#00FF88'
  if (pct < 0.6) return '#FFD700'
  if (pct < 0.9) return '#FF8800'
  return '#FF003C'
}

const AGENT_MENU = [
  { type: 'regular', icon: Coffee, angle: 0, color: '#00E5FF', label: 'Regular' },
  { type: 'wc', icon: Droplets, angle: 60, color: '#3A86FF', label: 'WC' },
  { type: 'meal', icon: UtensilsCrossed, angle: 150, color: '#FF8800', label: 'Meal' },
  { type: 'personal', icon: Phone, angle: 210, color: '#8338EC', label: 'Personal' },
  { type: 'bonus', icon: Gift, angle: 300, color: '#FFCC00', label: 'Bonus' },
]

const ADMIN_MENU = [
  { action: 'forceEnd', icon: Power, angle: 0, color: '#FF003C', label: 'Force End' },
  { action: 'block', icon: Ban, angle: 45, color: '#FF003C', label: 'Block' },
  { action: 'bonus', icon: Gift, angle: 90, color: '#FFCC00', label: 'Bonus' },
  { action: 'warning', icon: AlertTriangle, angle: 135, color: '#FFD700', label: 'Warning' },
  { action: 'picture', icon: Camera, angle: 180, color: '#8338EC', label: 'Picture' },
  { action: 'report', icon: FileText, angle: 225, color: '#00E5FF', label: 'Report' },
  { action: 'edit', icon: Pencil, angle: 270, color: '#3A86FF', label: 'Edit' },
  { action: 'remove', icon: Trash2, angle: 315, color: '#FF003C', label: 'Remove' },
]

const MENU_R = 'clamp(80px, 24vw, 112px)'

export default function Pod({ agent, onSelect, index = 0 }) {
  const app = useApp()
  const { session, config, getLimits, startBreak, endBreak } = app
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [denied, setDenied] = useState(false)
  const openTimer = useRef(null)
  const closeTimer = useRef(null)
  const denyTimer = useRef(null)

  const isOwn = session?.role === 'agent' && session.email === agent.email
  const canAdmin = ['supervisor', 'admin', 'developer'].includes(session?.role)

  const onbreak = agent.status === 'onbreak'
  const blocked = agent.status === 'blocked'
  const limits = getLimits(agent)
  const bType = onbreak && agent.breakType ? BREAK_TYPES[agent.breakType] : null
  const elapsed = onbreak && agent.breakStartedAt ? (Date.now() - agent.breakStartedAt) / 60000 : 0
  const maxDur = onbreak ? (agent.breakType === 'bonus' ? 10 : agent.breakType === 'wc' ? 15 : config.maxSlotDuration) : limits.maxTotal
  const pct = Math.min(1, onbreak ? elapsed / maxDur : agent.totalBreakTime / limits.maxTotal)
  const rc = ringColor(pct)
  const lv = limits.lv

  useEffect(() => () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); clearTimeout(denyTimer.current) }, [])

  const openMenu = () => {
    if (blocked && !canAdmin) return
    if (!canAdmin && !isOwn) return // agents only see their own menu
    clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => setMenuOpen(true), 280)
  }
  const closeMenu = () => {
    clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => { setMenuOpen(false); setConfirm(null) }, 450)
  }

  const handlePodClick = () => {
    if (canAdmin) { onSelect?.(agent); return }
    if (isOwn) {
      if (onbreak) { endBreak(agent.email); return }
      setMenuOpen((m) => !m)
    }
  }

  const chooseType = (type) => {
    if (type === 'bonus' && !agent.bonusGranted) { app.pushToast('No bonus break granted — take 10 BQ leads first 👀', 'error'); return }
    setConfirm({ type })
  }
  const confirmStart = () => {
    const ok = startBreak(agent.email, confirm.type)
    if (!ok) { setDenied(true); denyTimer.current = setTimeout(() => setDenied(false), 500) }
    else setMenuOpen(false)
    setConfirm(null)
  }

  const doAdminAction = (action) => {
    setMenuOpen(false)
    const map = {
      forceEnd: () => app.forceEnd(agent.email),
      block: () => app.toggleBlock(agent.email),
      bonus: () => app.grantBonus(agent.email),
      warning: () => window.__openWarning?.(agent),
      picture: () => app.pushToast(`📷 Picture manager for ${agent.name}`, 'info'),
      report: () => onSelect?.(agent),
      edit: () => app.pushToast(`✏️ Edit agent: ${agent.name}`, 'info'),
      remove: () => window.__openRemove?.(agent),
    }
    map[action]?.()
  }

  const showAdminMenu = menuOpen && canAdmin
  const showAgentMenu = menuOpen && isOwn && !onbreak && !blocked

  return (
    <div
      className="relative no-select flex flex-col items-center"
      style={{ width: 220, height: 272, animation: `pod-in 0.5s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: `${index * 0.05}s` }}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {/* POD CIRCLE */}
      <div
        className={`relative rounded-full cursor-pointer ${denied ? 'anim-wobble' : ''}`}
        style={{
          width: 180, height: 180,
          background: 'radial-gradient(circle at 50% 35%, rgba(22,22,28,0.92), rgba(5,5,5,1) 75%)',
          boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 ${onbreak ? '36px' : blocked ? '32px' : '20px'} ${onbreak ? 'rgba(0,229,255,0.28)' : blocked ? 'rgba(255,0,60,0.32)' : agent.bonusGranted ? 'rgba(255,204,0,0.2)' : 'rgba(255,255,255,0.06)'}, inset 0 1px 0 rgba(255,255,255,0.12)`,
          border: '1px solid rgba(255,255,255,0.14)',
          animation: onbreak ? 'pulse-glow 2s ease-in-out infinite' : undefined,
        }}
        onClick={handlePodClick}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="46" fill="none"
            stroke={rc} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1), stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${rc}88)`, animation: pct >= 0.9 && !onbreak ? 'pulse-glow 1.6s ease-in-out infinite' : undefined }}
          />
        </svg>

        {/* Inner flip scene: avatar ↔ timer */}
        <div className="flip-scene absolute inset-0 p-[18px]" style={{ pointerEvents: 'none' }}>
          <div className={`flip-inner ${onbreak ? 'is-flipped' : ''}`} style={{ transitionDuration: '800ms' }}>
            {/* FRONT: avatar (on solid backing) */}
            <div className="flip-face flex items-center justify-center">
              <Avatar src={agent.avatar} name={agent.name} size={136} ring={blocked ? 'crimson' : 'gradient'} />
              {!onbreak && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-orbitron uppercase tracking-widest" style={{ background: 'rgba(5,5,5,0.75)', color: blocked ? '#FF003C' : '#00FF88', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {blocked ? 'Blocked' : 'Available'}
                </div>
              )}
            </div>
            {/* BACK: timer (on dark scrim — never raw glass) */}
            <div className="flip-face flip-face--back rounded-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(10,10,14,0.96), rgba(3,3,5,0.98))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="font-inter text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: rc }}>{bType?.label || 'BREAK'}</div>
              <div className="font-orbitron font-bold text-[30px] leading-none" style={{ color: rc, textShadow: `0 0 16px ${rc}66`, animation: elapsed >= 13 ? 'heartbeat 1.2s ease-in-out infinite' : undefined }}>
                {fmtDuration(elapsed * 60)}
              </div>
              <div className="font-mono text-[9px] text-zinc-500 mt-1.5">max {maxDur}m · slot {agent.breakSlot}/{limits.maxSlots}</div>
            </div>
          </div>
        </div>

        {/* Slot indicators — bottom arc */}
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-2" style={{ pointerEvents: 'none' }}>
          {Array.from({ length: limits.maxSlots }).map((_, i) => {
            const used = i < agent.slotsUsed
            const active = onbreak && i === agent.breakSlot - 1
            return (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: 10, height: 10,
                  background: used ? '#FFCC00' : 'transparent',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: used ? '0 0 8px rgba(255,204,0,0.7)' : undefined,
                  animation: active ? 'dot-breathe 1.6s ease-in-out infinite' : undefined,
                }}
              />
            )
          })}
        </div>

        {/* Break type chip */}
        {onbreak && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 glass-ultrathin flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, border: `2px solid ${bType?.color}66`, boxShadow: `0 0 14px ${bType?.color}55` }}>
            <span style={{ fontSize: 15 }}>{bType?.icon}</span>
          </div>
        )}

        {/* YOU badge */}
        {isOwn && (
          <div className="absolute -top-2 -left-1 px-2.5 py-0.5 rounded-full font-orbitron text-[10px] font-bold text-black" style={{ background: 'linear-gradient(120deg,#FFCC00,#FF8800)', boxShadow: '0 0 12px rgba(255,204,0,0.6)', animation: 'breathe-soft 2.2s ease-in-out infinite' }}>
            YOU
          </div>
        )}

        {/* Warning badge */}
        {lv > 0 && (
          <div className="absolute -top-2 right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm" title={`Level ${lv} warning: ${agent.warnings[agent.warnings.length - 1]?.reason}`} style={{ background: lv === 1 ? '#FFD700' : lv === 2 ? '#FF8800' : '#FF003C', border: '2px solid #000', boxShadow: `0 0 12px ${lv === 1 ? 'rgba(255,215,0,0.7)' : lv === 2 ? 'rgba(255,136,0,0.7)' : 'rgba(255,0,60,0.8)'}` }}>
            {lv === 1 ? '⚠️' : lv === 2 ? '🔶' : '🟥'}
          </div>
        )}

        {/* Bonus badge */}
        {agent.bonusGranted && !(onbreak && agent.breakType === 'bonus') && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-orbitron font-bold text-black" style={{ background: 'linear-gradient(120deg,#00FF88,#00CC66)', boxShadow: '0 0 12px rgba(0,255,136,0.6)' }}>
            🎁 +10m
          </div>
        )}
        {onbreak && agent.breakType === 'bonus' && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-orbitron font-bold text-black anim-badge-pop" style={{ background: 'linear-gradient(120deg,#FFCC00,#FF8800)', boxShadow: '0 0 14px rgba(255,204,0,0.8)' }}>
            🎁 FREE
          </div>
        )}

        {/* Birthday */}
        {agent.birthday && (
          <>
            <div className="absolute -right-4 top-1/3 text-lg" title="Happy birthday! 🎂">🎂</div>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="absolute text-[9px] pointer-events-none" style={{ left: `${12 + i * 18}%`, top: -4, animation: `confetti-fall ${1.8 + i * 0.4}s ease-in ${i * 0.3}s infinite`, color: ['#FFCC00', '#FF003C', '#00E5FF', '#00FF88'][i % 4] }}>
                {['✦', '●', '✧', '◆'][i % 4]}
              </span>
            ))}
          </>
        )}
      </div>

      {/* LABEL */}
      <div className="text-center mt-2.5" style={{ pointerEvents: 'none' }}>
        <div className="font-orbitron text-[15px] font-bold text-zinc-200 uppercase tracking-wide leading-tight">
          {agent.name} {agent.powerEmoji}
        </div>
        <div className="font-teko text-[21px] font-medium leading-none mt-0.5" style={{ color: '#FFCC00', textShadow: '0 0 10px rgba(255,204,0,0.35)' }}>
          {Math.round(agent.totalBreakTime)}m / {limits.maxTotal}m
        </div>
        <div className="font-orbitron text-[9px] uppercase tracking-[0.2em]" style={{ color: onbreak ? '#00E5FF' : blocked ? '#FF003C' : '#00FF88' }}>
          {onbreak ? '● On Break' : blocked ? '● Blocked' : '● Available'}
        </div>
      </div>

      {/* ── RADIAL MENUS ─────────────────────────────────────── */}
      {(showAgentMenu || showAdminMenu) && (
        <div className="absolute left-1/2 top-[90px] pointer-events-none" style={{ width: 0, height: 0, zIndex: 30 }}>
          {(showAgentMenu ? AGENT_MENU.filter((b) => b.type !== 'bonus' || agent.bonusGranted) : ADMIN_MENU).map((b, i) => {
            const rad = (b.angle * Math.PI) / 180
            const x = Math.sin(rad)
            const y = -Math.cos(rad)
            return (
              <div key={showAgentMenu ? b.type : b.action} className="absolute pointer-events-none" style={{ left: `calc(${x} * ${MENU_R})`, top: `calc(${y} * ${MENU_R})`, transform: 'translate(-50%,-50%)' }}>
                <button
                  className="glass-ultrathin pointer-events-auto flex items-center justify-center hover:scale-110 transition-transform ease-snap"
                  style={{
                    width: showAgentMenu ? 56 : 52,
                    height: showAgentMenu ? 56 : 52,
                    borderRadius: 999,
                    border: `1.5px solid ${b.color}55`,
                    boxShadow: `0 0 16px ${b.color}44, inset 0 0 10px ${b.color}22`,
                    animation: `badge-pop 0.4s cubic-bezier(0.34,1.3,0.5,1) both`,
                    animationDelay: `${i * 0.05}s`,
                    cursor: 'pointer',
                  }}
                  title={showAgentMenu ? `${BREAK_TYPES[b.type].label} — ${BREAK_TYPES[b.type].desc}` : b.label}
                  onClick={(e) => { e.stopPropagation(); showAgentMenu ? chooseType(b.type) : doAdminAction(b.action) }}
                >
                  {showAgentMenu ? <b.icon size={20} color={b.color} /> : <b.icon size={17} color={b.color} />}
                </button>
                {showAgentMenu && (
                  <div className="absolute left-1/2 top-full mt-1 whitespace-nowrap font-inter text-[10px] text-zinc-300 -translate-x-1/2">
                    {BREAK_TYPES[b.type].label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmation popover */}
      {confirm && (
        <div className="absolute left-1/2 top-[84px] -translate-x-1/2 z-40 glass-thick rounded-2xl p-4 text-center anim-modal-in pointer-events-auto" style={{ width: 230 }}>
          <div className="text-2xl mb-1">{BREAK_TYPES[confirm.type].icon}</div>
          <div className="font-orbitron text-[13px] font-bold text-white mb-1">Start {BREAK_TYPES[confirm.type].label}?</div>
          <div className="text-[10.5px] text-zinc-400 mb-3">{BREAK_TYPES[confirm.type].desc}</div>
          <div className="flex gap-2 justify-center">
            <button className="btn-glass btn-cyan !rounded-full px-4 py-1.5 text-[12px]" onClick={confirmStart}>Confirm</button>
            <button className="btn-glass !rounded-full px-4 py-1.5 text-[12px]" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pod-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  )
}
