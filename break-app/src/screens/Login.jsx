import { useNavigate } from 'react-router-dom'
import { Shield, Zap } from 'lucide-react'
import { useApp } from '../store'
import TeamLogo, { BreakWordmark } from '../components/TeamLogo'
import GlassPanel from '../components/GlassPanel'

const DEMO_ACCOUNTS = [
  { email: 'solomon@bcflights.com', label: 'Agent', desc: 'Solomon · Team A', color: '#00FF88' },
  { email: 'omar.hassan@bcflights.com', label: 'Supervisor', desc: 'Omar · Team A', color: '#00E5FF' },
  { email: 'karim.elsayed@bcflights.com', label: 'Admin', desc: 'Karim · All teams', color: '#FF003C' },
  { email: 'adhambadraan@gmail.com', label: 'Developer', desc: 'Adham · God Mode', color: '#FFCC00' },
]

export default function Login() {
  const app = useApp()
  const nav = useNavigate()

  const signIn = (email) => {
    const member = app.getMember(email)
    if (!member) return
    app.login(member)
    nav('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="mb-10 text-center" style={{ filter: 'drop-shadow(0 0 30px rgba(255,0,60,0.35))' }}>
        <TeamLogo team={{ teamId: 'login', color: 'crimson' }} size={112} />
        <div className="mt-3"><BreakWordmark size="text-[48px]" /></div>
      </div>
      <GlassPanel material="thick" className="w-full max-w-md p-8 text-center -mt-6" glow="white">
        <h1 className="font-orbitron text-3xl font-black text-white tracking-tight-2 mb-1">BREAK</h1>
        <p className="text-sm text-zinc-400 mb-6">Sign in with your work Google account to continue.</p>

        {/* Official-style Sign in with Google button (Part 5: label is non-negotiable) */}
        <button
          onClick={() => signIn(DEMO_ACCOUNTS[0].email)}
          className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-[14.5px] font-medium text-[#1f1f1f] bg-white hover:bg-zinc-100 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          Sign in with Google
        </button>

        {app.config && (
          <p className="text-xs text-zinc-500 mt-3">Use the Google account signed into this browser profile.</p>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Demo Access · No Firebase keys</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} onClick={() => signIn(a.email)} className="glass !rounded-2xl p-3 text-left hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />
                <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest" style={{ color: a.color }}>{a.label}</span>
                {a.label === 'Developer' && <Zap size={11} className="text-gold" />}
              </div>
              <div className="text-[11.5px] text-zinc-300 group-hover:text-white transition-colors">{a.desc}</div>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10.5px] text-zinc-600">
          <Shield size={11} /> Preview mode — real Firebase Auth + Firestore swap in via env keys (see Part 5 & 26).
        </div>
      </GlassPanel>
      <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-orbitron">Night Shift · 10 PM – 6 AM · Egypt Time</div>
    </div>
  )
}
