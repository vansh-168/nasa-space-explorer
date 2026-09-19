import { useState } from 'react'
import ApodCard from './components/ApodCard'
import DateControls from './components/DateControls'
import ErrorMessage from './components/ErrorMessage'
import ExplanationModal from './components/ExplanationModal'
import FavoritesPanel from './components/FavoritesPanel'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import { useApod } from './hooks/useApod'
import { useFavorites } from './hooks/useFavorites'
import { todayIso } from './utils/date'
import './App.css'

function App() {
  const [date, setDate] = useState(todayIso())
  const [showExplanation, setShowExplanation] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  const { data: apod, loading, error, refetch } = useApod(date)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  return (
    <>
      <Header favoritesCount={favorites.length} onOpenFavorites={() => setShowFavorites(true)} />

      <main className="app-main">
        <DateControls date={date} onChange={setDate} />

        {loading && <LoadingSpinner />}
        {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}
        {!loading && !error && apod && (
          <ApodCard
            apod={apod}
            isFavorite={isFavorite(apod.date)}
            onToggleFavorite={() =>
              toggleFavorite({
                date: apod.date,
                title: apod.title,
                url: apod.url,
                media_type: apod.media_type,
              })
            }
            onShowExplanation={() => setShowExplanation(true)}
          />
        )}
      </main>

      {showExplanation && apod && (
        <ExplanationModal apod={apod} onClose={() => setShowExplanation(false)} />
      )}

      {showFavorites && (
        <FavoritesPanel
          favorites={favorites}
          onSelect={(favDate) => {
            setDate(favDate)
            setShowFavorites(false)
          }}
          onRemove={(favDate) => toggleFavorite({ date: favDate })}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </>
  )
}

export default App
