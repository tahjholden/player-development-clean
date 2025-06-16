import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ObservationList = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Observation List
        </Typography>
        {/* Add observation list here */}
      </Paper>
    </Box>
  );
};

export default ObservationList; 