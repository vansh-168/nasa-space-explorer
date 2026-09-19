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
      <img src={apod.hdurl || apod.url} alt={apod.title} loading="lazy" />
    </div>
  )
}
