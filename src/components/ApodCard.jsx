import ApodMedia from './ApodMedia'

export default function ApodCard({ apod, isFavorite, onToggleFavorite, onShowExplanation }) {
  return (
    <article className="apod-card">
      <ApodMedia apod={apod} />
      <div className="apod-info">
        <div className="apod-info-heading">
          <h2>{apod.title}</h2>
          <button
            type="button"
            className={`favorite-btn${isFavorite ? ' is-active' : ''}`}
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        <p className="apod-date">
          {apod.date}
          {apod.copyright ? ` · © ${apod.copyright.trim()}` : ''}
        </p>
        <button type="button" className="explanation-btn" onClick={onShowExplanation}>
          View explanation
        </button>
      </div>
    </article>
  )
}
