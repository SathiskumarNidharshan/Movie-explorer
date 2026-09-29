import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert
        severity="error"
        variant="outlined"
        action={
          onRetry ? (
            <Button color="inherit" size="small" startIcon={<Refresh />} onClick={onRetry}>
              Retry
            </Button>
          ) : null
        }
      >
        <AlertTitle>Unable to load movies</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
