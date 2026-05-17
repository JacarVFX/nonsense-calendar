// Indicador de estado en cabecera. Estética de herramienta técnica.
// status: 'ok' | 'syncing' | 'error'
export default function StatusDot({ status = 'ok' }) {
  const label = status === 'ok' ? 'SYNC OK'
              : status === 'syncing' ? 'SYNC ↻'
              : 'SYNC ERR'
  return (
    <span className={`status-dot status-${status}`} role="status" aria-label={label}>
      <span className="status-dot-mark" />
      <span className="status-dot-label">{label}</span>
    </span>
  )
}
