export default function Avatar({ src, name, size = 48, ring = 'gradient', status, className = '' }) {
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <div
        className="rounded-full p-[2px]"
        style={{
          background: ring === 'crimson' ? 'linear-gradient(135deg,#FF003C,#FFCC00)' : ring === 'cyan' ? 'linear-gradient(135deg,#00E5FF,#3A86FF)' : 'linear-gradient(135deg,#FF003C,#FFCC00)',
        }}
      >
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="rounded-full object-cover bg-black"
          style={{ width: size - 4, height: size - 4, border: '2px solid #0a0a0c' }}
          onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=1a1a1f&color=fff&size=128&bold=true` }}
        />
      </div>
      {status && (
        <span
          className="absolute rounded-full anim-dot-breathe"
          style={{
            bottom: 0,
            right: 0,
            width: Math.max(10, size * 0.22),
            height: Math.max(10, size * 0.22),
            background: status === 'onbreak' ? '#00E5FF' : status === 'blocked' ? '#FF003C' : '#00FF88',
            border: '2px solid #050505',
            boxShadow: `0 0 10px ${status === 'onbreak' ? '#00E5FF' : status === 'blocked' ? '#FF003C' : '#00FF88'}`,
          }}
        />
      )}
    </div>
  )
}
