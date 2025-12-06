import React from 'react';
import { Typography, Container } from '@mui/material';

const AddWorkout = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Új edzés rögzítése
      </Typography>
      <Typography variant="body1">
        Űrlap hamarosan...
      </Typography>
    </Container>
  );
};

export default AddWorkout;