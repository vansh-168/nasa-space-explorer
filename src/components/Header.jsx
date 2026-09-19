export default function Header({ favoritesCount, onOpenFavorites }) {
  return (
    <header className="app-header">
      <div>
        <h1>NASA Space Explorer</h1>
        <p>Astronomy Picture of the Day</p>
      </div>
      <button type="button" className="favorites-toggle" onClick={onOpenFavorites}>
        ★ Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
      </button>
    </header>
  )
}
