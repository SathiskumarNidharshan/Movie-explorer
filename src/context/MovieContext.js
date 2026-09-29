import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  discoverMovies,
  fetchGenres,
  fetchTrending,
  searchMovies,
} from '../api/tmdb';
import { useAuth } from './AuthContext';

const MovieContext = createContext(null);

const LAST_SEARCH_KEY = 'movie_explorer_last_search';
const FAVORITES_KEY_PREFIX = 'movie_explorer_favorites_';
const SEARCH_HISTORY_KEY_PREFIX = 'movie_explorer_search_history_';
const LEGACY_FAVORITES_KEY = 'movie_explorer_favorites';
const MAX_SEARCH_HISTORY = 12;

const defaultFilters = {
  genre: '',
  year: '',
  minRating: '',
};

const favoritesKeyFor = (username) =>
  `${FAVORITES_KEY_PREFIX}${username.trim().toLowerCase()}`;

const readFavorites = (username) => {
  if (!username) return [];
  try {
    const key = favoritesKeyFor(username);
    let raw = localStorage.getItem(key);

    // One-time migrate from the old shared favorites list
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_FAVORITES_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(LEGACY_FAVORITES_KEY);
        raw = legacy;
      }
    }

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeFavorites = (username, list) => {
  if (!username) return;
  localStorage.setItem(favoritesKeyFor(username), JSON.stringify(list));
};

const historyKeyFor = (username) =>
  `${SEARCH_HISTORY_KEY_PREFIX}${username.trim().toLowerCase()}`;

const readSearchHistory = (username) => {
  if (!username) return [];
  try {
    const raw = localStorage.getItem(historyKeyFor(username));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeSearchHistory = (username, list) => {
  if (!username) return;
  localStorage.setItem(historyKeyFor(username), JSON.stringify(list));
};

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const username = user?.username || null;
  const skipNextFavoritesSave = useRef(false);

  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState(
    () => localStorage.getItem(LAST_SEARCH_KEY) || ''
  );
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => readFavorites(username));
  const [searchHistory, setSearchHistory] = useState(() =>
    readSearchHistory(username)
  );
  const skipNextHistorySave = useRef(false);

  // Load this user's favorites whenever the logged-in account changes
  useEffect(() => {
    skipNextFavoritesSave.current = true;
    skipNextHistorySave.current = true;
    setFavorites(readFavorites(username));
    setSearchHistory(readSearchHistory(username));
  }, [username]);

  // Persist favorites only for the active user
  useEffect(() => {
    if (!username) return;
    if (skipNextFavoritesSave.current) {
      skipNextFavoritesSave.current = false;
      return;
    }
    writeFavorites(username, favorites);
  }, [favorites, username]);

  useEffect(() => {
    if (!username) return;
    if (skipNextHistorySave.current) {
      skipNextHistorySave.current = false;
      return;
    }
    writeSearchHistory(username, searchHistory);
  }, [searchHistory, username]);

  const persistLastSearch = useCallback((value) => {
    const trimmed = (value || '').trim();
    if (trimmed) {
      localStorage.setItem(LAST_SEARCH_KEY, trimmed);
      setSearchHistory((prev) => {
        const next = [
          trimmed,
          ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
        ].slice(0, MAX_SEARCH_HISTORY);
        return next;
      });
    } else {
      localStorage.removeItem(LAST_SEARCH_KEY);
    }
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    if (username) {
      writeSearchHistory(username, []);
    }
  }, [username]);

  const removeSearchHistoryItem = useCallback((term) => {
    setSearchHistory((prev) =>
      prev.filter((item) => item.toLowerCase() !== term.toLowerCase())
    );
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const list = await fetchGenres();
      setGenres(list);
    } catch (err) {
      console.warn(err.message);
    }
  }, []);

  const loadTrending = useCallback(async () => {
    setTrendingLoading(true);
    try {
      const data = await fetchTrending(1);
      setTrending(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const hasActiveFilters = useMemo(
    () => Boolean(filters.genre || filters.year || filters.minRating),
    [filters]
  );

  const fetchPage = useCallback(
    async (pageNum, { append = false, searchQuery = query, currentFilters = filters } = {}) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        let data;
        const trimmed = searchQuery?.trim();

        if (trimmed) {
          data = await searchMovies(trimmed, pageNum);
        } else if (
          currentFilters.genre ||
          currentFilters.year ||
          currentFilters.minRating
        ) {
          data = await discoverMovies({
            page: pageNum,
            genre: currentFilters.genre || undefined,
            year: currentFilters.year || undefined,
            minRating: currentFilters.minRating || undefined,
          });
        } else {
          data = await discoverMovies({ page: pageNum });
        }

        const results = data.results || [];
        setMovies((prev) => (append ? [...prev, ...results] : results));
        setPage(data.page || pageNum);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (err) {
        setError(err.message);
        if (!append) setMovies([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, filters]
  );

  const search = useCallback(
    async (nextQuery) => {
      const value = (nextQuery ?? query).trim();
      setQuery(value);
      persistLastSearch(value);
      setPage(1);
      await fetchPage(1, { append: false, searchQuery: value });
    },
    [fetchPage, query, persistLastSearch]
  );

  const applyFilters = useCallback(
    async (nextFilters) => {
      setFilters(nextFilters);
      setQuery('');
      persistLastSearch('');
      setPage(1);
      await fetchPage(1, {
        append: false,
        searchQuery: '',
        currentFilters: nextFilters,
      });
    },
    [fetchPage, persistLastSearch]
  );

  const clearFilters = useCallback(async () => {
    setFilters(defaultFilters);
    setPage(1);
    await fetchPage(1, {
      append: false,
      searchQuery: query,
      currentFilters: defaultFilters,
    });
  }, [fetchPage, query]);

  const loadMore = useCallback(async () => {
    if (page >= totalPages || loadingMore || loading) return;
    await fetchPage(page + 1, { append: true });
  }, [fetchPage, page, totalPages, loadingMore, loading]);

  const toggleFavorite = useCallback((movie) => {
    if (!username) return;
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview,
        },
        ...prev,
      ];
    });
  }, [username]);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const initializeHome = useCallback(async () => {
    await Promise.all([loadGenres(), loadTrending()]);
    const lastSearch = localStorage.getItem(LAST_SEARCH_KEY) || '';
    if (lastSearch) {
      setQuery(lastSearch);
      await fetchPage(1, { append: false, searchQuery: lastSearch });
    } else {
      await fetchPage(1, { append: false, searchQuery: '' });
    }
  }, [loadGenres, loadTrending, fetchPage]);

  const value = useMemo(
    () => ({
      trending,
      movies,
      genres,
      query,
      setQuery,
      filters,
      page,
      totalPages,
      loading,
      loadingMore,
      trendingLoading,
      error,
      setError,
      favorites,
      searchHistory,
      hasActiveFilters,
      search,
      applyFilters,
      clearFilters,
      loadMore,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      clearSearchHistory,
      removeSearchHistoryItem,
      initializeHome,
      loadTrending,
    }),
    [
      trending,
      movies,
      genres,
      query,
      filters,
      page,
      totalPages,
      loading,
      loadingMore,
      trendingLoading,
      error,
      favorites,
      searchHistory,
      hasActiveFilters,
      search,
      applyFilters,
      clearFilters,
      loadMore,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      clearSearchHistory,
      removeSearchHistoryItem,
      initializeHome,
      loadTrending,
    ]
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return ctx;
};
