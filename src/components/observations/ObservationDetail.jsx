import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ObservationDetail = ({ isNew }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNew ? 'New Observation' : 'Observation Details'}
        </Typography>
        {/* Add observation form/details here */}
      </Paper>
    </Box>
  );
};

export default ObservationDetail; 