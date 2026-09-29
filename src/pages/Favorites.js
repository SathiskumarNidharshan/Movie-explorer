import React from 'react';
import { Box, Container, Stack, Typography, Button } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const { favorites } = useMovies();
  const { user } = useAuth();

  return (
    <Box sx={{ pb: { xs: 6, md: 8, xl: 10 } }}>
      <Navbar />
      <Container maxWidth="xxl" sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={1} mb={{ xs: 2.5, md: 3.5 }}>
          <Typography variant="h3">Your favorites</Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            Saved for <strong>{user?.username}</strong> on this device —{' '}
            {favorites.length} title{favorites.length === 1 ? '' : 's'}.
          </Typography>
        </Stack>

        {favorites.length === 0 ? (
          <Box
            sx={{
              py: { xs: 6, md: 10 },
              px: 2,
              textAlign: 'center',
              borderRadius: { xs: 3, md: 4 },
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <FavoriteBorder sx={{ fontSize: { xs: 40, md: 48 }, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              No favorites yet
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Tap the heart on any movie card to save it here.
            </Typography>
            <Button component={RouterLink} to="/" variant="contained">
              Browse movies
            </Button>
          </Box>
        ) : (
          <MovieGrid
            movies={favorites}
            emptyMessage="No favorites saved yet."
          />
        )}
      </Container>
    </Box>
  );
};

export default Favorites;
