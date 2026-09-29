import React from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import MovieCard from './MovieCard';
import { useMovies } from '../context/MovieContext';

/**
 * Responsive poster columns:
 * phone     2 cols
 * tablet    3–4 cols
 * laptop    5–6 cols
 * monitor   6–8 cols
 */
const MovieGrid = ({ movies: externalMovies, emptyMessage }) => {
  const {
    movies: contextMovies,
    loading,
    loadingMore,
    loadMore,
    page,
    totalPages,
    query,
  } = useMovies();

  const movies = externalMovies || contextMovies;
  const showLoadMore = !externalMovies && page < totalPages;

  if (loading && !movies.length) {
    return (
      <Box sx={{ py: { xs: 6, md: 8 }, display: 'grid', placeItems: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!loading && !movies.length) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: 2,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: { xs: 3, md: 4 },
        }}
      >
        <Typography color="text.secondary">
          {emptyMessage ||
            (query
              ? `No movies found for “${query}”. Try another title.`
              : 'No movies to show right now.')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 12, xxl: 16 }}
      >
        {movies.map((movie) => (
          <Grid
            key={movie.id}
            size={{ xs: 2, sm: 4, md: 3, lg: 2, xl: 2, xxl: 2 }}
          >
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {showLoadMore && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 3, md: 4 },
            px: 1,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={loadMore}
            disabled={loadingMore}
            fullWidth
            sx={{ maxWidth: { xs: '100%', sm: 280 } }}
            startIcon={
              loadingMore ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {loadingMore ? 'Loading…' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
