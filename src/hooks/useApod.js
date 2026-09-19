import { useCallback, useEffect, useState } from 'react'
import { getApod } from '../api/apod'

export function useApod(date) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    getApod(date)
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [date, retryCount])

  const refetch = useCallback(() => setRetryCount((count) => count + 1), [])

  return { data, loading, error, refetch }
}
