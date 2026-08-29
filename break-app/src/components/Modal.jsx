import { useEffect } from 'react'
import { X } from 'lucide-react'
import GlassPanel from './GlassPanel'

/** Modal: backdrop fade + content GLIDE scale-up from 0.96 (Part 23 UI animations). */
export default function Modal({ open, onClose, title, children, width = 480, material = 'thick' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" style={{ animation: 'overlay-in 0.2s ease both' }} onClick={onClose} />
      <GlassPanel material={material} className="anim-modal-in relative w-full max-w-full" style={{ width, maxHeight: '90vh', overflow: 'auto' }}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="font-orbitron font-bold text-white text-lg tracking-tight-2">{title}</h2>
            {onClose && (
              <button onClick={onClose} className="btn-glass !rounded-full p-2" aria-label="Close">
                <X size={16} />
              </button>
            )}
          </div>
          {children}
        </div>
      </GlassPanel>
    </div>
  )
}
