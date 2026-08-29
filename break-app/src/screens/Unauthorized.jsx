import { useNavigate } from 'react-router-dom'
import { useApp } from '../store'
import GlassPanel from '../components/GlassPanel'
import { BreakWordmark } from '../components/TeamLogo'

export default function Unauthorized() {
  const app = useApp()
  const nav = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BreakWordmark size="text-4xl" />
      <GlassPanel material="thick" glow="crimson" className="mt-8 w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-3">🛑</div>
        <h1 className="font-orbitron text-2xl font-black text-white tracking-tight-2 mb-1">ACCESS DENIED</h1>
        <p className="text-sm text-zinc-400 mb-4">You don't have permission to access this area.</p>
        <div className="glass !rounded-2xl p-3 mb-5 text-left">
          <div className="flex justify-between text-[12px] py-1"><span className="text-zinc-500">Your role</span><span className="font-orbitron text-[11px]" style={{ color: app.session?.role === 'developer' ? '#FFCC00' : '#00E5FF' }}>{app.session?.role || 'guest'}</span></div>
          <div className="flex justify-between text-[12px] py-1"><span className="text-zinc-500">Required</span><span className="font-orbitron text-[11px] text-crimson">higher tier</span></div>
        </div>
        <button className="btn-glass btn-cyan w-full py-3 rounded-xl text-[13px] font-bold" onClick={() => nav('/dashboard')}>Return to Dashboard</button>
        <p className="text-[10px] text-zinc-600 mt-3 font-mono">attempt logged to audit_log · 403 {JSON.stringify({ error: 'Forbidden', requiredRole: 'higher tier', currentRole: app.session?.role })}</p>
      </GlassPanel>
    </div>
  )
}
