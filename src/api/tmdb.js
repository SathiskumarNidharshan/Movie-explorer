import axios from 'axios';

const API_KEY_STORAGE = 'movie_explorer_tmdb_api_key';
const ENV_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMAGE_BASE =
  process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

const isPlaceholder = (value) =>
  !value || value === 'your_tmdb_api_key_here' || value.trim() === '';

export const getApiKey = () => {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (!isPlaceholder(stored)) return stored.trim();
  } catch {
    // ignore storage errors
  }
  if (!isPlaceholder(ENV_KEY)) return ENV_KEY.trim();
  return '';
};

export const setApiKey = (key) => {
  const trimmed = (key || '').trim();
  if (!trimmed) {
    localStorage.removeItem(API_KEY_STORAGE);
    return;
  }
  localStorage.setItem(API_KEY_STORAGE, trimmed);
};

export const hasApiKey = () => Boolean(getApiKey());

export const clearApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE);
};

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  config.params = {
    ...(config.params || {}),
    api_key: apiKey,
    language: 'en-US',
  };
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.status_message ||
      error.message ||
      'Something went wrong while talking to TMDb.';
    return Promise.reject(new Error(message));
  }
);

export const posterUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const profileUrl = (path, size = 'w185') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

/** Ensure the API key is configured before making requests. */
export const assertApiKey = () => {
  if (!getApiKey()) {
    throw new Error(
      'TMDb API key is missing. Add your key below or set REACT_APP_TMDB_API_KEY in .env.'
    );
  }
};

/** Validate a candidate key against TMDb before saving. */
export const validateApiKey = async (key) => {
  const trimmed = (key || '').trim();
  if (!trimmed) {
    throw new Error('Please paste your TMDb API key.');
  }

  try {
    await axios.get(`${BASE_URL}/configuration`, {
      params: { api_key: trimmed },
      timeout: 15000,
    });
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      throw new Error('That API key was rejected by TMDb. Double-check and try again.');
    }
    throw new Error(
      error.response?.data?.status_message ||
        error.message ||
        'Could not verify the API key.'
    );
  }

  return trimmed;
};

export const fetchTrending = async (page = 1) => {
  assertApiKey();
  const { data } = await client.get('/trending/movie/week', { params: { page } });
  return data;
};

export const searchMovies = async (query, page = 1) => {
  assertApiKey();
  const { data } = await client.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};

export const discoverMovies = async ({
  page = 1,
  genre,
  year,
  minRating,
  sortBy = 'popularity.desc',
} = {}) => {
  assertApiKey();
  const params = {
    page,
    sort_by: sortBy,
    include_adult: false,
  };
  if (genre) params.with_genres = genre;
  if (year) {
    params.primary_release_year = year;
  }
  if (minRating) {
    params['vote_average.gte'] = minRating;
  }
  const { data } = await client.get('/discover/movie', { params });
  return data;
};

export const fetchMovieDetails = async (id) => {
  assertApiKey();
  const { data } = await client.get(`/movie/${id}`, {
    params: {
      append_to_response: 'credits,videos,similar',
    },
  });
  return data;
};

export const fetchGenres = async () => {
  assertApiKey();
  const { data } = await client.get('/genre/movie/list');
  return data.genres || [];
};

export const getTrailerKey = (movie) => {
  const videos = movie?.videos?.results || [];
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
    videos.find((v) => v.site === 'YouTube');
  return trailer?.key || null;
};
