import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { auth, db } from './firebase'
import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'
import EventModal from './components/EventModal'

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function App() {
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [defaultDate, setDefaultDate] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setAuthReady(true)
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error('Anonymous sign-in failed:', err)
          setAuthError(
            err?.code === 'auth/admin-restricted-operation'
              ? 'Activa "Anonymous" en Firebase Console → Authentication → Sign-in method.'
              : 'No se pudo conectar con la base de datos. Recarga la página.'
          )
          setAuthReady(true)
        })
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!authReady || authError) return
    const q = query(collection(db, 'events'), orderBy('date'))
    return onSnapshot(
      q,
      (snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error('Firestore error:', err)
        showToast('Error de conexión con la base de datos')
      }
    )
  }, [authReady, authError, showToast])

  const openNewEvent = useCallback((dateStr) => {
    setEditingEvent(null)
    setDefaultDate(dateStr)
    setModalOpen(true)
  }, [])

  const openEditEvent = useCallback((event) => {
    setEditingEvent(event)
    setDefaultDate(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingEvent(null)
    setDefaultDate(null)
  }, [])

  if (!authReady) {
    return (
      <div className="loading-screen">
        <div className="logo">NONSENSE</div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="loading-screen">
        <div className="login-box">
          <h1 className="logo login-logo">NONSENSE</h1>
          <div className="subtitle">PRODUCTION CALENDAR</div>
          <div className="login-divider"></div>
          <div className="auth-error">{authError}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo-block">
          <h1 className="logo">NONSENSE</h1>
          <div className="subtitle">PRODUCTION CALENDAR</div>
        </div>
      </header>

      <main className="main">
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          onDayClick={openNewEvent}
          onEventClick={openEditEvent}
        />
        <Sidebar
          currentDate={currentDate}
          events={events}
          onNewEvent={() => openNewEvent(todayStr())}
          onEventClick={openEditEvent}
        />
      </main>

      {modalOpen && (
        <EventModal
          event={editingEvent}
          defaultDate={defaultDate}
          onClose={closeModal}
          onError={showToast}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
