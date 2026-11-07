// NASA's APOD archive starts on this date; nothing exists before it.
export const APOD_START_DATE = '1995-06-16'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// APOD publishes on US Eastern time, so "today" is today in New York,
// not in the visitor's own timezone.
export function todayIso() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function isValidApodDate(dateStr, maxDate = todayIso()) {
  return ISO_DATE.test(dateStr) && dateStr >= APOD_START_DATE && dateStr <= maxDate
}

// Pure UTC arithmetic. Mixing local midnight with toISOString() (UTC)
// shifted dates by a day in timezones ahead of UTC, such as India.
export function addDays(dateStr, delta) {
  const date = new Date(`${dateStr}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

export function formatLongDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateStr}T00:00:00Z`))
}

export function formatShortDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dateStr}T00:00:00Z`))
}
