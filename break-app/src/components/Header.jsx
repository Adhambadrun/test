import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, Users, Zap, ChevronDown, Bell, Megaphone, User, Settings, Languages, Sun, MessageSquare,
  Keyboard, BarChart3, LogOut, Hand, Image, MonitorSmartphone,
} from 'lucide-react'
import { useApp } from '../store'
import TeamLogo from './TeamLogo'
import Avatar from './Avatar'
import { TEAMS } from '../data/seed'
import { fmtClock, fmtMinutes, shiftPhase } from '../lib/time'

export default function Header() {
  const app = useApp()
  const nav = useNavigate()
  const { session } = app
  const [dropdown, setDropdown] = useState(false)
  const [roleSwitcher, setRoleSwitcher] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const ddRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setDropdown(false); setRoleSwitcher(false); setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  if (!session) return null
  const role = session.role
  const isAgent = role === 'agent'
  const isSupervisor = role === 'supervisor'
  const isAdmin = role === 'admin'
  const isDev = role === 'developer'

  const team = app.teamBySupervisor(session.email) || (session.teamId ? TEAMS.find((t) => t.teamId === session.teamId) : null)
  const viewTeam = TEAMS.find((t) => t.teamId === app.selectedTeamId) || team || TEAMS[0]
  const cap = app.capacityUsed(viewTeam.teamId)
  const capPct = Math.min(100, (cap / app.config.breakCapacity) * 100)
  const total = app.teamBreakTime(viewTeam.teamId)
  const phase = shiftPhase(new Date())
  const live = fmtClock(new Date())

  const items = [
    { icon: User, label: 'View Profile', action: () => nav('/profile') },
    { icon: Settings, label: 'Settings', action: () => nav('/settings') },
    { icon: Languages, label: 'Language — EN / العربية', action: () => app.pushToast('Language toggle — EN & AR RTL planned ⏳', 'info') },
    { icon: Sun, label: 'Theme — Dark (Liquid Glass)', action: () => app.pushToast('Theme locked to dark — glass needs black 🔮', 'info') },
    { icon: Bell, label: 'Notifications', action: () => setNotifOpen(true) },
    { icon: Image, label: 'Change Picture', action: () => nav('/profile?edit=pic') },
    { icon: MessageSquare, label: 'Messages', action: () => nav('/messages') },
    { icon: Keyboard, label: 'Keyboard Shortcuts', action: () => app.pushToast('Ctrl+B Regular · Ctrl+W WC · Ctrl+M Meal · Ctrl+E End · Ctrl+D Dev panel · Esc Close', 'info') },
    { icon: BarChart3, label: 'My Stats', action: () => nav('/profile') },
    { icon: LogOut, label: 'Sign Out', action: () => { app.logout(); nav('/login') }, danger: true },
  ]

  return (
    <header className="sticky top-0 z-40 glass-thin" style={{ height: 80, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20, borderRadius: 0, boxShadow: '0 8px 30px rgba(0,0,0,0.45)' }}>
      {/* LEFT — Shift clock */}
      <div className="hidden md:flex items-center gap-3 shrink-0" style={{ width: 210 }}>
        <Clock size={24} color="#FF003C" style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,60,0.6))' }} />
        <div>
          <div className="font-inter text-[10px] uppercase tracking-[0.18em] text-gold">Shift Time</div>
          <div className="font-orbitron text-base font-semibold text-zinc-200 leading-tight">10:00 PM – 6:00 AM</div>
          <div className="font-inter text-[10px] uppercase tracking-widest text-zinc-500">
            {live} · EGYPT TIME
          </div>
        </div>
      </div>

      {/* CENTER-LEFT — Team branding */}
      <div className="flex items-center gap-3 min-w-0">
        <TeamLogo team={viewTeam} size={56} />
        <div className="min-w-0">
          <div className="font-orbitron font-black text-[26px] leading-none text-gradient-crimson-gold tracking-tight-2 truncate">
            {viewTeam.teamName}
          </div>
          <div className="font-inter text-[10px] uppercase tracking-[0.22em] text-zinc-500 mt-1">
            Night Shift Sales Team
          </div>
        </div>
      </div>

      {/* CENTER — Capacity */}
      <div className="hidden lg:flex flex-col items-center justify-center shrink-0 mx-auto" style={{ width: 170 }}>
        <div className="flex items-center gap-1.5">
          <Users size={20} color="#00E5FF" style={{ filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.7))' }} />
          <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-zinc-500">Capacity</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-teko text-[34px] font-semibold leading-none" style={{ color: capPct >= 100 ? '#FF003C' : '#FFCC00', textShadow: '0 0 14px rgba(255,204,0,0.4)' }}>{cap}</span>
          <span className="font-teko text-[34px] font-semibold leading-none text-zinc-400">/ {app.config.breakCapacity}</span>
        </div>
        <div className="font-inter text-[10px] uppercase tracking-[0.2em] text-zinc-500">On Break</div>
        {/* liquid fill bar */}
        <div className="w-full h-[4px] rounded-full bg-white/10 overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all ease-glide"
            style={{
              width: `${capPct}%`,
              transitionDuration: '700ms',
              background: `linear-gradient(90deg, ${capPct > 80 ? '#FF8800' : capPct > 60 ? '#FFD700' : '#00FF88'}, ${capPct > 80 ? '#FF003C' : capPct > 60 ? '#FF8800' : '#00E5FF'})`,
              boxShadow: '0 0 10px rgba(0,255,136,0.5)',
            }}
          />
        </div>
      </div>

      {/* CENTER-RIGHT — Team break time */}
      <div className="hidden lg:flex flex-col items-center shrink-0" style={{ width: 180 }}>
        <div className="flex items-center gap-1.5">
          <Clock size={20} color="#FFCC00" style={{ filter: 'drop-shadow(0 0 5px rgba(255,204,0,0.7))' }} />
          <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-zinc-500">Total Break Time</span>
        </div>
        <div className="font-teko text-[34px] font-semibold leading-none text-zinc-200" style={{ textShadow: '0 0 14px rgba(255,255,255,0.15)' }}>
          {fmtMinutes(total * 60)}
        </div>
        <div className="font-inter text-[10px] uppercase tracking-[0.2em] text-zinc-500">Of {app.config.maxTotalBreakTime}m (team)</div>
      </div>

      {/* RIGHT — role extras */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {(isSupervisor || isAdmin || isDev) && (
          <button className="btn-glass !rounded-full p-2.5 relative" title="Handover notes" onClick={() => app.pushToast(`📋 Handover: ${app.handover}`, 'info')}>
            <Hand size={18} className="text-gold" />
          </button>
        )}
        {isAdmin && (
          <select
            className="btn-glass !rounded-xl text-xs px-3 py-2 hidden xl:block"
            value={app.selectedTeamId}
            onChange={(e) => app.setSelectedTeamId(e.target.value)}
            title="Team selector"
          >
            {TEAMS.map((t) => <option key={t.teamId} value={t.teamId} className="bg-zinc-900">{t.teamName}</option>)}
          </select>
        )}
        {(isAdmin || isDev) && (
          <button className="btn-glass !rounded-full p-2.5" title="Broadcast" onClick={() => { if (window.__openBroadcast) window.__openBroadcast() }}>
            <Megaphone size={18} className="text-cyan" />
          </button>
        )}
        <div className="relative" ref={ddRef}>
          <button className="btn-glass !rounded-full p-2 relative" onClick={() => { setNotifOpen(!notifOpen); setDropdown(false) }}>
            <Bell size={18} className="text-zinc-300" />
            {app.notifications.some((n) => !n.read) && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson anim-pulse-glow" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 glass-thick w-[300px] rounded-2xl p-3 z-50" style={{ animation: 'modal-in 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
              <div className="font-orbitron text-xs text-gold mb-2 tracking-widest">NOTIFICATIONS</div>
              {app.notifications.map((n) => (
                <div key={n.id} className={`px-3 py-2 rounded-xl mb-1 text-[12.5px] ${n.read ? 'text-zinc-400' : 'text-zinc-100 bg-white/5'}`}>{n.text}</div>
              ))}
              <button className="text-[11px] text-cyan mt-1 px-3" onClick={() => app.markNotificationsRead()}>Mark all read</button>
            </div>
          )}
        </div>

        {/* God Mode — developer only */}
        {isDev && (
          <button
            className="btn-glass !rounded-full p-2 relative"
            title="God Mode Command Center ⚡"
            onClick={() => nav('/developer')}
          >
            <Zap size={22} className="text-gold" style={{ filter: 'drop-shadow(0 0 8px rgba(255,204,0,0.9))', animation: 'breathe-soft 2s ease-in-out infinite' }} />
          </button>
        )}

        {/* Role switcher — developer only */}
        {isDev && (
          <div className="relative">
            <button className="btn-glass !rounded-xl px-3 py-2 text-[11px] font-orbitron text-gold hidden md:block" onClick={() => { setRoleSwitcher(!roleSwitcher); setDropdown(false) }}>
              VIEW AS ▾
            </button>
            {roleSwitcher && (
              <div className="absolute right-0 top-12 glass-thick w-[220px] rounded-2xl p-2 z-50" style={{ animation: 'modal-in 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
                <div className="font-orbitron text-[10px] text-gold px-2 py-1 tracking-widest">ROLE SWITCHER</div>
                {[
                  { name: 'Solomon', role: 'agent', email: 'solomon@bcflights.com' },
                  { name: 'Omar Hassan', role: 'supervisor', email: 'omar.hassan@bcflights.com' },
                  { name: 'Karim El-Sayed', role: 'admin', email: 'karim.elsayed@bcflights.com' },
                  { name: 'Adham Badran', role: 'developer', email: 'adhambadraan@gmail.com' },
                ].map((r) => (
                  <button key={r.email} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-[12.5px] text-zinc-200 transition-colors flex items-center gap-2" onClick={() => app.switchRole(app.getMember(r.email))}>
                    <span className={`uppercase text-[9px] font-orbitron px-1.5 py-0.5 rounded ${r.role === 'developer' ? 'bg-gold text-black' : r.role === 'admin' ? 'bg-crimson text-white' : r.role === 'supervisor' ? 'bg-cyan text-black' : 'bg-white/10 text-zinc-300'}`}>{r.role}</span>
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User profile dropdown */}
        <div className="relative">
          <button className="flex items-center gap-3 rounded-2xl px-2.5 py-1.5 hover:bg-white/5 transition-colors" onClick={() => { setDropdown(!dropdown); setNotifOpen(false) }}>
            <div className="glass-ultrathin !rounded-full p-1" style={{ boxShadow: '0 0 14px rgba(255,204,0,0.15)' }}>
              <Avatar src={session.avatar} name={session.name} size={44} status={session.role === 'agent' ? (app.agentByEmail(session.email)?.status || 'available') : 'available'} />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-inter text-[10px] text-zinc-500 uppercase tracking-wider">Welcome back,</div>
              <div className="font-orbitron text-sm font-semibold text-zinc-200 leading-tight">{session.name}</div>
              <div className="font-inter text-[9px] uppercase tracking-[0.2em]" style={{ color: role === 'developer' ? '#FFCC00' : role === 'admin' ? '#FF003C' : role === 'supervisor' ? '#00E5FF' : '#00FF88' }}>{role}</div>
            </div>
            <ChevronDown size={16} className={`text-zinc-400 transition-transform ease-snap ${dropdown ? 'rotate-180' : ''}`} style={{ transitionDuration: '200ms' }} />
          </button>
          {dropdown && (
            <div className="absolute right-0 top-14 glass-thick w-[280px] rounded-2xl p-2 z-50" style={{ animation: 'modal-in 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
              {items.map((it) => (
                <button key={it.label} onClick={() => { setDropdown(false); it.action() }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-colors hover:bg-white/5 ${it.danger ? 'text-crimson' : 'text-zinc-200'}`}>
                  <it.icon size={16} className={it.danger ? 'text-crimson' : 'text-zinc-400'} />
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
