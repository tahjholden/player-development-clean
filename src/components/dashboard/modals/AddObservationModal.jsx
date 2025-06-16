import React from 'react';
import { Modal, Box, Typography, Paper } from '@mui/material';

const AddObservationModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-observation-modal"
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
          Add New Observation
        </Typography>
        {/* Add observation form here */}
      </Box>
    </Modal>
  );
};

export default AddObservationModal; 