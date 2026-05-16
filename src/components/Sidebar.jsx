const M_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function formatShortDate(d) {
  const [, m, day] = d.split('-')
  return `${day} ${M_SHORT[parseInt(m, 10) - 1]}`
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function Sidebar({ currentDate, events, onNewEvent, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthEvents = events.filter((ev) => {
    const [y, m] = ev.date.split('-').map(Number)
    return y === year && m === month + 1
  })

  const stats = {
    total: monthEvents.length,
    grab: monthEvents.filter((e) => e.cat === 'grab').length,
    ent: monthEvents.filter((e) => e.cat === 'ent').length,
  }

  const today = todayStr()
  const upcoming = events
    .filter((e) => e.date >= today)
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
          <span className="stat-label">ENTREGAS</span>
          <span className="stat-val">{stats.ent}</span>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">CATEGORÍAS</h3>
        <div className="legend">
          <div className="legend-item"><span className="dot cat-grab" /><span>GRABACIÓN</span></div>
          <div className="legend-item"><span className="dot cat-meet" /><span>REUNIÓN</span></div>
          <div className="legend-item"><span className="dot cat-ent" /><span>ENTREGA</span></div>
          <div className="legend-item"><span className="dot cat-dead" /><span>DEADLINE</span></div>
          <div className="legend-item"><span className="dot cat-other" /><span>OTRO</span></div>
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
                  <div className="upcoming-date">{formatShortDate(ev.date)}</div>
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
