import { useEffect, useRef } from 'react'

export default function ExplanationModal({ apod, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-title"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="explanation-title">{apod.title}</h2>
        <p className="modal-date">{apod.date}</p>
        <p className="modal-explanation">{apod.explanation}</p>
      </div>
    </div>
  )
}
