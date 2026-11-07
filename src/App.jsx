import { useCallback, useEffect, useState } from 'react'
import { getRandom } from './api/apod'
import ApodViewer from './components/ApodViewer'
import DateControls from './components/DateControls'
import ErrorMessage from './components/ErrorMessage'
import FavoritesPanel from './components/FavoritesPanel'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Header from './components/Header'
import ViewerSkeleton from './components/ViewerSkeleton'
import { useApod } from './hooks/useApod'
import { useFavorites } from './hooks/useFavorites'
import { useGallery } from './hooks/useGallery'
import { addDays, APOD_START_DATE, isValidApodDate, todayIso } from './utils/date'
import './App.css'

const DEFAULT_TITLE = "Space Explorer — NASA's Astronomy Picture of the Day"

// ?date=YYYY-MM-DD and ?view=gallery make every picture shareable.
function readUrl() {
  const params = new URLSearchParams(window.location.search)
  const date = params.get('date')
  return {
    date: date && isValidApodDate(date) ? date : null,
    view: params.get('view') === 'gallery' ? 'gallery' : 'day',
  }
}

function App() {
  const [date, setDate] = useState(() => readUrl().date) // null = latest
  const [view, setView] = useState(() => readUrl().view)
  const [showFavorites, setShowFavorites] = useState(false)
  const [randomLoading, setRandomLoading] = useState(false)
  const [toast, setToast] = useState('')

  const { data: apod, loading, error, latestDate, refetch } = useApod(date)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const gallery = useGallery(view === 'gallery')

  const maxDate = latestDate ?? todayIso()
  const currentDate = date ?? apod?.date ?? null
  const isLatest = !date || date === latestDate

  // Keep the address bar in sync so the current picture can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (view === 'gallery') params.set('view', 'gallery')
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [date, view])

  useEffect(() => {
    document.title = view === 'day' && apod && !loading ? `${apod.title} · Space Explorer` : DEFAULT_TITLE
  }, [view, apod, loading])

  const showToast = useCallback((message) => setToast(message), [])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const goToDate = useCallback(
    (next) => {
      setDate(next && next === latestDate ? null : next)
      setView('day')
      if (window.scrollY > 120) window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [latestDate],
  )

  const goRandom = useCallback(async () => {
    setRandomLoading(true)
    try {
      const pick = await getRandom()
      goToDate(pick.date)
    } catch (err) {
      showToast(err.message)
    } finally {
      setRandomLoading(false)
    }
  }, [goToDate, showToast])

  const share = useCallback(async () => {
    if (!apod) return
    const url = `${window.location.origin}${window.location.pathname}?date=${apod.date}`
    if (navigator.share) {
      try {
        await navigator.share({ title: apod.title, text: `${apod.title} — NASA Astronomy Picture of the Day`, url })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard')
    } catch {
      showToast(url)
    }
  }, [apod, showToast])

  // ← → change day, R picks a random picture.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (view !== 'day' || showFavorites || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowLeft' && currentDate && currentDate > APOD_START_DATE) {
        goToDate(addDays(currentDate, -1))
      } else if (event.key === 'ArrowRight' && currentDate && currentDate < maxDate) {
        goToDate(addDays(currentDate, 1))
      } else if (event.key.toLowerCase() === 'r' && !randomLoading) {
        goRandom()
      } else {
        return
      }
      event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, showFavorites, currentDate, maxDate, randomLoading, goToDate, goRandom])

  const closeFavorites = useCallback(() => setShowFavorites(false), [])

  return (
    <>
      <Header
        view={view}
        onViewChange={setView}
        onHome={() => goToDate(null)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowFavorites(true)}
      />

      <main className="main">
        {view === 'day' ? (
          <>
            <DateControls
              date={currentDate}
              maxDate={maxDate}
              isLatest={isLatest}
              onChange={goToDate}
              onLatest={() => goToDate(null)}
              onRandom={goRandom}
              randomLoading={randomLoading}
            />
            {loading ? (
              <ViewerSkeleton />
            ) : error ? (
              <ErrorMessage message={error} onRetry={refetch}>
                {date && (
                  <button type="button" className="pill-btn" onClick={() => goToDate(null)}>
                    Show the latest picture
                  </button>
                )}
              </ErrorMessage>
            ) : (
              apod && (
                <ApodViewer
                  apod={apod}
                  isFavorite={isFavorite(apod.date)}
                  onToggleFavorite={() => toggleFavorite(apod)}
                  onShare={share}
                />
              )
            )}
          </>
        ) : (
          <Gallery
            items={gallery.items}
            loading={gallery.loading}
            error={gallery.error}
            hasMore={gallery.hasMore}
            onLoadMore={gallery.loadMore}
            onOpen={goToDate}
          />
        )}
      </main>

      <Footer />

      {showFavorites && (
        <FavoritesPanel
          favorites={favorites}
          onSelect={(favDate) => {
            goToDate(favDate)
            setShowFavorites(false)
          }}
          onRemove={(favDate) => toggleFavorite({ date: favDate })}
          onClose={closeFavorites}
        />
      )}

      <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

export default App
