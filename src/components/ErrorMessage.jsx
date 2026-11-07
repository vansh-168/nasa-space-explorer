export default function ErrorMessage({ message, onRetry, children }) {
  return (
    <div className="status-card" role="alert">
      <p>{message}</p>
      <div className="status-actions">
        {onRetry && (
          <button type="button" className="pill-btn" onClick={onRetry}>
            Try again
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
