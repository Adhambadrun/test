import { useState } from 'react'
import { Bell, Paintbrush, SlidersHorizontal, ShieldAlert, ScrollText, Plug } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import GlassPanel from '../components/GlassPanel'

const TABS = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'rules', label: 'Break Rules', icon: ScrollText },
  { id: 'warnings', label: 'Warning Levels', icon: ShieldAlert },
  { id: 'sound', label: 'Sound & Alerts', icon: Bell },
  { id: 'ui', label: 'UI Customization', icon: Paintbrush },
  { id: 'integrations', label: 'Integrations', icon: Plug },
]

const SOUNDS = [
  ['breakStart', 'Break start'], ['breakEnd', 'End chime'], ['bonus', 'Bonus celebration'],
  ['warning', 'Warning alert'], ['rally', 'Rally alarm'], ['message', 'Message'], ['notification', 'Notification'],
]

export default function Settings() {
  const app = useApp()
  const [tab, setTab] = useState('general')
  const [sounds, setSounds] = useState({ breakStart: true, breakEnd: true, bonus: true, warning: true, rally: true, message: true, notification: true })
  const [volume, setVolume] = useState(65)
  const [fontScale, setFontScale] = useState('M')
  const [animSpeed, setAnimSpeed] = useState('Normal')

  const isAdmin = ['admin', 'developer'].includes(app.session?.role)

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-5">
        <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2 mb-4">SETTINGS</h1>
        <div className="flex gap-5">
          <nav className="hidden md:flex flex-col gap-1 w-[210px] shrink-0 glass-thin !rounded-2xl p-2 self-start sticky top-32">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-colors ${tab === t.id ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                <t.icon size={15} style={{ color: tab === t.id ? '#00E5FF' : 'inherit' }} /> {t.label}
                {['rules', 'warnings', 'integrations'].includes(t.id) && !isAdmin && <span className="ml-auto text-[8px] font-orbitron text-gold border border-gold/30 rounded px-1">LOCKED</span>}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex md:hidden gap-1.5 overflow-x-auto mb-4 pb-1">
              {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap ${tab === t.id ? 'bg-cyan/20 text-white border border-cyan/40' : 'text-zinc-500 border border-white/10'}`}>{t.label}</button>)}
            </div>

            {tab === 'general' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">GENERAL SETTINGS</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">App name</label><input className="input-glass" defaultValue="BREAK" /></div>
                  <div><label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Default language</label>
                    <select className="input-glass" defaultValue="en"><option value="en">English</option><option value="ar">العربية (RTL)</option></select></div>
                  <div><label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Timezone</label><input className="input-glass" defaultValue="Africa/Cairo (EGY)" /></div>
                  <div><label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Date / time format</label><input className="input-glass" defaultValue="24h · DD/MM/YYYY" /></div>
                </div>
              </GlassPanel>
            )}

            {tab === 'rules' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">BREAK RULES {!isAdmin && <span className="text-[9px] text-zinc-500">· admin+ only — locked</span>}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    ['breakCapacity', 'Max agents on break', app.config.breakCapacity],
                    ['maxSlots', 'Max breaks per shift', app.config.maxSlots],
                    ['maxSlotDuration', 'Max per slot (min)', app.config.maxSlotDuration],
                    ['maxTotalBreakTime', 'Max total (min)', app.config.maxTotalBreakTime],
                    ['maxWCTime', 'Max WC / day (min)', app.config.maxWCTime],
                  ].map(([k, label, val]) => (
                    <div key={k}>
                      <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">{label}</label>
                      <input type="number" className="input-glass" value={val} disabled={!isAdmin} onChange={(e) => app.updateConfig({ [k]: Number(e.target.value) })} />
                    </div>
                  ))}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Shift start</label>
                    <input className="input-glass" defaultValue="10:00 PM" disabled={!isAdmin} />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Shift end</label>
                    <input className="input-glass" defaultValue="6:00 AM" disabled={!isAdmin} />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[12px] text-zinc-400">Restricted first hour (10–11 PM)</span>
                  <button className={`toggle ${app.config.restrictedFirstHour ? 'on' : ''}`} onClick={() => isAdmin && app.updateConfig({ restrictedFirstHour: !app.config.restrictedFirstHour })} />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[12px] text-zinc-400">Restricted last hour (5–6 AM)</span>
                  <button className={`toggle ${app.config.restrictedLastHour ? 'on' : ''}`} onClick={() => isAdmin && app.updateConfig({ restrictedLastHour: !app.config.restrictedLastHour })} />
                </div>
                {isAdmin && <button className="btn-glass btn-cyan mt-4 px-6 py-2 rounded-xl text-[12.5px] font-bold" onClick={() => app.pushToast('Shift rules saved & broadcast to clients ✅', 'success')}>Save Changes</button>}
              </GlassPanel>
            )}

            {tab === 'warnings' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">WARNING LEVELS {!isAdmin && <span className="text-[9px] text-zinc-500">· admin+ only</span>}</div>
                <div className="space-y-3">
                  {[
                    { lv: 1, name: 'Gentle Reminder', color: '#FFD700', exp: '3 clean shifts', pen: 'None — just a badge', tone: 'Friendly, funny' },
                    { lv: 2, name: 'Manager Alert', color: '#FF8800', exp: '5 clean shifts', pen: 'Budget 60→50m · slots →4', tone: 'Firm' },
                    { lv: 3, name: 'Escalate to Admin', color: '#FF003C', exp: '7 clean shifts', pen: 'Budget 40m · slots 4 · admins notified', tone: 'Serious' },
                  ].map((o) => (
                    <div key={o.lv} className="glass !rounded-2xl p-4" style={{ borderColor: `${o.color}33` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-orbitron text-[13px] font-bold" style={{ color: o.color }}>Level {o.lv} — {o.name}</div>
                        <span className="text-[10px] text-zinc-500 font-mono">{o.tone}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[11.5px]">
                        <div className="text-zinc-400">Expires: <span className="text-zinc-200">{o.exp}</span></div>
                        <div className="text-zinc-400">Penalty: <span className="text-zinc-200">{o.pen}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-zinc-500 mt-3">Custom warning templates: admin can pre-build reasons + notes for one-click issuance (Part 19.Y).</div>
              </GlassPanel>
            )}

            {tab === 'sound' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">SOUND & ALERTS</div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] text-zinc-300">Master sound</span>
                  <button className="toggle on" />
                </div>
                <div className="space-y-1.5 mb-4">
                  {SOUNDS.map(([k, label]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-[12.5px] text-zinc-300">{label} <span className="text-zinc-600 text-[10px]">· glass chime</span></span>
                      <button className={`toggle ${sounds[k] ? 'on' : ''}`} onClick={() => setSounds((s) => ({ ...s, [k]: !s[k] }))} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5"><span>Volume</span><span className="font-mono text-cyan">{volume}%</span></div>
                  <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full accent-[#00E5FF]" />
                </div>
              </GlassPanel>
            )}

            {tab === 'ui' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">UI CUSTOMIZATION</div>
                <div className="mb-4">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-2">Pod color theme</label>
                  <div className="flex gap-2">
                    {['#FF003C', '#00E5FF', '#FFCC00', '#8338EC', '#00FF88'].map((c) => (
                      <button key={c} className="w-9 h-9 rounded-full transition-transform ease-snap hover:scale-110" style={{ background: c, boxShadow: `0 0 12px ${c}88`, border: '3px solid #0a0a0c' }} onClick={() => app.pushToast('Pod theme applied 🎨', 'success')} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Font size scale</label>
                    <div className="flex gap-1.5">
                      {['S', 'M', 'L', 'XL'].map((s) => <button key={s} onClick={() => setFontScale(s)} className={`flex-1 py-2 rounded-xl font-orbitron text-[12px] ${fontScale === s ? 'bg-cyan/20 text-white border border-cyan/40' : 'text-zinc-400 border border-white/10'}`}>{s}</button>)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1.5">Animation speed</label>
                    <div className="flex gap-1.5">
                      {['Slow', 'Normal', 'Fast', 'Off'].map((s) => <button key={s} onClick={() => setAnimSpeed(s)} className={`flex-1 py-2 rounded-xl font-orbitron text-[11px] ${animSpeed === s ? 'bg-gold/20 text-white border border-gold/40' : 'text-zinc-400 border border-white/10'}`}>{s}</button>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                  <span className="text-[12.5px] text-zinc-300">Reduce motion <span className="text-zinc-600 text-[10px]">(prefers-reduced-motion)</span></span>
                  <button className="toggle" />
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[12.5px] text-zinc-300">Reduce transparency <span className="text-zinc-600 text-[10px]">(glass → solid)</span></span>
                  <button className="toggle" />
                </div>
              </GlassPanel>
            )}

            {tab === 'integrations' && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-4">INTEGRATIONS {!isAdmin && <span className="text-[9px] text-zinc-500">· admin+ only</span>}</div>
                {[
                  ['Google Calendar sync', 'Imports shift hours into your calendar'],
                  ['Slack / Discord webhooks', 'Push break & warning summaries to the team channel'],
                  ['Email notifications', 'Digest for late arrivals, warnings, and reports'],
                  ['External API keys', 'Open-Meteo weather + custom webhooks'],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-[13px] text-zinc-200">{t}</div>
                      <div className="text-[11px] text-zinc-500">{d}</div>
                    </div>
                    <button className="btn-glass !rounded-full px-4 py-1.5 text-[11px]" onClick={() => app.pushToast(`${t} — connect in full build`, 'info')}>Connect</button>
                  </div>
                ))}
              </GlassPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
