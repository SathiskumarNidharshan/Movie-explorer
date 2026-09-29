# Movie Explorer – Discover Your Favorite Films

A React web app built for the Loons Lab developer selection task. Browse trending movies, search the TMDb catalog, open rich detail pages (cast, genres, trailers), save favorites, and switch between light and dark themes.

## Tech stack (as specified)

- **React** (Create React App)
- **Material UI (MUI)** for styling
- **Axios** for TMDb API requests
- **React Router** for Home / Movie Details / Favorites / Login
- **React Context API** for auth, movies, and theme state
- **localStorage** for session, favorites, last search, and theme preference

## Features

### Core
- Login screen (demo auth — any username + password ≥ 4 characters)
- Search bar with persisted last search
- Responsive poster grid (title, year, rating)
- Movie details: overview, genres, cast, rating, YouTube trailer embed
- Trending hero carousel (TMDb weekly trending)
- Light / dark mode toggle
- Favorites list stored locally
- Graceful API error handling with retry
- Infinite scroll **and** a **Load More** button

### Bonus
- Filters by genre, year, and minimum rating
- YouTube trailers via TMDb video keys
- Load More control for accessible pagination

## Getting started

### 1. Install dependencies

```bash
cd movie-explorer
npm install
```

### 2. Add your TMDb API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Request an API key under **Settings → API**
3. Copy `.env.example` to `.env` (or edit the existing `.env`) and set:

```env
REACT_APP_TMDB_API_KEY=your_actual_key_here
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

> Restart `npm start` after changing `.env`.

### 3. Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
```

## Project structure

```
src/
  api/tmdb.js              # Axios TMDb client + helpers
  components/              # Reusable UI (Navbar, SearchBar, MovieCard, …)
  context/                 # Auth, Movie, Theme Context providers
  pages/                   # Login, Home, MovieDetails, Favorites
  theme/theme.js           # MUI light/dark design tokens
  App.js                   # Routes + providers
```

## API usage

| Endpoint | Purpose |
| --- | --- |
| `GET /trending/movie/week` | Trending hero |
| `GET /search/movie` | Title search |
| `GET /discover/movie` | Browse + filters |
| `GET /movie/{id}?append_to_response=credits,videos,similar` | Details, cast, trailer |
| `GET /genre/movie/list` | Filter genres |

Images use `https://image.tmdb.org/t/p/{size}{path}`.

## Demo login

There is no backend auth. Use any username and a password with at least 4 characters (example: `loons` / `lab123`).

## Deploy (Vercel / Netlify)

1. Push this folder to GitLab / GitHub
2. Import the project in Vercel or Netlify
3. Set `REACT_APP_TMDB_API_KEY` (and optional base URL vars) in the host’s environment settings
4. Build command: `npm run build` · Publish directory: `build`

## License

Built for Loons Lab evaluation. TMDb data © TMDb contributors.
