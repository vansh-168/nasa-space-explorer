import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nasa-apod-favorites'

// Favorites saved by the old version used { url, media_type }; the new
// version stores { thumbUrl, mediaType }. Old api.nasa.gov entries may
// point at the NASA logo placeholder, so those get no thumbnail.
function upgrade(fav) {
  if (!fav || typeof fav.date !== 'string') return null
  const legacyUrl = typeof fav.url === 'string' && !/nasa-logo/i.test(fav.url) ? fav.url : null
  const mediaType = fav.mediaType ?? fav.media_type ?? 'image'
  return {
    date: fav.date,
    title: fav.title && fav.title !== 'NASA Science' ? fav.title : `Picture of ${fav.date}`,
    mediaType,
    thumbUrl: fav.thumbUrl ?? (mediaType === 'image' ? legacyUrl : null),
  }
}

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.map(upgrade).filter(Boolean) : []
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

  // Accepts a full picture entry or just { date } (for removing).
  const toggleFavorite = useCallback((apod) => {
    setFavorites((current) =>
      current.some((fav) => fav.date === apod.date)
        ? current.filter((fav) => fav.date !== apod.date)
        : [
            {
              date: apod.date,
              title: apod.title,
              mediaType: apod.mediaType,
              thumbUrl: apod.thumbUrl ?? null,
            },
            ...current,
          ],
    )
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
