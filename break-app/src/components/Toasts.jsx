import { useApp } from '../store'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const KINDS = {
  success: { icon: CheckCircle2, color: '#00FF88', glow: 'glow-green' },
  error: { icon: AlertTriangle, color: '#FF003C', glow: 'glow-crimson' },
  info: { icon: Info, color: '#00E5FF', glow: 'glow-cyan' },
}

export default function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((t) => {
        const k = KINDS[t.kind] || KINDS.info
        const Icon = k.icon
        return (
          <div key={t.id} className={`glass-thick anim-toast-in pointer-events-auto ${k.glow}`} style={{ padding: '12px 14px', borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon size={18} color={k.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-zinc-100 leading-snug">{t.text}</p>
              <div className="mt-2 h-[3px] rounded-full overflow-hidden bg-white/5">
                <div className="h-full rounded-full" style={{ width: '100%', background: k.color, animation: 'toast-drain 4.2s linear forwards', opacity: 0.7 }} />
              </div>
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-zinc-500 hover:text-white transition-colors" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )
      })}
      <style>{`@keyframes toast-drain { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  )
}
