import DayCell from './DayCell'

const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]
const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

function pad2(n) { return String(n).padStart(2, '0') }
function fmt(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}` }

export default function Calendar({ currentDate, setCurrentDate, events, onDayClick, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Monday-first weekday index: JS getDay() is Sun=0..Sat=6, we want Mon=0..Sun=6
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrev - firstWeekday + 1 + i
    const d = new Date(year, month - 1, day)
    cells.push({ day, dateStr: fmt(d.getFullYear(), d.getMonth(), day), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: fmt(year, month, d), inMonth: true })
  }
  let nd = 1
  while (cells.length < 42) {
    const d = new Date(year, month + 1, nd)
    cells.push({ day: nd, dateStr: fmt(d.getFullYear(), d.getMonth(), nd), inMonth: false })
    nd++
  }

  const today = new Date()
  const todayStr = fmt(today.getFullYear(), today.getMonth(), today.getDate())

  const byDate = {}
  for (const ev of events) {
    if (!byDate[ev.date]) byDate[ev.date] = []
    byDate[ev.date].push(ev)
  }

  const prev = () => setCurrentDate(new Date(year, month - 1, 1))
  const next = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  return (
    <section className="calendar">
      <div className="calendar-nav">
        <button className="btn-ghost" onClick={prev} aria-label="Mes anterior">← PREV</button>
        <div className="month-title-wrap">
          <h2 className="month-title">{MONTHS[month]} <span className="year">{year}</span></h2>
          <button className="btn-today" onClick={goToday}>HOY</button>
        </div>
        <button className="btn-ghost" onClick={next} aria-label="Mes siguiente">NEXT →</button>
      </div>
      <div className="weekday-row">
        {WEEKDAYS.map((w) => <div key={w} className="weekday">{w}</div>)}
      </div>
      <div className="grid">
        {cells.map((cell, i) => (
          <DayCell
            key={i}
            cell={cell}
            events={byDate[cell.dateStr] || []}
            isToday={cell.dateStr === todayStr}
            onDayClick={onDayClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </section>
  )
}
