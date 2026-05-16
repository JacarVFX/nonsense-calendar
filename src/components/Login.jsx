import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login({ onError }) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
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
