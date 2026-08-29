/** Lightweight SVG area/line chart — gold gradient line, no external chart lib. */
export function AreaChart({ data, height = 180, color = '#FFCC00', labels = true }) {
  const w = 600
  const h = height
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => [i === 0 ? 6 : (i / (data.length - 1)) * (w - 12), h - 12 - (v / max) * (h - 30)])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]},${h - 8} L${pts[0][0]},${h - 8} Z`
  const gid = `grad-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#050505" stroke={color} strokeWidth="1.5" />
      ))}
      {labels && (
        <g fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="Inter">
          <text x="4" y={h - 2}>22:00</text>
          <text x={w * 0.25 - 12} y={h - 2}>00:00</text>
          <text x={w * 0.5 - 12} y={h - 2}>02:00</text>
          <text x={w * 0.75 - 12} y={h - 2}>04:00</text>
          <text x={w - 44} y={h - 2}>06:00</text>
        </g>
      )}
    </svg>
  )
}

export function MiniBars({ data, color = '#FF003C', height = 60 }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}33)`, minHeight: 3 }} />
      ))}
    </div>
  )
}
