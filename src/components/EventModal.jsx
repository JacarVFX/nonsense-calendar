import { useState, useEffect } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const CATEGORIES = [
  { value: 'grab', label: 'GRABACIÓN' },
  { value: 'meet', label: 'REUNIÓN' },
  { value: 'ent', label: 'ENTREGA' },
  { value: 'dead', label: 'DEADLINE' },
  { value: 'other', label: 'OTRO' },
]

export default function EventModal({ user, event, defaultDate, onClose, onError }) {
  const isEdit = !!event
  const [name, setName] = useState(event?.name || '')
  const [date, setDate] = useState(event?.date || defaultDate || '')
  const [cat, setCat] = useState(event?.cat || 'grab')
  const [note, setNote] = useState(event?.note || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !date) return
    setSaving(true)
    try {
      const data = {
        name: name.trim(),
        date,
        cat,
        note: note.trim(),
        updatedAt: serverTimestamp(),
      }
      if (isEdit) {
        await updateDoc(doc(db, `users/${user.uid}/events/${event.id}`), data)
      } else {
        await addDoc(collection(db, `users/${user.uid}/events`), {
          ...data,
          createdAt: serverTimestamp(),
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
      onError('Error al guardar el evento')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!window.confirm('¿Borrar este evento? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, `users/${user.uid}/events/${event.id}`))
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
        <h2 className="modal-title">{isEdit ? 'EDITAR TRABAJO' : 'NUEVO TRABAJO'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">NOMBRE / CLIENTE</span>
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
            <span className="label">FECHA</span>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="label">CATEGORÍA</span>
            <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="label">NOTAS (OPCIONAL)</span>
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
                {deleting ? 'BORRANDO...' : 'BORRAR'}
              </button>
            )}
            <div className="spacer" />
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving || deleting}>
              CANCELAR
            </button>
            <button type="submit" className="btn-primary" disabled={saving || deleting}>
              {saving ? 'GUARDANDO...' : 'GUARDAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
