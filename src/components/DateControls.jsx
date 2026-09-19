import { APOD_START_DATE, addDays, isValidApodDate, todayIso } from '../utils/date'

export default function DateControls({ date, onChange }) {
  const today = todayIso()

  const goTo = (nextDate) => {
    if (isValidApodDate(nextDate)) onChange(nextDate)
  }

  return (
    <div className="date-controls">
      <button
        type="button"
        onClick={() => goTo(addDays(date, -1))}
        disabled={date <= APOD_START_DATE}
        aria-label="Previous day"
      >
        ‹
      </button>
      <input
        type="date"
        value={date}
        min={APOD_START_DATE}
        max={today}
        onChange={(event) => goTo(event.target.value)}
        aria-label="Select date"
      />
      <button
        type="button"
        onClick={() => goTo(addDays(date, 1))}
        disabled={date >= today}
        aria-label="Next day"
      >
        ›
      </button>
      <button type="button" className="today-btn" onClick={() => goTo(today)} disabled={date === today}>
        Today
      </button>
    </div>
  )
}
