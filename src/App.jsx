import { useState, useEffect, useCallback } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'
import EventModal from './components/EventModal'
import InstallHint from './components/InstallHint'

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function App() {
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
    const q = query(collection(db, 'events'), orderBy('date'))
    return onSnapshot(
      q,
      (snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error('[nonsense] firestore listen error:', err)
        showToast('Error de conexión con la base de datos')
      }
    )
  }, [showToast])

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
      <InstallHint />
    </div>
  )
}
