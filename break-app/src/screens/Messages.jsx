import { useMemo, useState, useEffect, useRef } from 'react'
import { Send, Search, ArrowLeft } from 'lucide-react'
import { useApp } from '../store'
import Header from '../components/Header'
import GlassPanel from '../components/GlassPanel'
import Avatar from '../components/Avatar'

const REPLIES = [
  'Got it. Keep the floor tight. 💪',
  'Noted — I will keep an eye on it.',
  'Copy that. How are the BQ numbers looking?',
  'Solid. Check your pod at 2 AM for a surprise 😏',
  'Thanks for the heads up. See you at the huddle.',
]

export default function Messages() {
  const app = useApp()
  const me = app.session
  const [active, setActive] = useState(null)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const boxRef = useRef(null)

  const contacts = useMemo(() => {
    const dev = app.getMember('adhambadraan@gmail.com')
    const admin = app.getMember('karim.elsayed@bcflights.com')
    const sup = app.getMember('omar.hassan@bcflights.com')
    const list = []
    if (me.role === 'agent') {
      list.push(dev, admin, sup)
      app.agents.filter((a) => a.teamId === me.teamId && a.email !== me.email).forEach((a) => list.push(a))
    } else if (me.role === 'supervisor') {
      list.push(dev, admin)
      app.agents.filter((a) => a.teamId === me.teamId).forEach((a) => list.push(a))
    } else {
      list.push(dev)
      app.agents.forEach((a) => list.push(a))
    }
    const uniq = [...new Map(list.filter(Boolean).map((c) => [c.email, c])).values()]
    return uniq.map((c) => ({ ...c, unread: app.messages.filter((m) => m.from === c.email && m.to === me.email && !m.read).length }))
  }, [me, app])

  const conv = useMemo(() => {
    if (!active) return []
    return app.messages.filter((m) => (m.from === me.email && m.to === active.email) || (m.from === active.email && m.to === me.email)).sort((a, b) => a.time - b.time)
  }, [app.messages, active, me])

  useEffect(() => { boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight }) }, [conv])

  const send = () => {
    if (!draft.trim() || !active) return
    const key = [me.email, active.email].sort().join('__')
    app.sendMessage(key, draft.trim(), me)
    setDraft('')
    setTyping(true)
    setTimeout(() => {
      app.sendMessage(key, REPLIES[Math.floor(Math.random() * REPLIES.length)], active)
      setTyping(false)
    }, 1800 + Math.random() * 1600)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-5">
        <h1 className="font-orbitron text-xl font-bold text-white tracking-tight-2 mb-4">MESSAGES</h1>
        <GlassPanel material="regular" className="overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: 480, borderRadius: 24 }}>
          <div className="flex h-full">
            {/* Contacts */}
            <div className={`w-full md:w-[280px] border-r border-white/5 ${active ? 'hidden md:block' : ''} overflow-y-auto`}>
              <div className="p-3.5 border-b border-white/5 sticky top-0 glass-thin" style={{ borderRadius: 0 }}>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input className="input-glass !pl-9 !py-2" placeholder="Search…" />
                </div>
              </div>
              {contacts.map((c) => (
                <button key={c.email} onClick={() => setActive(c)} className={`w-full flex items-center gap-3 px-3.5 py-3 border-b border-white/5 transition-colors ${active?.email === c.email ? 'bg-cyan/10' : 'hover:bg-white/5'}`}>
                  <Avatar src={c.avatar} name={c.name} size={40} status={c.role === 'agent' ? app.agentByEmail(c.email)?.status || 'available' : 'available'} />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-zinc-200 truncate">{c.name}</span>
                      {c.unread > 0 && <span className="min-w-[18px] h-[18px] w-[18px] px-1 text-center rounded-full bg-crimson text-white text-[9px] font-bold flex items-center justify-center">{c.unread}</span>}
                    </div>
                    <div className="text-[10px] font-orbitron uppercase tracking-wider" style={{ color: c.role === 'developer' ? '#FFCC00' : c.role === 'admin' ? '#FF5C7A' : c.role === 'supervisor' ? '#00E5FF' : '#00FF88' }}>{c.role}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Conversation */}
            <div className={`flex-1 flex-col ${active ? 'flex' : 'hidden md:flex'} min-w-0`}>
              {!active ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="text-[13px]">Select a contact to start chatting</div>
                  <div className="text-[10.5px] mt-1">Read receipts · typing indicators · emoji · images — all live</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass-thin" style={{ borderRadius: 0 }}>
                    <button className="md:hidden mr-1" onClick={() => setActive(null)}><ArrowLeft size={16} /></button>
                    <Avatar src={active.avatar} name={active.name} size={36} status={active.role === 'agent' ? app.agentByEmail(active.email)?.status || 'available' : 'available'} />
                    <div>
                      <div className="text-[13.5px] font-semibold text-zinc-100">{active.name}</div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: active.role === 'developer' ? '#FFCC00' : active.role === 'admin' ? '#FF5C7A' : active.role === 'supervisor' ? '#00E5FF' : '#00FF88' }}>{active.role} · {active.role === 'agent' ? app.agentByEmail(active.email)?.status : 'online'}</div>
                    </div>
                    <span className="ml-auto text-[10px] text-zinc-600 font-mono hidden sm:block">🔒 end-to-end (Firestore)</span>
                  </div>
                  <div ref={boxRef} className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    {conv.map((m) => {
                      const mine = m.from === me.email
                      return (
                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${mine ? 'text-black' : 'text-zinc-200 border border-white/10'}`} style={mine ? { background: 'linear-gradient(135deg,#00E5FF,#00B8D4)', borderRadius: '16px 16px 4px 16px', boxShadow: '0 4px 16px rgba(0,229,255,0.25)' } : { background: 'rgba(255,255,255,0.05)', borderRadius: '16px 16px 16px 4px' }}>
                            {m.text}
                            <div className={`text-[9px] mt-1 ${mine ? 'text-black/50' : 'text-zinc-600'}`}>
                              {new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(m.time))}
                              {mine && <span> · {m.read ? '✓✓' : '✓'}</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {typing && (
                      <div className="flex justify-start">
                        <div className="px-4 py-2.5 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <span className="inline-flex gap-1">
                            {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400" style={{ animation: `dot-breathe 1s ease-in-out ${i * 0.18}s infinite` }} />)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-white/5 flex items-center gap-2">
                    <input className="input-glass flex-1" placeholder={`Message ${active.name.split(' ')[0]}…`} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
                    <button className="btn-glass btn-cyan !rounded-full p-3" onClick={send} disabled={!draft.trim()} style={{ opacity: draft.trim() ? 1 : 0.4 }}>
                      <Send size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
