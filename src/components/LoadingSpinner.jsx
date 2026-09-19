export default function LoadingSpinner() {
  return (
    <div className="status-message" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>Loading picture…</span>
    </div>
  )
}
