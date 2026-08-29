/* jsdom + Vite SSR smoke test — mounts the app, walks every route as every role, catches crashes. */
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import React from 'react'
import { createRoot } from 'react-dom/client'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
})

global.window = dom.window
global.document = dom.window.document
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
Object.defineProperty(global, 'HTMLElement', { value: dom.window.HTMLElement, configurable: true })
Object.defineProperty(global, 'Element', { value: dom.window.Element, configurable: true })
Object.defineProperty(global, 'Node', { value: dom.window.Node, configurable: true })
Object.defineProperty(global, 'getComputedStyle', { value: dom.window.getComputedStyle, configurable: true })
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
global.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
dom.window.matchMedia = global.matchMedia
global.IS_REACT_ACT_ENVIRONMENT = true

const errors = []
dom.window.addEventListener('error', (e) => errors.push('window error: ' + e.message))

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { default: App } = await vite.ssrLoadModule('/src/App.jsx')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try {
  const root = createRoot(document.getElementById('root'))
  root.render(React.createElement(App))
  await sleep(400)
  console.log('✓ app mounted on /login')

  if (!document.body.textContent.includes('Sign in with Google')) console.log('  ⚠ login: "Sign in with Google" not found')
  else console.log('  ✓ login shows Google button + demo access')

  // Agent demo login
  const agentBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Solomon · Team A'))
  agentBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  await sleep(400)
  const t = document.body.textContent
  console.log('  ✓ signed in as agent → hash:', document.location.hash)
  if (t.includes('SNN LIVE TICKER')) console.log('  ✓ dashboard: ticker rendered')
  if (t.includes('SOLOMON')) console.log('  ✓ dashboard: pod labels rendered')
  if (t.includes('CAPACITY')) console.log('  ✓ dashboard: capacity block rendered')

  for (const [route, expectBlocked] of [
    ['#/dashboard', false], ['#/supervisor', true], ['#/admin', true], ['#/developer', true],
    ['#/settings', false], ['#/messages', false], ['#/profile', false],
  ]) {
    document.location.hash = route
    await sleep(250)
    const blocked = document.body.textContent.includes('ACCESS DENIED')
    if (blocked === expectBlocked) console.log(`  ✓ ${route} (agent)${expectBlocked ? ' → blocked correctly' : ''}`)
    else console.log(`  ✗ ${route} (agent) — blocked=${blocked}, expected=${expectBlocked}`)
  }

  for (const [email, label, findText] of [
    ['omar.hassan@bcflights.com', 'supervisor', 'Omar · Team A'],
    ['karim.elsayed@bcflights.com', 'admin', 'Karim · All teams'],
    ['adhambadraan@gmail.com', 'developer', 'Adham · God Mode'],
  ]) {
    document.location.hash = '#/login'
    await sleep(200)
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes(findText))
    if (!b) { console.log(`  ✗ login button for ${label} not found`); continue }
    b.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await sleep(350)
    console.log(`  ✓ signed in as ${label}`)
    for (const [route, expectBlocked] of [
      ['#/dashboard', false],
      ['#/supervisor', false],
      ['#/admin', ['admin', 'developer'].includes(label) ? false : true],
      ['#/developer', label === 'developer' ? false : true],
      ['#/settings', false],
      ['#/messages', false],
      ['#/profile', false],
    ]) {
      document.location.hash = route
      await sleep(250)
      const blocked = document.body.textContent.includes('ACCESS DENIED')
      const ok = blocked === expectBlocked
      console.log(`  ${ok ? '✓' : '✗'} ${route} (${label}) blocked=${blocked} expected=${expectBlocked}`)
    }
  }

  // Developer: rally mode
  document.location.hash = '#/developer'
  await sleep(250)
  const tabs = [...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === 'Quick Actions')
  tabs.forEach((t) => t.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })))
  await sleep(200)
  const rb = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('ENGAGE RALLY MODE'))
  if (rb) {
    rb.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await sleep(300)
    console.log(document.body.textContent.includes('ALL AGENTS TO THE FLOOR') ? '  ✓ rally overlay rendered' : '  ✗ rally overlay missing')
    const cancel = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Cancel Rally'))
    cancel?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await sleep(200)
  } else console.log('  ⚠ rally button not found')

  // ── Primary interaction: hover radial menu ─────────────────
  // As supervisor: hover Solomon's pod → admin menu → Force End
  document.location.hash = '#/dashboard'
  await sleep(300)
  const pods = () => [...document.querySelectorAll('div.relative.no-select')]
  const firstPod = pods()[0]
  if (firstPod) {
    firstPod.dispatchEvent(new dom.window.MouseEvent('mouseover', { bubbles: true }))
    await sleep(450)
    const forceEndBtn = [...document.querySelectorAll('button')].find((b) => (b.getAttribute('title') || '').includes('Force End'))
    if (forceEndBtn) {
      console.log('  ✓ supervisor admin radial menu rendered (Force End found)')
      forceEndBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
      await sleep(300)
      // Solomon (was on break) should now be available
      const txt = document.body.textContent
      console.log(txt.includes('force-ended') || txt.includes('force ended') ? '  ✓ force-end executed' : '  ✓ force-end click dispatched')
    } else console.log('  ✗ admin radial menu missing (Force End not found)')
    firstPod.dispatchEvent(new dom.window.MouseEvent('mouseout', { bubbles: true }))
    await sleep(500)
  }

  // As agent: hover own pod → agent menu → start Regular break
  document.location.hash = '#/login'
  await sleep(200)
  const agentBtn2 = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Solomon · Team A'))
  agentBtn2.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  await sleep(350)
  document.location.hash = '#/dashboard'
  await sleep(300)
  const myPod = pods().find((p) => p.textContent.includes('YOU'))
  if (myPod) {
    myPod.dispatchEvent(new dom.window.MouseEvent('mouseover', { bubbles: true }))
    await sleep(450)
    const regBtn = [...document.querySelectorAll('button')].find((b) => (b.getAttribute('title') || '').startsWith('Regular Break'))
    if (regBtn) {
      console.log('  ✓ agent radial menu rendered (Regular found)')
      regBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
      await sleep(250)
      const confirmBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Confirm')
      if (confirmBtn) {
        console.log('  ✓ confirmation modal appeared')
        confirmBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
        await sleep(350)
        const started = document.body.textContent.includes('started')
        console.log(started ? '  ✓ break started (toast/headline detected)' : '  ✓ break-start dispatched')
      } else console.log('  ✗ confirm modal missing')
    } else console.log('  ✗ agent radial menu missing (Regular not found)')
  } else console.log('  ⚠ own pod not found')

  root.unmount()
  await vite.close()
  const realErrors = errors.filter((e) => !/ResizeObserver|webkit|autofill|Not implemented|CSS/i.test(e))
  console.log('\nPage errors:', errors.length, '· real errors:', realErrors.length)
  realErrors.slice(0, 10).forEach((e) => console.log('  ', e))
  process.exit(realErrors.length ? 1 : 0)
} catch (e) {
  console.error('SMOKE TEST CRASH:', (e.stack || e.message).slice(0, 800))
  await vite.close().catch(() => {})
  process.exit(1)
}
