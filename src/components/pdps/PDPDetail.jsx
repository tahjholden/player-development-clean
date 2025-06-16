import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PDPDetail = ({ isNew }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNew ? 'New PDP' : 'PDP Details'}
        </Typography>
        {/* Add PDP form/details here */}
      </Paper>
    </Box>
  );
};

export default PDPDetail; 