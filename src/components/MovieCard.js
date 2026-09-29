import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { Favorite, FavoriteBorder, Movie } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';
import { useConfirm } from '../context/ConfirmContext';
import { useNotification } from '../context/NotificationContext';

const MovieCard = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useMovies();
  const { confirm } = useConfirm();
  const { notify } = useNotification();
  const favored = isFavorite(movie.id);
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '—';
  const poster = posterUrl(movie.poster_path, 'w500');

  const handleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

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
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(0,0,0,0.45)'
                : '0 18px 40px rgba(23,20,15,0.12)',
            '& .poster': {
              transform: 'scale(1.05)',
            },
          },
        },
      }}
    >
      <Tooltip title={favored ? 'Remove from favorites' : 'Add to favorites'}>
        <IconButton
          onClick={handleFavorite}
          aria-label="Toggle favorite"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.45)',
            color: favored ? 'primary.main' : '#fff',
            backdropFilter: 'blur(6px)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.65)',
              color: 'primary.main',
            },
          }}
        >
          {favored ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Tooltip>

      <CardActionArea
        component={RouterLink}
        to={`/movie/${movie.id}`}
        sx={{ height: '100%', alignItems: 'stretch', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ overflow: 'hidden', aspectRatio: '2 / 3', bgcolor: 'action.hover' }}>
          {poster ? (
            <CardMedia
              component="img"
              image={poster}
              alt={movie.title}
              className="poster"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.35s ease',
              }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Movie sx={{ fontSize: 48, opacity: 0.4 }} />
            </Box>
          )}
        </Box>

        <CardContent
          sx={{
            width: '100%',
            flexGrow: 1,
            p: { xs: 1.25, sm: 2 },
            '&:last-child': { pb: { xs: 1.25, sm: 2 } },
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: { xs: '2.4em', sm: '2.8em' },
              lineHeight: 1.3,
              fontSize: { xs: '0.85rem', sm: '1rem' },
            }}
          >
            {movie.title}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
            spacing={0.5}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {year}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Rating
                value={(movie.vote_average || 0) / 2}
                precision={0.1}
                size="small"
                readOnly
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
              >
                {(movie.vote_average || 0).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
