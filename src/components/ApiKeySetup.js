import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Key, OpenInNew } from '@mui/icons-material';
import { setApiKey, validateApiKey } from '../api/tmdb';

const ApiKeySetup = ({ onSaved }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const validKey = await validateApiKey(value);
      setApiKey(validKey);
      onSaved?.(validKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2.5} component="form" onSubmit={handleSave}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Key fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6">Connect TMDb</Typography>
            <Typography variant="body2" color="text.secondary">
              Paste your free API key to load real movie data.
            </Typography>
          </Box>
        </Stack>

        <Alert severity="info" variant="outlined">
          Create a free key at{' '}
          <Link
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            themoviedb.org/settings/api
          </Link>
          {' '}
          (sign up → Settings → API → Request API Key → Developer). Then paste the
          v3 API key below.
        </Alert>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="TMDb API Key (v3)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your API key here"
          fullWidth
          autoFocus
          required
          helperText="Saved in this browser only. You can also put it in .env as REACT_APP_TMDB_API_KEY."
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button type="submit" variant="contained" disabled={saving} size="large">
            {saving ? 'Verifying…' : 'Save & load movies'}
          </Button>
          <Button
            component="a"
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            endIcon={<OpenInNew />}
            size="large"
          >
            Get free API key
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ApiKeySetup;
