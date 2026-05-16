import { useState } from 'react'

const DISMISS_KEY = 'nonsense:install-hint-dismissed'

function detectShow() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !window.MSStream
  if (!isIOS) return false
  const isStandalone = window.navigator.standalone === true
    || window.matchMedia?.('(display-mode: standalone)').matches
  if (isStandalone) return false
  try {
    if (window.localStorage.getItem(DISMISS_KEY) === '1') return false
  } catch { /* localStorage may be blocked in private mode — show anyway */ }
  return true
}

export default function InstallHint() {
  const [show, setShow] = useState(detectShow)

  if (!show) return null

  const dismiss = () => {
    try { window.localStorage.setItem(DISMISS_KEY, '1') } catch {}
    setShow(false)
  }

  return (
    <div className="install-hint">
      <div className="install-hint-text">
        Para usarlo como <strong>app sin barra</strong>: toca{' '}
        <svg className="install-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Compartir → "Añadir a pantalla de inicio"
      </div>
      <button className="install-hint-close" onClick={dismiss} aria-label="Cerrar">×</button>
    </div>
  )
}
