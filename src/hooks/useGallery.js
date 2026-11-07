import { useCallback, useEffect, useRef, useState } from 'react'
import { getRecent } from '../api/apod'

// Loads recent pictures page by page, starting the first time the
// gallery is opened.
export function useGallery(active) {
  const [items, setItems] = useState([])
  const [nextPage, setNextPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inFlight = useRef(false)

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore) return
    inFlight.current = true
    setLoading(true)
    setError(null)
    try {
      const { items: batch, totalPages } = await getRecent(nextPage)
      setItems((current) => {
        const seen = new Set(current.map((item) => item.date))
        return [...current, ...batch.filter((item) => !seen.has(item.date))]
      })
      setHasMore(nextPage < totalPages)
      setNextPage((page) => page + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }, [nextPage, hasMore])

  const started = useRef(false)
  useEffect(() => {
    if (active && !started.current) {
      started.current = true
      loadMore()
    }
  }, [active, loadMore])

  return { items, loading, error, hasMore, loadMore }
}
