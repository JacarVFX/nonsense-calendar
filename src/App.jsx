import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { auth, db } from './firebase'
import Login from './components/Login'
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
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [defaultDate, setDefaultDate] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady(true)
    })
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error('Redirect sign-in error:', err)
      showToast('Error al completar el inicio de sesión')
    })
  }, [showToast])

  useEffect(() => {
    if (!user) {
      setEvents([])
      return
    }
    const q = query(collection(db, `users/${user.uid}/events`), orderBy('date'))
    return onSnapshot(
      q,
      (snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error('Firestore error:', err)
        showToast('Error de conexión con la base de datos')
      }
    )
  }, [user, showToast])

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

  if (!user) {
    return <Login onError={showToast} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo-block">
          <h1 className="logo">NONSENSE</h1>
          <div className="subtitle">PRODUCTION CALENDAR</div>
        </div>
        <div className="user-block">
          <span className="user-email">{user.email}</span>
          <button className="btn-ghost" onClick={() => signOut(auth)}>SALIR</button>
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
          user={user}
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
