export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-message status-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
