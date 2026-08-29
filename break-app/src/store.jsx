import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  AGENTS, ALL_MEMBERS, BREAK_TYPES, FUNNY_FILLERS, INITIAL_HEADLINES, MESSAGES_SEED, TEAMS, DEVELOPER_EMAILS,
} from './data/seed'
import { inRestrictedHour, shiftPhase } from './lib/time'

const AppCtx = createContext(null)

export const useApp = () => useContext(AppCtx)

export const ROLE_RANK = { agent: 1, supervisor: 2, admin: 3, developer: 4 }

const DEFAULT_CONFIG = {
  breakCapacity: 5,
  maxSlots: 5,
  maxSlotDuration: 15,
  maxTotalBreakTime: 60,
  maxWCTime: 20,
  shiftStart: '10:00 PM',
  shiftEnd: '6:00 AM',
  restrictedFirstHour: true,
  restrictedLastHour: true,
}

const DEFAULT_FEATURES = {
  bonusBreaks: true,
  warnings: true,
  ticker: true,
  animations: true,
  messaging: true,
  competitions: true,
  goals: true,
  weather: true,
  birthdays: true,
  leaderboards: true,
}

const SEED_LOGS = [
  '22:31:45 break_started solomon@bcflights.com Regular',
  '22:31:32 bonus_break_given fabiola@bcflights.com +10m',
  '22:30:11 warning_issued leo@bcflights.com Level 1',
  '22:29:58 break_started zayn@bcflights.com WC',
  '22:29:12 shift_config_loaded config current v4.2.1',
  '22:28:40 auth_success adhambadraan@gmail.com developer',
  '22:28:33 system_boot Break Engine 4.2.1 · Firestore connected',
]

const SEED_AUDIT = [
  { id: 'a1', action: 'warning_issued', by: 'Karim El-Sayed (admin)', target: 'Leo', time: Date.now() - 5400e3, detail: 'Level 1 · WC limit exceeded' },
  { id: 'a2', action: 'bonus_break_granted', by: 'Omar Hassan (supervisor)', target: 'Fabiola', time: Date.now() - 6000e3, detail: '+10m · 10 BQ leads verified' },
  { id: 'a3', action: 'agent_updated', by: 'Adham Badran (developer)', target: 'Sara', time: Date.now() - 7200e3, detail: 'role/team metadata patched' },
]

let uid = 100
const nextId = (p) => `${p}${++uid}`

