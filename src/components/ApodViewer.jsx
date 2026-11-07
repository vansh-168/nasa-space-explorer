import { formatLongDate } from '../utils/date'
import ApodMedia from './ApodMedia'

export default function ApodViewer({ apod, isFavorite, onToggleFavorite, onShare }) {
  return (
    <article className="viewer">
      <ApodMedia key={apod.date} apod={apod} />

      <div className="placard">
        <div className="placard-head">
          <p className="eyebrow">
            <time dateTime={apod.date}>{formatLongDate(apod.date)}</time>
          </p>
          <h2 className="title">{apod.title}</h2>
          {apod.creditHtml && (
            <p className="credit" dangerouslySetInnerHTML={{ __html: apod.creditHtml }} />
          )}

          <div className="actions">
            <button
              type="button"
              className={`pill-btn${isFavorite ? ' is-active' : ''}`}
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
            >
              <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span> {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button type="button" className="pill-btn" onClick={onShare}>
              Share
            </button>
            {apod.hdUrl && (
              <a className="pill-btn" href={apod.hdUrl} target="_blank" rel="noopener noreferrer">
                Full resolution ↗
              </a>
            )}
            {apod.permalink && (
              <a className="pill-btn" href={apod.permalink} target="_blank" rel="noopener noreferrer">
                On NASA ↗
              </a>
            )}
          </div>
        </div>

        {apod.explanationHtml && (
          <div className="explanation" dangerouslySetInnerHTML={{ __html: apod.explanationHtml }} />
        )}
      </div>
    </article>
  )
}
