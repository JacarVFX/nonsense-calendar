import { useEffect, useState } from 'react'

// "Momento icónico" / portada por sesión (manual sec.5).
// NØNSENSE gigante + contador de 4 dígitos + statement.
// Skippable con click o Esc. Se autoocculta tras DURATION_MS.

const SESSION_KEY = 'nonsense:splash-seen'
const DURATION_MS = 1500
const TICKER_MS = 900

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) !== '1' } catch { return true }
  })
  const [leaving, setLeaving] = useState(false)
  const [code, setCode] = useState(0)

  useEffect(() => {
    if (!visible) return

    const start = Date.now()
    const ticker = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / TICKER_MS)
      // Curva cuadrática para que se ralentice al final, más cinematográfico
      const eased = 1 - Math.pow(1 - t, 2)
      setCode(Math.floor(eased * 9999))
      if (t >= 1) clearInterval(ticker)
    }, 28)

    const close = () => {
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
      setLeaving(true)
      setTimeout(() => setVisible(false), 280)
    }
    const timer = setTimeout(close, DURATION_MS)
    const onKey = (e) => { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') close() }
    const onClick = () => close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)

    return () => {
      clearInterval(ticker)
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`splash ${leaving ? 'leaving' : ''}`} role="status" aria-label="Cargando Nonsense">
      <div className="splash-corner tl">+</div>
      <div className="splash-corner tr">+</div>
      <div className="splash-corner bl">+</div>
      <div className="splash-corner br">+</div>

      <div className="splash-meta-top">
        <span>NS / CAL</span>
        <span>REV 0001 — 2026</span>
      </div>

      <div className="splash-inner">
        <div className="splash-code">
          <span className="splash-code-prefix">REF /</span>
          <span className="splash-code-num">{String(code).padStart(4, '0')}</span>
        </div>
        <h1 className="splash-logo">
          N<span className="splash-slashed">Ø</span>NSENSE
        </h1>
        <div className="splash-statement">sense in nonsense.</div>
      </div>

      <div className="splash-meta-bot">
        <span className="splash-dot" />
        <span>BOOT — PRODUCTION CALENDAR · 0001</span>
        <span className="splash-hint">[ESC / CLICK PARA SALTAR]</span>
      </div>
    </div>
  )
}
