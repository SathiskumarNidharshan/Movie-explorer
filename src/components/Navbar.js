import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Tooltip,
  Badge,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Brightness4,
  Brightness7,
  Favorite,
  Home as HomeIcon,
  Logout,
  MovieFilter,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { useMovies } from '../context/MovieContext';
import { useConfirm } from '../context/ConfirmContext';
import { useNotification } from '../context/NotificationContext';

const Navbar = () => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const { favorites } = useMovies();
  const { confirm } = useConfirm();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out?',
      message: `Are you sure you want to log out${
        user?.username ? `, ${user.username}` : ''
      }?`,
      confirmText: 'Logout',
      cancelText: 'Stay signed in',
      confirmColor: 'error',
    });
    if (!ok) return;

    const name = user?.username;
    logout();
    notify(name ? `Goodbye, ${name}. You are logged out.` : 'You are logged out.', 'info');
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Container maxWidth="xxl">
        <Toolbar
          disableGutters
          sx={{
            py: { xs: 0.75, sm: 1 },
            gap: { xs: 0.5, sm: 1 },
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.2 }}
            alignItems="center"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              mr: 'auto',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              <MovieFilter fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  lineHeight: 1.1,
                  fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                }}
              >
                Movie Explorer
              </Typography>
              {!isPhone && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  Discover your favorite films
                </Typography>
              )}
            </Box>
          </Stack>

          {isPhone ? (
            <Tooltip title="Home">
              <IconButton
                component={RouterLink}
                to="/"
                color={location.pathname === '/' ? 'primary' : 'default'}
                aria-label="Home"
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              component={RouterLink}
              to="/"
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              sx={{ display: 'inline-flex' }}
            >
              Home
            </Button>
          )}

          <Tooltip title="Favorites">
            <IconButton
              component={RouterLink}
              to="/favorites"
              color={location.pathname === '/favorites' ? 'primary' : 'default'}
              aria-label="Favorites"
            >
              <Badge badgeContent={favorites.length} color="primary" max={99}>
                <Favorite />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <IconButton onClick={toggleMode} aria-label="Toggle theme">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {!isPhone && !isTablet && user && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 0.5, maxWidth: { md: 100, lg: 140 } }}
              noWrap
            >
              Hi, {user.username}
            </Typography>
          )}

          <Button
            onClick={handleLogout}
            startIcon={!isPhone ? <Logout /> : undefined}
            variant="outlined"
            size="small"
            sx={{
              ml: 0.25,
              minWidth: isPhone ? 40 : undefined,
              px: isPhone ? 1 : undefined,
            }}
            aria-label="Logout"
          >
            {isPhone ? <Logout fontSize="small" /> : 'Logout'}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
