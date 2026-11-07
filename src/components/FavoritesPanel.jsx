import { useEffect, useRef, useState } from 'react'
import { formatShortDate } from '../utils/date'

function SavedThumb({ fav }) {
  const [broken, setBroken] = useState(false)
  if (fav.thumbUrl && !broken) {
    return <img className="saved-thumb" src={fav.thumbUrl} alt="" loading="lazy" onError={() => setBroken(true)} />
  }
  return (
    <span className="saved-thumb saved-thumb-empty" aria-hidden="true">
      {fav.mediaType === 'video' ? '▶' : '✦'}
    </span>
  )
}

export default function FavoritesPanel({ favorites, onSelect, onRemove, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previouslyFocused = document.activeElement
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-title"
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <h2 id="saved-title">Saved pictures</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {favorites.length === 0 ? (
          <p className="drawer-empty">Nothing saved yet. Press ☆ Save on any picture to keep it here.</p>
        ) : (
          <ul className="saved-list">
            {favorites.map((fav) => (
              <li key={fav.date}>
                <button type="button" className="saved-item" onClick={() => onSelect(fav.date)}>
                  <SavedThumb fav={fav} />
                  <span className="saved-text">
                    <strong>{fav.title}</strong>
                    <small>{formatShortDate(fav.date)}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onRemove(fav.date)}
                  aria-label={`Remove ${fav.title} from saved`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  )
}
