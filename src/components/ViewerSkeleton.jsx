export default function ViewerSkeleton() {
  return (
    <div className="viewer" role="status" aria-live="polite">
      <div className="media skeleton skeleton-media" />
      <div className="placard">
        <div className="placard-head">
          <div className="skeleton skeleton-line" style={{ width: '38%' }} />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" style={{ width: '55%' }} />
        </div>
        <div>
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" style={{ width: '80%' }} />
        </div>
      </div>
      <span className="visually-hidden">Loading picture…</span>
    </div>
  )
}
