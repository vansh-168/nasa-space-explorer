// NASA's APOD archive starts on this date; nothing exists before it.
export const APOD_START_DATE = '1995-06-16'

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function isValidApodDate(dateStr) {
  return dateStr >= APOD_START_DATE && dateStr <= todayIso()
}

export function addDays(dateStr, delta) {
  const date = new Date(`${dateStr}T00:00:00`)
  date.setDate(date.getDate() + delta)
  return date.toISOString().slice(0, 10)
}
