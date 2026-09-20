export default function ApodMedia({ apod }) {
  if (apod.media_type === 'video') {
    return (
      <div className="apod-media apod-media-video">
        <iframe src={apod.url} title={apod.title} allowFullScreen loading="lazy" />
      </div>
    )
  }

  return (
    <div className="apod-media">
      <img src={apod.url} alt={apod.title} loading="lazy" />
      {apod.hdurl && (
        <a className="hd-link" href={apod.hdurl} target="_blank" rel="noopener noreferrer">
          View full resolution
        </a>
      )}
    </div>
  )
}
