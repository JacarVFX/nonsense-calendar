import { useState } from 'react'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const isMobile = typeof navigator !== 'undefined'
  && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default function Login({ onError }) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (err) {
      console.error(err)
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        onError('Error al iniciar sesión')
      }
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1 className="logo login-logo">NONSENSE</h1>
        <div className="subtitle">PRODUCTION CALENDAR</div>
        <div className="login-divider"></div>
        <button className="btn-primary block" onClick={handleLogin} disabled={loading}>
          {loading ? 'CONECTANDO...' : 'ENTRAR CON GOOGLE'}
        </button>
        <div className="login-foot">CADA USUARIO VE SUS PROPIOS EVENTOS</div>
      </div>
    </div>
  )
}
