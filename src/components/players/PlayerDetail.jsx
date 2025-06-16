import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PlayerDetail = ({ isNew }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNew ? 'New Player' : 'Player Details'}
        </Typography>
        {/* Add player form/details here */}
      </Paper>
    </Box>
  );
};

export default PlayerDetail; 