export function AppProvider({ children }) {
  const [session, setSession] = useState(null) // member object
  const [agents, setAgents] = useState(() => AGENTS.map((a) => ({ ...a, warnings: a.warnings ? a.warnings.map((w) => ({ ...w })) : [] })))
  const [headlines, setHeadlines] = useState(() => INITIAL_HEADLINES.map((h) => ({ ...h })))
  const [toasts, setToasts] = useState([])
  const [logs, setLogs] = useState(() => [...SEED_LOGS])
  const [audit, setAudit] = useState(() => [...SEED_AUDIT])
  const [rally, setRally] = useState(null)
  const [emergency, setEmergency] = useState(null)
  const [config, setConfig] = useState(() => ({ ...DEFAULT_CONFIG }))
  const [features, setFeatures] = useState(() => ({ ...DEFAULT_FEATURES }))
  const [messages, setMessages] = useState(() => MESSAGES_SEED.map((m) => ({ ...m })))
  const [selectedTeamId, setSelectedTeamId] = useState('t1')
  const [maintenance, setMaintenance] = useState(false)
  const [newsOpen, setNewsOpen] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: '⚡ God Mode Command Center ready', read: false, time: Date.now() - 120000 },
    { id: 'n2', text: 'New warning appeal from Leo', read: false, time: Date.now() - 300000 },
    { id: 'n3', text: 'Rally Mode available in dev panel', read: true, time: Date.now() - 600000 },
  ])
  const [handover, setHandover] = useState('Shift opens clean. Two agents had close calls on WC budget — watch Leo. @next-supervisor: huddle at 5:15 AM.')

  const agentsRef = useRef(agents)
  useEffect(() => { agentsRef.current = agents }, [agents])

  const pushToast = useCallback((text, kind = 'info') => {
    const id = nextId('t')
    setToasts((p) => [...p, { id, text, kind }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4200)
  }, [])

  const dismissToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), [])

  const pushHeadline = useCallback((h) => {
    setHeadlines((p) => [{ id: nextId('h'), ...h, time: h.time || Date.now() }, ...p].slice(0, 60))
  }, [])

  const pushLog = useCallback((line) => {
    setLogs((p) => {
      const stamp = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())
      return [stamp + ' ' + line, ...p].slice(0, 200)
    })
  }, [])

  const pushAudit = useCallback((entry) => {
    setAudit((p) => [{ id: nextId('a'), ...entry, time: Date.now() }, ...p].slice(0, 100))
  }, [])

  // ── 1s heartbeat: auto-ends, rally expiry, WC tick ──────────
  useEffect(() => {
    const iv = setInterval(() => {
      setNow(Date.now())
      setAgents((prev) => {
        let changed = false
        const next = prev.map((a) => {
          if (a.status !== 'onbreak' || !a.breakType || !a.breakStartedAt) return a
          const dur = BREAK_TYPES[a.breakType]?.max || config.maxSlotDuration
          if (Date.now() - a.breakStartedAt < dur * 60000) return a
          changed = true
          const elapsed = Math.round((Date.now() - a.breakStartedAt) / 60000)
          const wasBonus = a.breakType === 'bonus'
          const isWC = a.breakType === 'wc'
          const newWC = isWC ? a.wcTime + elapsed : a.wcTime
          const agentName = a.name.toUpperCase()
          const lines = []
          if (wasBonus) lines.push(`${agentName} finished bonus break (${elapsed}m) — welcome back!`)
          else lines.push(`${agentName} break auto-ended at ${dur}m — the clock does not negotiate`)
          if (isWC && newWC > config.maxWCTime) {
            lines.push(`⚠️ ${agentName} exceeded WC limit (${newWC}m/${config.maxWCTime}m) — auto Level 1 warning`)
          }
          setTimeout(() => {
            lines.forEach((l) => pushHeadline({ text: l, category: wasBonus ? 'bonus' : 'breaks', priority: isWC && newWC > config.maxWCTime ? 'urgent' : 'normal', agent: a.name, teamId: a.teamId }))
            if (isWC && newWC > config.maxWCTime) {
              setAgents((p) => p.map((x) => (x.email === a.email ? { ...x, warnings: [...x.warnings, { level: 1, reason: 'WC daily limit exceeded', issuedAt: Date.now() }] } : x)))
            }
            pushToast(wasBonus ? `${a.name} — bonus break complete! 🎁` : `${a.name} break auto-ended (${dur}m)`, 'info')
          }, 0)
          return {
            ...a,
            status: 'available',
            breakType: null,
            breakStartedAt: null,
            breakSlot: 0,
            totalBreakTime: a.totalBreakTime + elapsed,
            slotsUsed: a.slotsUsed + (wasBonus ? 0 : 1),
            wcTime: newWC,
            bonusUsed: wasBonus ? true : a.bonusUsed,
          }
        })
        return changed ? next : prev
      })
      setRally((r) => (r && Date.now() >= r.endsAt ? null : r))
    }, 1000)
    return () => clearInterval(iv)
  }, [config.maxSlotDuration, config.maxWCTime, pushHeadline, pushToast])

  // ── Auth ───────────────────────────────────────────────────
  const login = useCallback((member) => {
    setSession(member)
    pushLog(`auth_success ${member.email} ${member.role}`)
    pushToast(`Welcome back, ${member.name.split(' ')[0]} 👋`, 'success')
  }, [pushLog, pushToast])

  const logout = useCallback(() => {
    pushLog('auth_logout session cleared')
    setSession(null)
  }, [pushLog])

  const switchRole = useCallback((member) => {
    setSession(member)
    pushLog(`role_switch view_as ${member.email} (${member.role})`)
    pushToast(`Viewing as ${member.name} · ${member.role}`, 'info')
  }, [pushLog, pushToast])

  // ── Derived helpers ────────────────────────────────────────
  const getMember = useCallback((email) => ALL_MEMBERS.find((m) => m.email === email), [])
  const agentByEmail = useCallback((email) => agents.find((a) => a.email === email), [agents])

  const teamAgents = useCallback((teamId) => agents.filter((a) => a.teamId === teamId), [agents])
  const capacityUsed = useCallback((teamId) => agents.filter((a) => a.teamId === teamId && a.status === 'onbreak').length, [agents])
  const teamBreakTime = useCallback((teamId) => {
    const t = agents.filter((a) => a.teamId === teamId)
    let m = t.reduce((s, a) => s + a.totalBreakTime, 0)
    t.forEach((a) => { if (a.status === 'onbreak' && a.breakStartedAt) m += (Date.now() - a.breakStartedAt) / 60000 })
    return m
  }, [agents, now]) // eslint-disable-line

  const teamBySupervisor = useCallback((email) => TEAMS.find((t) => t.supervisorEmail === email), [])

  const getLimits = useCallback((agent) => {
    const lv = agent?.warnings?.reduce((m, w) => Math.max(m, w.level || 0), 0) || 0
    let maxTotal = config.maxTotalBreakTime
    let maxSlots = config.maxSlots
    if (lv >= 3) { maxTotal = 40; maxSlots = 4 }
    else if (lv === 2) { maxTotal = 50; maxSlots = 4 }
    return { maxTotal, maxSlots, lv }
  }, [config.maxTotalBreakTime, config.maxSlots])

  // ── Break actions ──────────────────────────────────────────
  const startBreak = useCallback((agentEmail, type) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    const me = agentsRef.current.find((a) => a.email === session?.email)
    if (!agent) return false
    const limits = getLimits(agent)
    const teamUsed = capacityUsed(agent.teamId)
    const bType = BREAK_TYPES[type]
    const name = agent.name.toUpperCase()
    const reasons = []

    if (agent.status === 'blocked') reasons.push('🚫 Agent is blocked')
    if (agent.status === 'onbreak') reasons.push('Already on a break')
    if (!bType) reasons.push('Unknown break type')
    if (teamUsed >= config.breakCapacity) reasons.push(`Team capacity full (${teamUsed}/${config.breakCapacity})`)
    if (type === 'bonus' && !agent.bonusGranted) reasons.push('No bonus break granted')
    if (type === 'bonus' && agent.bonusUsed) reasons.push('Bonus already used this shift')
    if (type === 'bonus' && !features.bonusBreaks) reasons.push('Bonus breaks disabled')
    if (type === 'wc' && agent.wcTime >= config.maxWCTime) reasons.push(`WC daily limit reached (${agent.wcTime}m/${config.maxWCTime}m)`)
    if (type !== 'wc' && type !== 'bonus') {
      if (agent.totalBreakTime >= limits.maxTotal) reasons.push(`Budget exhausted (${agent.totalBreakTime}m/${limits.maxTotal}m)`)
      if (agent.slotsUsed >= limits.maxSlots) reasons.push(`All ${limits.maxSlots} slots used`)
      if (inRestrictedHour()) reasons.push('Restricted hour — no regular breaks 10–11 PM / 5–6 AM')
    }
    if (me && me.role === 'agent' && agentEmail !== session?.email) reasons.push('Agents can only start their own breaks')

    if (reasons.length) {
      pushToast(`${agent.name.split(' ')[0]}: ${reasons[0]}`, 'error')
      pushLog(`break_start_denied ${agent.email} ${type} (${reasons[0]})`)
      return false
    }

    setAgents((p) => p.map((a) => (a.email === agentEmail ? {
      ...a,
      status: 'onbreak',
      breakType: type,
      breakStartedAt: Date.now(),
      breakSlot: a.slotsUsed + 1,
    } : a)))

    const slotNum = agent.slotsUsed + 1
    if (type === 'bonus') {
      pushHeadline({ text: `${name} is on a bonus break (+10m, free!) 🎁`, category: 'bonus', priority: 'normal', agent: agent.name, teamId: agent.teamId })
    } else {
      const priv = me && me.role === 'agent' ? `${name} started a break` : `${name} started break (${bType.label}) — Slot ${slotNum}/${limits.maxSlots}`
      pushHeadline({ text: priv, category: 'breaks', priority: 'normal', agent: agent.name, teamId: agent.teamId })
    }
    pushLog(`break_started ${agent.email} ${type} slot ${slotNum}`)
    pushAudit({ action: 'break_started', by: me ? `${me.name} (${me.role})` : 'system', target: agent.name, detail: type })
    pushToast(`${agent.name.split(' ')[0]} — ${bType.label} started ☕`, 'success')
    return true
  }, [agentsRef, session, capacityUsed, config.breakCapacity, config.maxWCTime, features.bonusBreaks, getLimits, pushAudit, pushHeadline, pushLog, pushToast])

  const endBreak = useCallback((agentEmail) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent || agent.status !== 'onbreak') return
    const elapsed = Math.round((Date.now() - agent.breakStartedAt) / 60000) || 1
    const wasBonus = agent.breakType === 'bonus'
    const isWC = agent.breakType === 'wc'
    const name = agent.name.toUpperCase()
    setAgents((p) => p.map((a) => (a.email === agentEmail ? {
      ...a,
      status: 'available',
      breakType: null,
      breakStartedAt: null,
      breakSlot: 0,
      totalBreakTime: a.totalBreakTime + elapsed,
      slotsUsed: a.slotsUsed + (wasBonus ? 0 : 1),
      wcTime: isWC ? a.wcTime + elapsed : a.wcTime,
      bonusUsed: wasBonus ? true : a.bonusUsed,
    } : a)))
    pushHeadline({ text: wasBonus ? `${name} finished bonus break (${elapsed}m) — welcome back!` : `${name} ended break (${elapsed}m) — ${elapsed < 10 ? 'efficient! ⚡' : 'noted 😏'}`, category: wasBonus ? 'bonus' : 'breaks', priority: 'normal', agent: agent.name, teamId: agent.teamId })
    pushLog(`break_ended ${agent.email} ${agent.breakType} ${elapsed}m`)
    pushAudit({ action: 'break_ended', by: agent.email, target: agent.name, detail: `${agent.breakType} ${elapsed}m` })
    pushToast(elapsed < 10 ? 'Welcome back! ⚡' : `${agent.name.split(' ')[0]} — welcome back!`, 'success')
  }, [agentsRef, pushAudit, pushHeadline, pushLog, pushToast])

  const forceEnd = useCallback((agentEmail) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent || agent.status !== 'onbreak') return
    const elapsed = Math.round((Date.now() - agent.breakStartedAt) / 60000) || 1
    setAgents((p) => p.map((a) => (a.email === agentEmail ? {
      ...a,
      status: 'available',
      breakType: null,
      breakStartedAt: null,
      breakSlot: 0,
      totalBreakTime: a.totalBreakTime + elapsed,
      slotsUsed: a.slotsUsed + (a.breakType === 'bonus' ? 0 : 1),
      bonusUsed: a.breakType === 'bonus' ? true : a.bonusUsed,
    } : a)))
    pushHeadline({ text: `🛑 ${agent.name.toUpperCase()} break force-ended by ${session?.name || 'supervisor'}`, category: 'alerts', priority: 'critical', agent: agent.name, teamId: agent.teamId })
    pushLog(`break_force_ended ${agent.email} by ${session?.email || 'unknown'}`)
    pushAudit({ action: 'break_forced_end', by: `${session?.name} (${session?.role})`, target: agent.name, detail: `${elapsed}m elapsed` })
    pushToast(`${agent.name.split(' ')[0]} — break force-ended 🛑`, 'error')
  }, [agentsRef, session, pushAudit, pushHeadline, pushLog, pushToast])

  const toggleBlock = useCallback((agentEmail) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent) return
    const block = agent.status !== 'blocked'
    setAgents((p) => p.map((a) => (a.email === agentEmail ? { ...a, status: block ? 'blocked' : 'available' } : a)))
    pushHeadline({ text: block ? `🚫 ${agent.name.toUpperCase()} blocked from breaks` : `${agent.name.toUpperCase()} unblocked — back in the game`, category: 'alerts', priority: 'urgent', agent: agent.name, teamId: agent.teamId })
    pushLog(`agent_${block ? 'blocked' : 'unblocked'} ${agent.email} by ${session?.email || 'unknown'}`)
    pushAudit({ action: block ? 'agent_blocked' : 'agent_unblocked', by: `${session?.name} (${session?.role})`, target: agent.name, detail: '' })
    pushToast(`${agent.name.split(' ')[0]} ${block ? 'blocked' : 'unblocked'}`, block ? 'error' : 'success')
  }, [agentsRef, session, pushAudit, pushHeadline, pushLog, pushToast])

  const grantBonus = useCallback((agentEmail) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent || agent.bonusGranted) return
    setAgents((p) => p.map((a) => (a.email === agentEmail ? { ...a, bonusGranted: true } : a)))
    pushHeadline({ text: `🎁 ${agent.name.toUpperCase()} earned a bonus break — 10 BQ leads worked!`, category: 'bonus', priority: 'normal', agent: agent.name, teamId: agent.teamId })
    pushLog(`bonus_break_given ${agent.email} +10m by ${session?.email || 'unknown'}`)
    pushAudit({ action: 'bonus_break_granted', by: `${session?.name} (${session?.role})`, target: agent.name, detail: '+10m · BQ rule verified' })
    pushToast(`🎁 Bonus break granted to ${agent.name.split(' ')[0]}`, 'success')
  }, [agentsRef, session, pushAudit, pushHeadline, pushLog, pushToast])

  const issueWarning = useCallback((agentEmail, level, reason, note) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent) return
    const w = { id: nextId('w'), level, reason, note, issuedAt: Date.now(), status: 'active', issuedBy: session?.name || 'system' }
    setAgents((p) => p.map((a) => (a.email === agentEmail ? { ...a, warnings: [...a.warnings, w] } : a)))
    const tone = level === 1 ? 'Gentle reminder' : level === 2 ? 'Manager alert' : 'Escalate to admin'
    pushHeadline({ text: `⚠️ ${agent.name.toUpperCase()} — Level ${level} warning (${tone}): ${reason}`, category: 'warnings', priority: level >= 2 ? 'urgent' : 'normal', agent: agent.name, teamId: agent.teamId })
    pushLog(`warning_issued ${agent.email} Level ${level} by ${session?.email || 'unknown'} (${reason})`)
    pushAudit({ action: 'warning_issued', by: `${session?.name} (${session?.role})`, target: agent.name, detail: `Level ${level} · ${reason}` })
    pushToast(`⚠️ Level ${level} warning issued to ${agent.name.split(' ')[0]}`, 'error')
  }, [agentsRef, session, pushAudit, pushHeadline, pushLog, pushToast])

  const removeAgent = useCallback((agentEmail) => {
    const agent = agentsRef.current.find((a) => a.email === agentEmail)
    if (!agent) return
    setAgents((p) => p.filter((a) => a.email !== agentEmail))
    pushHeadline({ text: `🗑️ ${agent.name.toUpperCase()} removed from roster`, category: 'alerts', priority: 'urgent', agent: agent.name, teamId: agent.teamId })
    pushAudit({ action: 'agent_removed', by: `${session?.name} (${session?.role})`, target: agent.name, detail: '' })
    pushToast(`${agent.name} removed from team`, 'error')
  }, [agentsRef, session, pushAudit, pushHeadline, pushToast])

  // ── System actions ────────────────────────────────────────
  const resetAllBreaks = useCallback(() => {
    setAgents((p) => p.map((a) => (a.status === 'onbreak' ? { ...a, status: 'available', breakType: null, breakStartedAt: null, breakSlot: 0 } : a)))
    pushHeadline({ text: '🔄 ALL BREAKS RESET — system-wide by developer', category: 'alerts', priority: 'critical', teamId: null })
    pushLog('system_reset_all_breaks executed')
    pushAudit({ action: 'breaks_reset_all', by: `${session?.name} (${session?.role})`, target: 'system', detail: 'all active breaks cleared' })
    pushToast('All breaks reset system-wide 🔄', 'success')
  }, [session, pushAudit, pushHeadline, pushLog, pushToast])

  const triggerRally = useCallback((minutes, message) => {
    setRally({ endsAt: Date.now() + minutes * 60000, message })
    pushHeadline({ text: `🚨 RALLY MODE ACTIVE (${minutes} min) — ${message || 'everyone back on the floor!'}`, category: 'alerts', priority: 'critical', teamId: null })
    pushLog(`rally_mode_activated ${minutes}min by ${session?.email || 'unknown'}`)
    pushAudit({ action: 'rally_mode', by: `${session?.name} (${session?.role})`, target: 'all teams', detail: `${minutes} min` })
    pushToast('RALLY MODE ENGAGED 🚨', 'error')
  }, [session, pushAudit, pushHeadline, pushLog, pushToast])

  const cancelRally = useCallback(() => {
    setRally(null)
    pushLog('rally_mode_deactivated')
    pushToast('Rally mode cancelled', 'info')
  }, [pushLog, pushToast])

  const sendEmergency = useCallback((msg) => {
    setEmergency({ message: msg, sentAt: Date.now(), from: session?.name })
    pushHeadline({ text: `🚨 EMERGENCY BROADCAST: ${msg}`, category: 'alerts', priority: 'critical', teamId: null })
    pushLog(`emergency_broadcast by ${session?.email || 'unknown'}`)
  }, [session, pushHeadline, pushLog])

  const sendBroadcast = useCallback((text, target) => {
    pushHeadline({ text: `📢 ${text}`, category: 'fun', priority: 'normal', teamId: target })
    pushLog(`broadcast_sent target=${target || 'all'} by ${session?.email || 'unknown'}`)
    pushToast('Broadcast sent 📢', 'success')
  }, [session, pushHeadline, pushLog, pushToast])

  const updateConfig = useCallback((patch) => {
    setConfig((c) => ({ ...c, ...patch }))
    pushLog(`shift_config_updated ${Object.keys(patch).join(',')} by ${session?.email || 'unknown'}`)
    pushToast('Shift rules updated ✅', 'success')
  }, [pushLog, pushToast, session])

  const toggleFeature = useCallback((key) => {
    setFeatures((f) => {
      const next = { ...f, [key]: !f[key] }
      pushLog(`feature_toggle ${key}=${next[key]} by ${session?.email || 'unknown'}`)
      return next
    })
  }, [pushLog, session])

  const sendMessage = useCallback((conversationKey, text, from) => {
    const sender = from || session
    const [a, b] = conversationKey.split('__')
    const target = a === sender.email ? b : a
    setMessages((p) => [...p, { id: nextId('m'), from: sender.email, to: target, text, time: Date.now(), read: false }])
    pushLog(`message_sent ${target} by ${sender.email}`)
  }, [session, pushLog])

  const markRead = useCallback((convKey, viewerEmail) => {
    setMessages((p) => p.map((m) => ((m.from === viewerEmail || m.to === viewerEmail) ? m : m)))
  }, [])

  const acknowledgeEmergency = useCallback(() => {
    setEmergency(null)
    pushToast('Emergency acknowledged — thanks! ✅', 'success')
    pushLog(`emergency_acknowledged by ${session?.email || 'unknown'}`)
  }, [session, pushLog, pushToast])

  const toggleMaintenance = useCallback(() => {
    setMaintenance((m) => {
      pushLog(`maintenance_mode_${m ? 'off' : 'on'} by ${session?.email || 'unknown'}`)
      return !m
    })
  }, [pushLog, session])

  const markNotificationsRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, read: true }))), [])

  const value = {
    session, login, logout, switchRole, getMember,
    agents, setAgents, agentByEmail, teamAgents, capacityUsed, teamBreakTime, teamBySupervisor, getLimits,
    headlines, pushHeadline, newsOpen, setNewsOpen,
    toasts, pushToast, dismissToast,
    logs, pushLog, audit, pushAudit,
    rally, triggerRally, cancelRally,
    emergency, sendEmergency, acknowledgeEmergency,
    config, updateConfig,
    features, toggleFeature,
    messages, sendMessage, markRead,
    selectedTeamId, setSelectedTeamId,
    maintenance, toggleMaintenance,
    notifications, markNotificationsRead,
    handover, setHandover,
    now,
    startBreak, endBreak, forceEnd, toggleBlock, grantBonus, issueWarning, removeAgent, resetAllBreaks, sendBroadcast,
    shiftPhase, inRestrictedHour, fmt: null, // fmt used from lib directly
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
