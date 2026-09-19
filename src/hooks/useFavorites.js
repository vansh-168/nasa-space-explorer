import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nasa-apod-favorites'

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage unavailable (private mode/quota) — favorites just won't persist.
    }
  }, [favorites])

  const isFavorite = useCallback(
    (date) => favorites.some((fav) => fav.date === date),
    [favorites],
  )

  const toggleFavorite = useCallback((apod) => {
    setFavorites((current) =>
      current.some((fav) => fav.date === apod.date)
        ? current.filter((fav) => fav.date !== apod.date)
        : [...current, apod],
    )
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
