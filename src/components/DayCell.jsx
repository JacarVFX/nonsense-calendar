export default function DayCell({ cell, entries, isToday, onDayClick, onEventClick }) {
  const visible = entries.slice(0, 2)
  const extra = entries.length - visible.length

  const handleCellClick = () => onDayClick(cell.dateStr)

  return (
    <div
      className={`day-cell ${!cell.inMonth ? 'out' : ''} ${isToday ? 'today' : ''}`}
      onClick={handleCellClick}
    >
      <div className="day-number">{cell.day}</div>
      <div className="events">
        {visible.map(({ ev, isFirst }) => (
          <button
            key={ev.id}
            className={`event-pill cat-${ev.cat} ${isFirst ? '' : 'cont'}`}
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
