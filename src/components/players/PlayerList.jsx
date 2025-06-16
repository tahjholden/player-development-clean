import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PlayerList = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Player List
        </Typography>
        {/* Add player list here */}
      </Paper>
    </Box>
  );
};

export default PlayerList; 