export default function DayCell({ cell, entries, isToday, onDayClick, onEventClick }) {
  const visible = entries.slice(0, 2)
  const extra = entries.length - visible.length

  const handleCellClick = () => onDayClick(cell.dateStr)
  const isWeekend = cell.weekdayIdx >= 5            // 5 = SÁB, 6 = DOM
  const isMonday = cell.weekdayIdx === 0

  const classes = [
    'day-cell',
    !cell.inMonth ? 'out' : '',
    isToday ? 'today' : '',
    isWeekend ? 'weekend' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={handleCellClick}>
      {isMonday && cell.inMonth && (
        <span className="week-number" aria-label={`Semana ${cell.week}`}>W{String(cell.week).padStart(2, '0')}</span>
      )}
      <div className="day-number">
        {isToday && <span className="today-mark" aria-hidden="true">Ø</span>}
        {cell.day}
      </div>
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
