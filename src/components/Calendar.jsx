import DayCell from './DayCell'

const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]
const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

function pad2(n) { return String(n).padStart(2, '0') }
function fmt(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}` }

function expandEventDays(ev) {
  if (!ev.dateEnd || ev.dateEnd <= ev.date) return [{ dateStr: ev.date, isFirst: true }]
  const [y1, m1, d1] = ev.date.split('-').map(Number)
  const [y2, m2, d2] = ev.dateEnd.split('-').map(Number)
  const start = new Date(y1, m1 - 1, d1)
  const end = new Date(y2, m2 - 1, d2)
  const out = []
  const cur = new Date(start)
  let first = true
  while (cur <= end) {
    out.push({
      dateStr: fmt(cur.getFullYear(), cur.getMonth(), cur.getDate()),
      isFirst: first,
    })
    cur.setDate(cur.getDate() + 1)
    first = false
  }
  return out
}

export default function Calendar({ currentDate, setCurrentDate, events, onDayClick, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

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

  // Index events by date, including each day for multi-day events
  const byDate = {}
  for (const ev of events) {
    for (const { dateStr, isFirst } of expandEventDays(ev)) {
      if (!byDate[dateStr]) byDate[dateStr] = []
      byDate[dateStr].push({ ev, isFirst })
    }
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
            entries={byDate[cell.dateStr] || []}
            isToday={cell.dateStr === todayStr}
            onDayClick={onDayClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </section>
  )
}
