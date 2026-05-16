const M_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function formatShortDate(d) {
  const [, m, day] = d.split('-')
  return `${day} ${M_SHORT[parseInt(m, 10) - 1]}`
}

function formatRange(start, end) {
  if (!end || end === start) return formatShortDate(start)
  return `${formatShortDate(start)} → ${formatShortDate(end)}`
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// An event "is in month" if its date range overlaps the given month
function overlapsMonth(ev, year, month) {
  const start = ev.date
  const end = ev.dateEnd || ev.date
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return end >= monthStart && start <= monthEnd
}

export default function Sidebar({ currentDate, events, onNewEvent, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthEvents = events.filter((ev) => overlapsMonth(ev, year, month))

  const stats = {
    total: monthEvents.length,
    grab: monthEvents.filter((e) => e.cat === 'grab').length,
    edit: monthEvents.filter((e) => e.cat === 'edit').length,
    dead: monthEvents.filter((e) => e.cat === 'dead').length,
  }

  const today = todayStr()
  const upcoming = events
    .filter((e) => (e.dateEnd || e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  return (
    <aside className="sidebar">
      <button className="btn-primary block" onClick={onNewEvent}>+ AÑADIR TRABAJO</button>

      <div className="panel">
        <h3 className="panel-title">ESTADÍSTICAS DEL MES</h3>
        <div className="stat-row">
          <span className="stat-label">TOTAL</span>
          <span className="stat-val">{stats.total}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">GRABACIONES</span>
          <span className="stat-val">{stats.grab}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">EDICIONES</span>
          <span className="stat-val">{stats.edit}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">DEADLINES</span>
          <span className="stat-val">{stats.dead}</span>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">CATEGORÍAS</h3>
        <div className="legend">
          <div className="legend-item"><span className="dot cat-grab" /><span>GRABACIÓN</span></div>
          <div className="legend-item"><span className="dot cat-edit" /><span>EDICIÓN</span></div>
          <div className="legend-item"><span className="dot cat-meet" /><span>REUNIÓN</span></div>
          <div className="legend-item"><span className="dot cat-dead" /><span>DEADLINE</span></div>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">PRÓXIMOS</h3>
        {upcoming.length === 0 ? (
          <div className="empty">SIN EVENTOS PRÓXIMOS</div>
        ) : (
          <div className="upcoming-list">
            {upcoming.map((ev) => (
              <button key={ev.id} className="upcoming-item" onClick={() => onEventClick(ev)}>
                <span className={`dot cat-${ev.cat}`} />
                <div className="upcoming-info">
                  <div className="upcoming-date">{formatRange(ev.date, ev.dateEnd)}</div>
                  <div className="upcoming-name">{ev.name}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
