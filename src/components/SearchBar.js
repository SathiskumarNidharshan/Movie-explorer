import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Clear, History, Movie, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { posterUrl, searchMovies } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

const SearchBar = () => {
  const navigate = useNavigate();
  const {
    query,
    search,
    loading,
    searchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
  } = useMovies();

  const [localQuery, setLocalQuery] = useState(query || '');
  const [open, setOpen] = useState(false);
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  useEffect(() => {
    const term = localQuery.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (term.length < 2) {
      setMovieSuggestions([]);
      setSuggestLoading(false);
      return undefined;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setSuggestLoading(true);
      try {
        const data = await searchMovies(term, 1);
        if (requestId !== requestIdRef.current) return;
        setMovieSuggestions((data.results || []).slice(0, 6));
      } catch {
        if (requestId !== requestIdRef.current) return;
        setMovieSuggestions([]);
      } finally {
        if (requestId === requestIdRef.current) setSuggestLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localQuery]);

  const historyMatches = useMemo(() => {
    const term = localQuery.trim().toLowerCase();
    if (!term) return searchHistory;
    return searchHistory.filter((item) => item.toLowerCase().includes(term));
  }, [searchHistory, localQuery]);

  const showDropdown =
    open && (historyMatches.length > 0 || movieSuggestions.length > 0 || suggestLoading);

  const runSearch = (value) => {
    const term = (value || '').trim();
    setLocalQuery(term);
    setOpen(false);
    search(term);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setMovieSuggestions([]);
    search('');
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', zIndex: 20 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            px: { xs: 1.25, sm: 2 },
            py: { xs: 1, sm: 1.25 },
            borderRadius: showDropdown ? '28px 28px 0 0' : 999,
            border: '1px solid',
            borderColor: open ? 'primary.main' : 'divider',
            borderBottomColor: showDropdown ? 'transparent' : undefined,
            bgcolor: 'background.paper',
            minHeight: { xs: 56, sm: 64 },
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: open
              ? (theme) => `0 0 0 4px ${theme.palette.primary.main}22`
              : 'none',
          }}
        >
          <Search sx={{ color: 'text.secondary', flexShrink: 0 }} />

          <InputBase
            fullWidth
            placeholder="Search movies by title…"
            value={localQuery}
            disabled={loading}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setOpen(true);
            }}
            inputProps={{ 'aria-label': 'Search movies', autoComplete: 'off' }}
            sx={{
              px: 0.5,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              fontWeight: 500,
            }}
          />

          <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
            {suggestLoading ? <CircularProgress size={18} /> : null}

            {localQuery ? (
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="Clear search"
                sx={{ color: 'text.secondary' }}
              >
                <Clear fontSize="small" />
              </IconButton>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<Search />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                px: 2.5,
                py: 1,
                minWidth: 120,
              }}
            >
              Search
            </Button>

            <Box
              component="button"
              type="submit"
              aria-label="Search"
              disabled={loading}
              sx={{
                display: { xs: 'grid', sm: 'none' },
                placeItems: 'center',
                width: 40,
                height: 40,
                border: 0,
                borderRadius: '50%',
                cursor: 'pointer',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
              }}
            >
              <Search fontSize="small" />
            </Box>
          </Stack>
        </Paper>

        {showDropdown && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              border: '1px solid',
              borderColor: 'primary.main',
              borderTop: 0,
              borderRadius: '0 0 20px 20px',
              bgcolor: 'background.paper',
              overflow: 'hidden',
              maxHeight: 420,
              overflowY: 'auto',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 16px 40px rgba(0,0,0,0.45)'
                  : '0 16px 40px rgba(23,20,15,0.12)',
            }}
          >
            {historyMatches.length > 0 && (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, pt: 1.5, pb: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Previous searches
                  </Typography>
                  <Typography
                    component="button"
                    type="button"
                    variant="caption"
                    onClick={clearSearchHistory}
                    sx={{
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      color: 'text.secondary',
                      fontFamily: 'inherit',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    Clear all
                  </Typography>
                </Stack>
                <List dense disablePadding>
                  {historyMatches.map((term) => (
                    <ListItemButton
                      key={`history-${term}`}
                      onClick={() => runSearch(term)}
                      sx={{ py: 1.1, px: 2 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <History fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={term}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <IconButton
                        size="small"
                        aria-label={`Remove ${term}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeSearchHistoryItem(term);
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </List>
              </>
            )}

            {(movieSuggestions.length > 0 || suggestLoading) && (
              <>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ display: 'block', px: 2, pt: 1.5, pb: 0.5 }}
                >
                  Movie suggestions
                </Typography>
                <List dense disablePadding>
                  {movieSuggestions.map((movie) => {
                    const year = movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : '—';
                    const poster = posterUrl(movie.poster_path, 'w92');
                    return (
                      <ListItemButton
                        key={`movie-${movie.id}`}
                        onClick={() => {
                          setLocalQuery(movie.title);
                          setOpen(false);
                          search(movie.title);
                          navigate(`/movie/${movie.id}`);
                        }}
                        sx={{ py: 1.1, px: 2, gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 52,
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: 'action.hover',
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {poster ? (
                            <Box
                              component="img"
                              src={poster}
                              alt=""
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Movie fontSize="small" color="disabled" />
                          )}
                        </Box>
                        <ListItemText
                          primary={movie.title}
                          secondary={`${year} · ${(movie.vote_average || 0).toFixed(1)} rating`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
