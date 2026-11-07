import { formatShortDate } from '../utils/date'
import ErrorMessage from './ErrorMessage'

function Tile({ item, onOpen }) {
  return (
    <li>
      <button type="button" className="tile" onClick={() => onOpen(item.date)}>
        {item.thumbUrl ? (
          <img src={item.thumbUrl} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="tile-empty" aria-hidden="true">✦</span>
        )}
        {item.mediaType === 'video' && <span className="tile-badge">▶ Video</span>}
        <span className="tile-meta">
          <small>{formatShortDate(item.date)}</small>
          <strong>{item.title}</strong>
        </span>
      </button>
    </li>
  )
}

export default function Gallery({ items, loading, error, hasMore, onLoadMore, onOpen }) {
  const firstLoad = loading && items.length === 0

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <div className="section-head">
        <h2 id="gallery-title">Recent pictures</h2>
        <p>Newest first. Choose any picture to see it full size with NASA's explanation.</p>
      </div>

      <ul className="gallery-grid">
        {items.map((item) => (
          <Tile key={item.date} item={item} onOpen={onOpen} />
        ))}
        {firstLoad &&
          Array.from({ length: 12 }, (_, i) => (
            <li key={`s${i}`}>
              <div className="tile skeleton" />
            </li>
          ))}
      </ul>

      {error && <ErrorMessage message={error} onRetry={onLoadMore} />}

      {!error && hasMore && items.length > 0 && (
        <div className="gallery-more">
          <button type="button" className="pill-btn" onClick={onLoadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load older pictures'}
          </button>
        </div>
      )}
    </section>
  )
}
