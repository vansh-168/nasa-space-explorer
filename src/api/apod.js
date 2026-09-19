const NASA_APOD_ENDPOINT = 'https://api.nasa.gov/planetary/apod'
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'

export async function getApod(date) {
  const params = new URLSearchParams({ api_key: API_KEY })
  if (date) params.set('date', date)

  let response
  try {
    response = await fetch(`${NASA_APOD_ENDPOINT}?${params}`)
  } catch {
    throw new Error('Network error — check your connection and try again.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.msg || `Failed to load the picture of the day (${response.status}).`)
  }

  return response.json()
}
