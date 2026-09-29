import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore, FilterList, RestartAlt } from '@mui/icons-material';
import { useMovies } from '../context/MovieContext';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);
const RATINGS = [
  { value: '', label: 'Any rating' },
  { value: '7', label: '7+ and up' },
  { value: '8', label: '8+ and up' },
  { value: '9', label: '9+ and up' },
];

const Filters = () => {
  const { genres, filters, applyFilters, clearFilters, hasActiveFilters } =
    useMovies();
  const [draft, setDraft] = React.useState(filters);

  React.useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const handleChange = (key) => (event) => {
    setDraft((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleApply = () => {
    applyFilters(draft);
  };

  const handleClear = () => {
    setDraft({ genre: '', year: '', minRating: '' });
    clearFilters();
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderRadius: '16px !important',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterList color="primary" fontSize="small" />
          <Typography fontWeight={700}>Filters</Typography>
          {hasActiveFilters && (
            <Typography variant="caption" color="primary.main" fontWeight={700}>
              Active
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              label="Genre"
              value={draft.genre}
              onChange={handleChange('genre')}
            >
              <MenuItem value="">All genres</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={String(g.id)}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              label="Year"
              value={draft.year}
              onChange={handleChange('year')}
            >
              <MenuItem value="">Any year</MenuItem>
              {YEARS.map((y) => (
                <MenuItem key={y} value={String(y)}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="rating-label">Min rating</InputLabel>
            <Select
              labelId="rating-label"
              label="Min rating"
              value={draft.minRating}
              onChange={handleChange('minRating')}
            >
              {RATINGS.map((r) => (
                <MenuItem key={r.value || 'any'} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexShrink: 0,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Button
              variant="contained"
              onClick={handleApply}
              fullWidth
              sx={{ minWidth: { md: 96 } }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={handleClear}
              disabled={!hasActiveFilters}
              fullWidth
              sx={{ minWidth: { md: 110 } }}
            >
              Reset
            </Button>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default Filters;
