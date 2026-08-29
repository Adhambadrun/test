import { useState } from 'react'
import { Camera, Crown, Target } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import GlassPanel from '../components/GlassPanel'
import Avatar from '../components/Avatar'
import { MiniBars } from '../components/Charts'
import { TEAMS } from '../data/seed'

const PRESET_AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
]

export default function Profile() {
  const app = useApp()
  const me = app.session
  const agent = me.role === 'agent' ? app.agentByEmail(me.email) : null
  const [picOpen, setPicOpen] = useState(false)
  const [motto, setMotto] = useState(me.personalMotto || agent?.personalMotto || '')
  const [emoji, setEmoji] = useState(me.powerEmoji || agent?.powerEmoji || '⚡')

  const team = me.role === 'agent' ? TEAMS.find((t) => t.teamId === me.teamId) : app.teamBySupervisor(me.email)
  const stats = agent || { totalBreakTime: me.role === 'supervisor' ? 214 : 0, slotsUsed: 0, wcTime: 0, warnings: [], bonusGranted: true, goalProgress: 80 }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[980px] mx-auto px-4 md:px-6 py-5">
        <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2 mb-4">MY PROFILE</h1>
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          {/* Identity card */}
          <GlassPanel material="regular" className="p-6 text-center self-start">
            <div className="relative w-fit mx-auto mb-3">
              <Avatar src={me.avatar} name={me.name} size={128} ring="crimson" status={agent?.status} />
              <button className="absolute bottom-1 right-1 btn-glass !rounded-full p-2" title="Change picture" onClick={() => setPicOpen(true)}>
                <Camera size={14} />
              </button>
            </div>
            <div className="font-orbitron text-xl font-bold text-white tracking-tight-2">{me.name} {emoji}</div>
            <div className="text-[10px] font-orbitron uppercase tracking-[0.25em] mt-1" style={{ color: me.role === 'developer' ? '#FFCC00' : me.role === 'admin' ? '#FF5C7A' : me.role === 'supervisor' ? '#00E5FF' : '#00FF88' }}>{me.role}</div>
            {team && <div className="text-[11px] text-zinc-500 mt-1">{team.teamName}</div>}
            {me.role === 'developer' && <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-orbitron text-gold px-2.5 py-1 rounded-full border border-gold/40 bg-gold/10"><Crown size={11} /> TIER 1 · GOD ACCESS</div>}
            <div className="mt-4 text-left">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-1">Personal motto (max 50)</label>
              <input className="input-glass mb-2" maxLength={50} value={motto} onChange={(e) => setMotto(e.target.value)} />
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 block mb-1">Power emoji</label>
              <input className="input-glass" maxLength={2} value={emoji} onChange={(e) => setEmoji(e.target.value)} />
              <button className="btn-glass btn-cyan w-full mt-3 py-2 rounded-xl text-[12px] font-bold" onClick={() => { app.pushToast('Profile updated ✅', 'success') }}>Save Profile</button>
            </div>
          </GlassPanel>

          {/* Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['Total Break Time', `${Math.round(stats.totalBreakTime)}m`, '#FFCC00'],
                ['Slots Used', `${stats.slotsUsed}`, '#00E5FF'],
                ['Warnings', `${stats.warnings.length}`, stats.warnings.length > 0 ? '#FF8800' : '#00FF88'],
                ['Bonus Breaks', stats.bonusGranted ? '1' : '0', '#00FF88'],
              ].map(([l, v, c]) => (
                <GlassPanel key={l} material="regular" className="p-4 text-center">
                  <div className="font-teko text-4xl font-semibold leading-none" style={{ color: c, textShadow: `0 0 16px ${c}44` }}>{v}</div>
                  <div className="text-[9.5px] uppercase tracking-[0.18em] text-zinc-500 mt-1.5">{l}</div>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel material="regular" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-gold" />
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold">TONIGHT'S GOAL — {stats.goalProgress}%</div>
              </div>
              <div className="h-[8px] rounded-full bg-white/10 overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${stats.goalProgress}%`, background: 'linear-gradient(90deg,#FF003C,#FFCC00)', boxShadow: '0 0 12px rgba(255,204,0,0.5)' }} />
              </div>
              <div className="text-[11.5px] text-zinc-400">Set your goal at shift start. Hit 100% and the end-of-shift celebration triggers 🎉</div>
              <div className="flex gap-2 mt-3">
                {[40, 60, 80, 100].map((g) => <button key={g} className="btn-glass flex-1 py-1.5 rounded-xl text-[11px]" onClick={() => app.pushToast(`Goal set to ${g}% 🎯`, 'success')}>{g}%</button>)}
              </div>
            </GlassPanel>

            <GlassPanel material="regular" className="p-5">
              <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">BREAKS PER DAY — THIS MONTH</div>
              <MiniBars data={[4, 6, 5, 7, 6, 8, 5, 6, 7, 5, 6, 4, 5, 6, 7, 5]} color="#FF003C" height={90} />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono"><span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Today</span></div>
            </GlassPanel>

            {stats.warnings.length > 0 && (
              <GlassPanel material="regular" className="p-5">
                <div className="font-orbitron text-[11px] tracking-[0.2em] text-gold mb-3">MY WARNINGS</div>
                {stats.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span>{w.level === 1 ? '⚠️' : w.level === 2 ? '🔶' : '🟥'}</span>
                    <div className="flex-1">
                      <div className="text-[12.5px] text-zinc-200">{w.reason}</div>
                      <div className="text-[10px] text-zinc-500">Level {w.level} · {new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: 'numeric', minute: '2-digit' }).format(new Date(w.issuedAt))}</div>
                    </div>
                    <button className="btn-glass !rounded-full px-3 py-1 text-[10.5px]" onClick={() => app.pushToast('Appeal submitted — max 2 per shift 🙏', 'info')}>Appeal</button>
                  </div>
                ))}
              </GlassPanel>
            )}
          </div>
        </div>
      </div>

      {/* Change picture modal */}
      {picOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setPicOpen(false)} />
          <GlassPanel material="thick" className="anim-modal-in relative p-6 w-[380px]">
            <div className="font-orbitron text-[15px] font-bold text-white mb-3">CHANGE PICTURE</div>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {PRESET_AVATARS.map((src) => (
                <button key={src} onClick={() => { app.pushToast('Profile picture updated ✅', 'success'); setPicOpen(false) }} className="rounded-full overflow-hidden hover:scale-105 transition-transform ease-snap" style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.15)' }}>
                  <img src={src} alt="preset" className="w-full aspect-square object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <button className="btn-glass btn-cyan w-full py-2.5 rounded-xl text-[12.5px] font-bold" onClick={() => app.pushToast('Drag & drop uploader (crop tool) in full build 📷', 'info')}>Upload Photo</button>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}
