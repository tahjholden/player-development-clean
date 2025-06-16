import React from 'react';
import { Modal, Box, Typography, Paper } from '@mui/material';

const PDPHistoryModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pdp-history-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">
          PDP History
        </Typography>
        {/* Add PDP history list here */}
      </Box>
    </Modal>
  );
};

export default PDPHistoryModal; 