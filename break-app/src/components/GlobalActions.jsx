import { useEffect, useState } from 'react'
import { Megaphone, Siren, Check } from 'lucide-react'
import { useApp } from '../store'
import Modal from './Modal'
import GlassPanel from './GlassPanel'
import { fmtDuration } from '../lib/time'

/**
 * Global action modals wired via window bridges so any component (pods, header,
 * side panel) can open them. Also renders Emergency Broadcast + Rally overlays.
 */
export default function GlobalActions() {
  const app = useApp()
  const [warningAgent, setWarningAgent] = useState(null)
  const [removeAgent, setRemoveAgent] = useState(null)
  const [removeName, setRemoveName] = useState('')
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastText, setBroadcastText] = useState('')
  const [level, setLevel] = useState(1)
  const [reason, setReason] = useState('Slot overrun')
  const [note, setNote] = useState('')
  const [emergencyText, setEmergencyText] = useState('')

  useEffect(() => {
    window.__openWarning = (a) => { setWarningAgent(a); setLevel(1); setReason('Slot overrun'); setNote('') }
    window.__openRemove = (a) => { setRemoveAgent(a); setRemoveName('') }
    window.__openBroadcast = () => setBroadcastOpen(true)
    return () => {
      delete window.__openWarning
      delete window.__openRemove
      delete window.__openBroadcast
    }
  }, [])

  const reasons = ['Slot overrun', 'WC daily limit exceeded', 'Restricted-hour attempts', 'Total budget exceeded', 'The audacity', 'Custom…']

  return (
    <>
      {/* Issue Warning modal */}
      <Modal open={!!warningAgent} onClose={() => setWarningAgent(null)} title={`Issue Warning to ${warningAgent?.name || ''}`} width={500}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { lv: 1, name: 'Level 1', tone: 'Gentle Reminder', color: '#FFD700', pen: 'None — just a badge', ex: '“Keep it clean 😊”' },
              { lv: 2, name: 'Level 2', tone: 'Manager Alert', color: '#FF8800', pen: 'Budget 60→50m · slots →4', ex: "“Don't push it to L3.”" },
              { lv: 3, name: 'Level 3', tone: 'Escalate to Admin', color: '#FF003C', pen: 'Budget 40m · slots 4 · admins pinged', ex: '“Resets after 7 clean shifts.”' },
            ].map((o) => (
              <button key={o.lv} onClick={() => setLevel(o.lv)} className="rounded-2xl p-3 text-left transition-all ease-snap" style={{ transitionDuration: '180ms', border: `1.5px solid ${level === o.lv ? o.color : 'rgba(255,255,255,0.1)'}`, background: level === o.lv ? `${o.color}1a` : 'rgba(255,255,255,0.03)', transform: level === o.lv ? 'scale(1.03)' : 'scale(1)', boxShadow: level === o.lv ? `0 0 24px ${o.color}33` : undefined }}>
                <div className="font-orbitron text-[13px] font-bold" style={{ color: o.color }}>{o.name}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{o.tone}</div>
                <div className="text-[9.5px] text-zinc-500 mt-1 leading-snug">{o.pen}</div>
                <div className="text-[9.5px] text-zinc-600 italic mt-1">{o.ex}</div>
              </button>
            ))}
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Reason</label>
            <select className="input-glass" value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasons.map((r) => <option key={r} className="bg-zinc-900">{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Custom note (max 300)</label>
            <textarea className="input-glass resize-none" rows={3} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Firm but funny. Never HR-speak." />
          </div>
          <div className="glass !rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Preview</div>
            <p className="text-[12.5px] text-zinc-200 leading-snug">
              Hey {warningAgent?.name.split(' ')[0]}, you have been warned! 👋 <span style={{ color: level === 1 ? '#FFD700' : level === 2 ? '#FF8800' : '#FF003C' }}>Level {level}.</span>{' '}
              {level === 1 ? 'Keep it clean 😊' : level === 2 ? 'Budget cut. Do not push it to L3.' : 'Admins notified. 40 min budget. Resets after 7 clean shifts.'} {note && `— ${note}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-glass btn-crimson flex-1 py-2.5 rounded-xl text-[13px] font-bold" onClick={() => { app.issueWarning(warningAgent.email, level, reason, note); setWarningAgent(null) }}>
              ⚠️ Issue Warning
            </button>
            <button className="btn-glass flex-1 py-2.5 rounded-xl text-[13px]" onClick={() => setWarningAgent(null)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Remove agent modal */}
      <Modal open={!!removeAgent} onClose={() => setRemoveAgent(null)} title={`Remove ${removeAgent?.name || ''}?`} width={420}>
        <p className="text-[13px] text-zinc-400 mb-3">This removes the agent from the roster. Type <b className="text-white">{removeAgent?.name}</b> to confirm — no undo, no mercy.</p>
        <input className="input-glass mb-4" placeholder="Type agent name…" value={removeName} onChange={(e) => setRemoveName(e.target.value)} />
        <div className="flex gap-2">
          <button disabled={removeName !== removeAgent?.name} className="btn-glass btn-crimson flex-1 py-2.5 rounded-xl text-[13px] font-bold disabled:opacity-40" onClick={() => { app.removeAgent(removeAgent.email); setRemoveAgent(null) }}>
            🗑️ Remove from Team
          </button>
          <button className="btn-glass flex-1 py-2.5 rounded-xl text-[13px]" onClick={() => setRemoveAgent(null)}>Cancel</button>
        </div>
      </Modal>

      {/* Broadcast modal (admin+) */}
      <Modal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Send Broadcast 📢" width={440}>
        <textarea className="input-glass resize-none mb-3" rows={3} value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} placeholder="Motivational blast or important announcement…" />
        <div className="flex gap-2 mb-4">
          <button className="btn-glass flex-1 py-2 rounded-xl text-[12px]" onClick={() => app.sendBroadcast(broadcastText || 'Stay sharp, stay focused. 🔥', app.selectedTeamId)}>To Selected Team</button>
          <button className="btn-glass btn-crimson flex-1 py-2 rounded-xl text-[12px]" onClick={() => { app.sendEmergency(broadcastText || 'Everyone to the floor. NOW.'); setBroadcastOpen(false) }}>🚨 Emergency</button>
        </div>
        <button className="btn-glass btn-cyan w-full py-2.5 rounded-xl text-[13px] font-bold" onClick={() => { app.sendBroadcast(broadcastText || 'Stay sharp, stay focused. 🔥', null); setBroadcastOpen(false) }}>Broadcast to All Teams</button>
      </Modal>

      {/* Emergency overlay */}
      {app.emergency && (
        <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center text-center p-6" style={{ background: 'rgba(120,0,25,0.35)', backdropFilter: 'blur(8px)', animation: 'overlay-in 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
          <GlassPanel material="ultrathick" glow="crimson" className="max-w-md w-full p-8 text-center" style={{ borderColor: 'rgba(255,0,60,0.6)', boxShadow: '0 0 80px rgba(255,0,60,0.5)' }}>
            <Siren size={48} color="#FF003C" style={{ filter: 'drop-shadow(0 0 18px rgba(255,0,60,0.9))', animation: 'breathe 1.4s ease-in-out infinite', margin: '0 auto 14px' }} />
            <div className="font-orbitron text-2xl font-black text-white tracking-tight-2 mb-1">🚨 EMERGENCY BROADCAST</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-crimson mb-4">from {app.emergency.from}</div>
            <p className="text-zinc-100 text-lg font-medium leading-snug mb-6">“{app.emergency.message}”</p>
            <button className="btn-glass btn-crimson w-full py-3 rounded-xl font-bold text-[14px]" onClick={app.acknowledgeEmergency}>
              <Check size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />ACKNOWLEDGE
            </button>
          </GlassPanel>
        </div>
      )}

      {/* Rally Mode overlay */}
      {app.rally && (
        <div className="fixed inset-0 z-[96] flex flex-col items-center justify-center text-center p-6" style={{ background: 'radial-gradient(ellipse at center, rgba(90,0,15,0.6), rgba(0,0,0,0.92))', backdropFilter: 'blur(10px)', animation: 'overlay-in 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div className="relative">
            <div className="absolute inset-0" style={{ border: '2px solid rgba(255,0,60,0.4)', borderRadius: 999, animation: 'pulse-glow 1.2s ease-in-out infinite' }} />
            <div className="font-orbitron text-[80px] font-black text-crimson leading-none" style={{ textShadow: '0 0 60px rgba(255,0,60,1), 0 0 120px rgba(255,0,60,0.6)' }}>RALLY</div>
          </div>
          <div className="font-orbitron text-lg text-white tracking-[0.35em] mt-2">ALL AGENTS TO THE FLOOR</div>
          <p className="text-zinc-300 mt-3 max-w-md text-[15px]">{app.rally.message || 'No breaks. No excuses. Let us crush this.'}</p>
          <div className="font-mono text-3xl text-gold mt-5" style={{ textShadow: '0 0 20px rgba(255,204,0,0.6)' }}>
            {fmtDuration(Math.max(0, (app.rally.endsAt - Date.now()) / 1000))}
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">until unlock</div>
          <button className="btn-glass !rounded-full px-6 py-2 mt-6 text-[12px]" onClick={app.cancelRally}>Cancel Rally</button>
        </div>
      )}
    </>
  )
}
