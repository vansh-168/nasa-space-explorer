# Space Explorer

A React app for browsing NASA's **Astronomy Picture of the Day** (APOD): today's picture, any day back to 16 June 1995, a gallery of recent pictures, random discoveries, and your own saved favourites.

**Live:** https://nasa-space-explorer-tan.vercel.app

## Features

- **Daily picture** with NASA's full explanation and credits, and a link to the full-resolution image
- **Date navigation:** ‹ › buttons, a date picker, ← → keyboard shortcuts, and a "Latest" button
- **Surprise me:** a random picture from the whole 30-year archive (or press **R**)
- **Gallery:** recent pictures as a grid, 24 at a time, with "Load older pictures"
- **Saved:** star pictures to keep them (stored in your browser)
- **Shareable links:** every picture has its own URL (`?date=YYYY-MM-DD`), with a Share button
- Plays APOD's video days (YouTube embeds), with a fallback for formats that can't be shown

## Data source

Pictures come from NASA Science's APOD feed:

```
https://science.nasa.gov/wp-json/wp/v2/apod-basic/<YYMMDD>      one day
https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=&page= newest first
```

No API key is needed. The older `api.nasa.gov/planetary/apod` endpoint is **not** used: since APOD moved from apod.nasa.gov to science.nasa.gov, it returns a "NASA Science" logo placeholder for every date.

Images are served from `assets.science.nasa.gov`. Paths under `/dynamicimage/` accept `?w=<width>`, which the app uses for small gallery thumbnails and responsive images.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Built with React 19 and Vite. All feed HTML (explanations and credits) is sanitized before rendering (`src/utils/sanitizeHtml.js`).

---

An independent project, not affiliated with NASA. Each image belongs to its credited creator.
