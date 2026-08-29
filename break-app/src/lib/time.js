// Cairo / shift time helpers
export const TZ = 'Africa/Cairo'

export function cairoNow() {
  return new Date(Date.now())
}

export function fmtTime(date = new Date(), tz = TZ, opts = {}) {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true, ...opts }).format(date)
}

export function fmtClock(date = new Date(), tz = TZ) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

export function fmtDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export function fmtMinutes(totalSeconds) {
  const m = Math.max(0, Math.floor(totalSeconds / 60))
  const h = Math.floor(m / 60)
  return h > 0 ? `${h}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`
}

/** Shift phase: { phase: 'preshift'|'active'|'postshift', startsInMin, endsInMin } */
export function shiftPhase(now = new Date()) {
  const cairo = new Date(now.toLocaleString('en-US', { timeZone: TZ }))
  const hours = cairo.getHours() + cairo.getMinutes() / 60
  // Shift runs 22:00 → 06:00
  let active = false
  let startsIn = 0
  if (hours >= 22 || hours < 6) {
    active = true
  } else {
    startsIn = 22 - hours
  }
  const endsIn = active ? (hours >= 22 ? (6 + 24 - hours) : 6 - hours) : 0
  return { phase: active ? 'active' : 'preshift', startsInMin: startsIn * 60, endsInMin: endsIn * 60 }
}

/** Restricted hours: 22:00–23:00 and 05:00–06:00 for regular breaks */
export function inRestrictedHour(now = new Date()) {
  const cairo = new Date(now.toLocaleString('en-US', { timeZone: TZ }))
  const hours = cairo.getHours() + cairo.getMinutes() / 60
  return (hours >= 22 && hours < 23) || (hours >= 5 && hours < 6)
}
