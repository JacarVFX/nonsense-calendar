import { useState, useEffect } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, deleteField,
} from 'firebase/firestore'
import { db } from '../firebase'

const CATEGORIES = [
  { value: 'grab', label: '0111 — GRABACIÓN', multiDay: true },
  { value: 'edit', label: '0112 — EDICIÓN', multiDay: true },
  { value: 'meet', label: '0113 — REUNIÓN', multiDay: false },
  { value: 'dead', label: '0114 — DEADLINE', multiDay: false },
]

const isMultiDayCat = (cat) => CATEGORIES.find((c) => c.value === cat)?.multiDay === true

export default function EventModal({ event, defaultDate, onClose, onError }) {
  const isEdit = !!event
  const [name, setName] = useState(event?.name || '')
  const [date, setDate] = useState(event?.date || defaultDate || '')
  const [dateEnd, setDateEnd] = useState(event?.dateEnd || event?.date || defaultDate || '')
  const [cat, setCat] = useState(event?.cat || 'grab')
  const [note, setNote] = useState(event?.note || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const multiDay = isMultiDayCat(cat)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Keep dateEnd >= date
  useEffect(() => {
    if (date && (!dateEnd || dateEnd < date)) setDateEnd(date)
  }, [date, dateEnd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !date) return
    if (multiDay && dateEnd < date) {
      onError('La fecha fin no puede ser antes que la fecha inicio')
      return
    }
    setSaving(true)
    console.log('[nonsense] save:start', { isEdit, cat, date, dateEnd })
    try {
      const data = {
        name: name.trim(),
        date,
        cat,
        note: note.trim(),
        updatedAt: serverTimestamp(),
      }
      if (multiDay && dateEnd && dateEnd > date) {
        data.dateEnd = dateEnd
      } else if (isEdit && event.dateEnd) {
        data.dateEnd = deleteField()
      }
      if (isEdit) {
        console.log('[nonsense] save:updateDoc')
        await updateDoc(doc(db, 'events', event.id), data)
      } else {
        console.log('[nonsense] save:addDoc')
        const ref = await addDoc(collection(db, 'events'), {
          ...data,
          createdAt: serverTimestamp(),
        })
        console.log('[nonsense] save:addDoc OK', ref.id)
      }
      console.log('[nonsense] save:done')
      onClose()
    } catch (err) {
      console.error('[nonsense] save:ERROR', err?.code, err?.message, err)
      onError(`Error al guardar: ${err?.code || err?.message || 'unknown'}`)
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!window.confirm('¿Borrar este evento? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'events', event.id))
      onClose()
    } catch (err) {
      console.error(err)
      onError('Error al borrar el evento')
      setDeleting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2 className="modal-title">
          <span className="code-tag">{isEdit ? '0302 — REGISTRO' : '0301 — REGISTRO'}</span>
          {isEdit ? 'editar trabajo' : 'nuevo trabajo'}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">0401 — NOMBRE / CLIENTE</span>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              maxLength={120}
            />
          </label>

          <label className="field">
            <span className="label">0402 — CATEGORÍA</span>
            <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>

          {multiDay ? (
            <div className="field-row">
              <label className="field">
                <span className="label">0403 — FECHA INICIO</span>
                <input
                  className="input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span className="label">0404 — FECHA FIN</span>
                <input
                  className="input"
                  type="date"
                  value={dateEnd}
                  min={date}
                  onChange={(e) => setDateEnd(e.target.value)}
                  required
                />
              </label>
            </div>
          ) : (
            <label className="field">
              <span className="label">0403 — FECHA</span>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          )}

          <label className="field">
            <span className="label">0405 — NOTAS (OPCIONAL)</span>
            <textarea
              className="input textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </label>
          <div className="modal-actions">
            {isEdit && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting ? (<><span className="oe-spin" aria-hidden="true">Ø</span> BORRANDO</>) : 'BORRAR'}
              </button>
            )}
            <div className="spacer" />
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving || deleting}>
              CANCELAR
            </button>
            <button type="submit" className="btn-primary" disabled={saving || deleting}>
              {saving ? (
                <><span className="oe-spin" aria-hidden="true">Ø</span> guardando</>
              ) : 'guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
