export default function FavoritesPanel({ favorites, onSelect, onRemove, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal favorites-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="favorites-title">Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet. Star a picture to save it here.</p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((fav) => (
              <li key={fav.date}>
                <button type="button" className="favorites-item" onClick={() => onSelect(fav.date)}>
                  {fav.media_type === 'video' ? (
                    <span className="favorites-thumb favorites-thumb-video" aria-hidden="true">
                      ▶
                    </span>
                  ) : (
                    <img className="favorites-thumb" src={fav.url} alt="" />
                  )}
                  <span>
                    <strong>{fav.title}</strong>
                    <small>{fav.date}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="favorites-remove"
                  onClick={() => onRemove(fav.date)}
                  aria-label={`Remove ${fav.title} from favorites`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
