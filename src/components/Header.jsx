export default function Header({ view, onViewChange, onHome, favoritesCount, onOpenFavorites }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand"
          href="./"
          onClick={(event) => {
            event.preventDefault()
            onHome()
          }}
        >
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="6.5" fill="currentColor" />
            <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-24 16 16)" />
            <circle cx="27.4" cy="10.6" r="1.6" fill="currentColor" />
          </svg>
          <span className="brand-text">
            <strong>Space Explorer</strong>
            <small>NASA's Astronomy Picture of the Day</small>
          </span>
        </a>

        <nav className="view-tabs" aria-label="Views">
          <button
            type="button"
            aria-current={view === 'day' ? 'page' : undefined}
            onClick={() => onViewChange('day')}
          >
            Daily picture
          </button>
          <button
            type="button"
            aria-current={view === 'gallery' ? 'page' : undefined}
            onClick={() => onViewChange('gallery')}
          >
            Gallery
          </button>
        </nav>

        <button type="button" className="saved-btn" onClick={onOpenFavorites}>
          <span aria-hidden="true">★</span> Saved
          {favoritesCount > 0 && <span className="count">{favoritesCount}</span>}
        </button>
      </div>
    </header>
  )
}
