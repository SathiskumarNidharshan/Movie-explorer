import React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { ChevronLeft, ChevronRight, LocalFireDepartment, Star } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { backdropUrl, posterUrl } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

const TrendingHero = () => {
  const { trending, trendingLoading } = useMovies();
  const [index, setIndex] = React.useState(0);
  const featured = trending.slice(0, 8);
  const movie = featured[index];

  React.useEffect(() => {
    if (featured.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (trendingLoading && !featured.length) {
    return (
      <Box
        sx={{
          height: { xs: 280, sm: 340, md: 420, xl: 480 },
          borderRadius: { xs: 3, md: 4 },
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) return null;

  const backdrop = backdropUrl(movie.backdrop_path) || posterUrl(movie.poster_path, 'w780');
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: { xs: 3, md: 4 },
        overflow: 'hidden',
        minHeight: { xs: 320, sm: 380, md: 440, lg: 480, xl: 520 },
        border: '1px solid',
        borderColor: 'divider',
        animation: 'fadeIn 0.6s ease',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        key={movie.id}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: backdrop ? `url(${backdrop})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: { xs: 'center center', md: 'center top' },
          animation: 'kenBurns 8s ease forwards',
          '@keyframes kenBurns': {
            from: { transform: 'scale(1)' },
            to: { transform: 'scale(1.08)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: { xs: 'block', md: 'none' },
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(
              theme.palette.background.default,
              0.15
            )} 0%, ${alpha(theme.palette.background.default, 0.55)} 42%, ${
              theme.palette.background.default
            } 100%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: { xs: 'none', md: 'block' },
          background: (theme) =>
            `linear-gradient(90deg, ${alpha(theme.palette.background.default, 0.96)} 0%, ${alpha(
              theme.palette.background.default,
              0.75
            )} 42%, ${alpha(theme.palette.background.default, 0.25)} 100%),
             linear-gradient(0deg, ${alpha(theme.palette.background.default, 0.9)} 0%, transparent 45%)`,
        }}
      />

      <Stack
        sx={{
          position: 'relative',
          zIndex: 1,
          p: { xs: 2.5, sm: 3.5, md: 5, xl: 6 },
          maxWidth: { xs: '100%', md: 640, xl: 720 },
          height: '100%',
          minHeight: { xs: 320, sm: 380, md: 440, lg: 480, xl: 520 },
          justifyContent: 'flex-end',
        }}
        spacing={{ xs: 1.25, sm: 1.75, md: 2 }}
      >
        <Chip
          icon={<LocalFireDepartment />}
          label="Trending this week"
          color="primary"
          size="small"
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 700,
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: '1.65rem',
              sm: '2.2rem',
              md: '3rem',
              lg: '3.3rem',
              xl: '3.6rem',
            },
            lineHeight: 1.05,
            pr: { xs: 6, sm: 8, md: 0 },
          }}
        >
          {movie.title}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {year && (
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {year}
            </Typography>
          )}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Star sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight={700}>
              {(movie.vote_average || 0).toFixed(1)}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          color="text.secondary"
          sx={{
            display: { xs: 'none', sm: '-webkit-box' },
            WebkitLineClamp: { sm: 2, md: 3 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: { sm: 480, md: 520, xl: 600 },
            fontSize: { sm: '0.95rem', md: '1rem' },
          }}
        >
          {movie.overview || 'No overview available for this title.'}
        </Typography>
        <Button
          component={RouterLink}
          to={`/movie/${movie.id}`}
          variant="contained"
          size="large"
          sx={{
            alignSelf: 'flex-start',
            px: { xs: 2.5, md: 3 },
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          View details
        </Button>
      </Stack>

      {featured.length > 1 && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            position: 'absolute',
            bottom: { xs: 12, sm: 16, md: 20 },
            right: { xs: 12, sm: 16, md: 20 },
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={() =>
              setIndex((prev) => (prev - 1 + featured.length) % featured.length)
            }
            sx={{
              bgcolor: 'rgba(0,0,0,0.45)',
              color: '#fff',
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
            }}
            aria-label="Previous trending"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setIndex((prev) => (prev + 1) % featured.length)}
            sx={{
              bgcolor: 'rgba(0,0,0,0.45)',
              color: '#fff',
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
            }}
            aria-label="Next trending"
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default TrendingHero;
