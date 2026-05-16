export default function DayCell({ cell, events, isToday, onDayClick, onEventClick }) {
  const visible = events.slice(0, 2)
  const extra = events.length - visible.length

  const handleCellClick = () => onDayClick(cell.dateStr)

  return (
    <div
      className={`day-cell ${!cell.inMonth ? 'out' : ''} ${isToday ? 'today' : ''}`}
      onClick={handleCellClick}
    >
      <div className="day-number">{cell.day}</div>
      <div className="events">
        {visible.map((ev) => (
          <button
            key={ev.id}
            className={`event-pill cat-${ev.cat}`}
            onClick={(e) => { e.stopPropagation(); onEventClick(ev) }}
            title={ev.name}
          >
            {ev.name}
          </button>
        ))}
        {extra > 0 && (
          <div className="more" onClick={(e) => e.stopPropagation()}>+{extra} más</div>
        )}
      </div>
    </div>
  )
}
