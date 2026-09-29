import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import {
  LockOutlined,
  MovieFilter,
  PersonOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { isDark } = useThemeMode();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Always land on Home after login (never restore Favorites/Details)
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = login(username, password);
      notify(`Welcome back, ${user.username}! You are logged in.`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
        display: 'grid',
        placeItems: 'center',
        px: { xs: 1.5, sm: 2 },
        py: { xs: 3, sm: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 260, sm: 360, md: 420 },
          height: { xs: 260, sm: 360, md: 420 },
          borderRadius: '50%',
          top: '-10%',
          right: '-5%',
          background: (theme) =>
            `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.25)}, transparent 70%)`,
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(18px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 200, sm: 280, md: 320 },
          height: { xs: 200, sm: 280, md: 320 },
          borderRadius: '50%',
          bottom: '-8%',
          left: '-4%',
          background: (theme) =>
            `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)}, transparent 70%)`,
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              alpha(theme.palette.background.paper, isDark ? 0.85 : 0.92),
            backdropFilter: 'blur(18px)',
          }}
        >
          <Stack spacing={3} alignItems="stretch">
            <Stack spacing={1.5} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: (theme) =>
                    `0 12px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                <MovieFilter fontSize="large" />
              </Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
                Movie Explorer
              </Typography>
              <Typography color="text.secondary" maxWidth={360}>
                Sign in to search films, browse trending titles, and build your
                personal favorites list.
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.2}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  fullWidth
                  required
                  helperText="Use any username with a password of 4+ characters (demo auth)."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  fullWidth
                  sx={{ mt: 1, py: 1.4 }}
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
