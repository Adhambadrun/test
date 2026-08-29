const MATERIALS = {
  ultrathin: 'glass-ultrathin',
  thin: 'glass-thin',
  regular: 'glass',
  thick: 'glass-thick',
  ultrathick: 'glass-ultrathick',
}

const GLOWS = {
  none: '',
  cyan: 'glow-cyan',
  crimson: 'glow-crimson',
  gold: 'glow-gold',
  green: 'glow-green',
  yellow: 'glow-yellow',
  orange: 'glow-orange',
  white: 'glow-white',
}

export default function GlassPanel({ material = 'regular', glow = 'none', className = '', style, children, ...rest }) {
  return (
    <div className={`${MATERIALS[material]} ${GLOWS[glow]} ${className}`} style={style} {...rest}>
      {children}
    </div>
  )
}
