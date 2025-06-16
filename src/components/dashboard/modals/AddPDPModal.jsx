import React from 'react';
import { Modal, Box, Typography, Paper } from '@mui/material';

const AddPDPModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-pdp-modal"
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
          Add New PDP
        </Typography>
        {/* Add PDP form here */}
      </Box>
    </Modal>
  );
};

export default AddPDPModal; 