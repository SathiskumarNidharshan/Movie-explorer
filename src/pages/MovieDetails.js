import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  OpenInNew,
  PlayArrow,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ErrorMessage from '../components/ErrorMessage';
import MovieCard from '../components/MovieCard';
import {
  backdropUrl,
  fetchMovieDetails,
  getTrailerKey,
  posterUrl,
  profileUrl,
} from '../api/tmdb';
import { useMovies } from '../context/MovieContext';
import { useConfirm } from '../context/ConfirmContext';
import { useNotification } from '../context/NotificationContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();
  const { confirm } = useConfirm();
  const { notify } = useNotification();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    setShowTrailer(false);
    try {
      const data = await fetchMovieDetails(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const trailerKey = movie ? getTrailerKey(movie) : null;
  const cast = movie?.credits?.cast?.slice(0, 10) || [];
  const similar = movie?.similar?.results?.slice(0, 6) || [];
  const year = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : '—';
  const favored = movie ? isFavorite(movie.id) : false;

  const handleFavoriteToggle = async () => {
    if (!movie) return;

    if (favored) {
      const ok = await confirm({
        title: 'Remove from favorites?',
        message: `Remove “${movie.title}” from your favorites list?`,
        confirmText: 'Remove',
        cancelText: 'Keep it',
        confirmColor: 'error',
      });
      if (!ok) return;
      toggleFavorite(movie);
      notify(`“${movie.title}” removed from favorites.`, 'info');
      return;
    }

    const ok = await confirm({
      title: 'Add to favorites?',
      message: `Add “${movie.title}” to your favorites?`,
      confirmText: 'Add',
      cancelText: 'Cancel',
      confirmColor: 'primary',
    });
    if (!ok) return;
    toggleFavorite(movie);
    notify(`“${movie.title}” added to favorites.`, 'success');
  };

  return (
    <Box sx={{ pb: { xs: 6, md: 8, xl: 10 } }}>
      <Navbar />

      {loading && (
        <Box sx={{ py: { xs: 8, md: 12 }, display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>
          <ErrorMessage message={error} onRetry={load} />
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Go back
          </Button>
        </Container>
      )}

      {!loading && movie && (
        <>
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 180, sm: 240, md: 360, lg: 420 },
              backgroundImage: movie.backdrop_path
                ? `url(${backdropUrl(movie.backdrop_path)})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: (theme) =>
                  `linear-gradient(180deg, ${alpha(
                    theme.palette.background.default,
                    0.35
                  )} 0%, ${theme.palette.background.default} 92%)`,
              }}
            />
          </Box>

          <Container
            maxWidth="xxl"
            sx={{ mt: { xs: -10, sm: -14, md: -20, lg: -22 }, position: 'relative' }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2, bgcolor: 'background.paper' }}
              variant="outlined"
              size="small"
            >
              Back
            </Button>

            <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
              <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    overflow: 'hidden',
                    borderRadius: { xs: 2, md: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    aspectRatio: '2 / 3',
                    maxWidth: { xs: 220, sm: '100%' },
                    mx: { xs: 'auto', sm: 0 },
                  }}
                >
                  {movie.poster_path ? (
                    <Box
                      component="img"
                      src={posterUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                      <Typography color="text.secondary">No poster</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                    alignItems={{ md: 'flex-start' }}
                  >
                    <Box>
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: {
                            xs: '1.6rem',
                            sm: '2rem',
                            md: '2.6rem',
                            lg: '3rem',
                          },
                          mb: 0.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        {movie.title}
                      </Typography>
                      {movie.tagline && (
                        <Typography color="text.secondary" fontStyle="italic">
                          {movie.tagline}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      onClick={handleFavoriteToggle}
                      color="primary"
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                      }}
                      aria-label="Toggle favorite"
                    >
                      {favored ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={year} />
                    {movie.runtime ? <Chip label={`${movie.runtime} min`} /> : null}
                    <Chip
                      label={`${(movie.vote_average || 0).toFixed(1)} / 10`}
                      color="primary"
                      variant="outlined"
                    />
                    {(movie.genres || []).map((g) => (
                      <Chip key={g.id} label={g.name} variant="outlined" />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating
                      value={(movie.vote_average || 0) / 2}
                      precision={0.1}
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {movie.vote_count?.toLocaleString() || 0} votes
                    </Typography>
                  </Stack>

                  <Typography variant="h5">Overview</Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 820, lineHeight: 1.7 }}>
                    {movie.overview || 'No overview available.'}
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    {trailerKey && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => setShowTrailer(true)}
                      >
                        Watch trailer
                      </Button>
                    )}
                    {movie.homepage && (
                      <Button
                        variant="outlined"
                        endIcon={<OpenInNew />}
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official site
                      </Button>
                    )}
                  </Stack>

                  {showTrailer && trailerKey && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 1,
                        overflow: 'hidden',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        pt: '56.25%',
                      }}
                    >
                      <Box
                        component="iframe"
                        title={`${movie.title} trailer`}
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          border: 0,
                        }}
                      />
                    </Paper>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 5 }} />

            <Typography variant="h5" mb={2}>
              Top cast
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {cast.map((person) => (
                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={person.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      src={profileUrl(person.profile_path) || undefined}
                      alt={person.name}
                      sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5 }}
                    />
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                      {person.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {person.character}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
              {!cast.length && (
                <Grid size={12}>
                  <Typography color="text.secondary">Cast information unavailable.</Typography>
                </Grid>
              )}
            </Grid>

            {similar.length > 0 && (
              <>
                <Typography variant="h5" mt={5} mb={2}>
                  You may also like
                </Typography>
                <Grid container spacing={2.5}>
                  {similar.map((item) => (
                    <Grid size={{ xs: 6, sm: 4, md: 2 }} key={item.id}>
                      <MovieCard movie={item} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <Box sx={{ mt: 4 }}>
              <Button component={RouterLink} to="/" variant="text">
                ← Back to home
              </Button>
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
};

export default MovieDetails;
