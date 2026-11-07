import { useState } from 'react'

export default function ApodMedia({ apod }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (apod.mediaType === 'video' && apod.videoKind === 'embed') {
    return (
      <div className="media media-video">
        <iframe
          src={apod.videoUrl}
          title={apod.title}
          allow="fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  if (apod.mediaType === 'video' && apod.videoKind === 'file') {
    return (
      <div className="media media-video">
        <video src={apod.videoUrl} controls playsInline preload="metadata" />
      </div>
    )
  }

  if (apod.mediaType !== 'image' || failed) {
    return (
      <div className="media media-fallback">
        <p>
          {failed
            ? "This picture couldn't be loaded."
            : "This day's entry is in a format that can't be shown here."}
        </p>
        {apod.permalink && (
          <a className="pill-btn" href={apod.permalink} target="_blank" rel="noopener noreferrer">
            View it on NASA ↗
          </a>
        )}
      </div>
    )
  }

  return (
    <a
      className={`media media-image${loaded ? ' is-loaded' : ''}`}
      href={apod.hdUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open full-resolution image: ${apod.title}`}
    >
      <img
        key={apod.date}
        src={apod.imageUrl}
        srcSet={apod.imageSrcSet}
        sizes="(max-width: 1240px) 100vw, 1200px"
        alt={apod.alt}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </a>
  )
}
