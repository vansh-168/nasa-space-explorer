import { useCallback, useEffect, useState } from 'react'
import { getApod, getLatest } from '../api/apod'

// date = null loads the most recent picture NASA has published.
// Loading is derived (the stored result belongs to an older request),
// so no state is set synchronously inside the effect.
export function useApod(date) {
  const [retryCount, setRetryCount] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const [latestDate, setLatestDate] = useState(null)
  const key = `${date ?? 'latest'}#${retryCount}`

  useEffect(() => {
    let ignore = false
    ;(date ? getApod(date) : getLatest())
      .then((data) => {
        if (ignore) return
        if (!date) setLatestDate(data.date)
        setResult({ key, data, error: null })
      })
      .catch((err) => {
        if (!ignore) setResult({ key, data: null, error: err.message })
      })
    return () => {
      ignore = true
    }
  }, [date, key])

  const refetch = useCallback(() => setRetryCount((count) => count + 1), [])
  const loading = result.key !== key

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    latestDate,
    refetch,
  }
}
