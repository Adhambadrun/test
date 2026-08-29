import { TEAM_COLORS } from '../data/seed'

/** Animated STRIKERS team emblem — inline SVG (crisp at any size, subtle pulse like a GIF). */
export default function TeamLogo({ team, size = 64, animate = true }) {
  const color = TEAM_COLORS[team?.color] || '#FF003C'
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} style={animate ? { animation: 'breathe-soft 2.6s ease-in-out infinite' } : undefined}>
        <defs>
          <linearGradient id={`lg-${team?.teamId || 'x'}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF003C" />
            <stop offset="1" stopColor="#FFCC00" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="29" fill="rgba(8,8,10,0.85)" stroke={`url(#lg-${team?.teamId || 'x'})`} strokeWidth="2.5" />
        <circle cx="32" cy="32" r="22" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 5" />
        <path
          d="M36 12 L20 36 L30 36 L26 52 L46 27 L34 27 L38 12 Z"
          fill={`url(#lg-${team?.teamId || 'x'})`
          }
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,204,0,0.5))' }}
        />
      </svg>
    </div>
  )
}

/** BREAK wordmark with gradient */
export function BreakWordmark({ size = 'text-3xl', className = '' }) {
  return <span className={`font-orbitron font-black tracking-tight-2 text-gradient-crimson-gold ${size} ${className}`}>BREAK</span>
}
