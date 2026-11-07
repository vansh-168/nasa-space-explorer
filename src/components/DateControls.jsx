import { APOD_START_DATE, addDays, isValidApodDate } from '../utils/date'

export default function DateControls({ date, maxDate, isLatest, onChange, onLatest, onRandom, randomLoading }) {
  const goTo = (nextDate) => {
    if (isValidApodDate(nextDate, maxDate)) onChange(nextDate)
  }

  return (
    <div className="date-controls">
      <div className="date-stepper">
        <button
          type="button"
          className="icon-btn"
          onClick={() => goTo(addDays(date, -1))}
          disabled={!date || date <= APOD_START_DATE}
          aria-label="Previous day"
          title="Previous day (←)"
        >
          ‹
        </button>
        <input
          type="date"
          value={date ?? ''}
          min={APOD_START_DATE}
          max={maxDate}
          onChange={(event) => goTo(event.target.value)}
          aria-label="Choose a date"
        />
        <button
          type="button"
          className="icon-btn"
          onClick={() => goTo(addDays(date, 1))}
          disabled={!date || date >= maxDate}
          aria-label="Next day"
          title="Next day (→)"
        >
          ›
        </button>
      </div>

      <div className="date-actions">
        <button type="button" className="pill-btn" onClick={onLatest} disabled={isLatest}>
          Latest
        </button>
        <button type="button" className="pill-btn pill-accent" onClick={onRandom} disabled={randomLoading} title="Random picture (R)">
          <span aria-hidden="true">✦</span> {randomLoading ? 'Picking…' : 'Surprise me'}
        </button>
      </div>
    </div>
  )
}
