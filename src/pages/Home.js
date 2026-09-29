import React, { useEffect, useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import TrendingHero from '../components/TrendingHero';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import ApiKeySetup from '../components/ApiKeySetup';
import { useMovies } from '../context/MovieContext';
import { hasApiKey } from '../api/tmdb';

const Home = () => {
  const {
    initializeHome,
    error,
    setError,
    query,
    movies,
    loadTrending,
    search,
  } = useMovies();
  const [ready, setReady] = useState(() => hasApiKey());

  useEffect(() => {
    if (ready) {
      initializeHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const needsKey =
    !ready ||
    (error && /api key/i.test(error));

  return (
    <Box sx={{ pb: { xs: 6, md: 8, xl: 10 } }}>
      <Navbar />
      <Container
        maxWidth="xxl"
        sx={{ mt: { xs: 1.5, sm: 2, md: 3, xl: 4 } }}
      >
        <Stack spacing={{ xs: 2.5, sm: 3, md: 3.5, xl: 4 }}>
          {needsKey ? (
            <ApiKeySetup
              onSaved={() => {
                setError(null);
                setReady(true);
              }}
            />
          ) : (
            <>
              <TrendingHero />

              <Stack spacing={0.75}>
                <Typography variant="h4">Find a film</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, maxWidth: 720 }}
                >
                  Search by title, or refine with genre, year, and rating filters.
                </Typography>
              </Stack>

              <SearchBar />
              <Filters />

              <ErrorMessage
                message={error}
                onRetry={() => {
                  setError(null);
                  loadTrending();
                  search(query);
                }}
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                spacing={0.75}
              >
                <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                  {query ? `Results for “${query}”` : 'Popular picks'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movies.length} shown
                </Typography>
              </Stack>

              <MovieGrid />
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
