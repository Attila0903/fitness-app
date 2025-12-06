import React from 'react';
import { Typography, Container } from '@mui/material';

const Statistics = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Statisztika
      </Typography>
      <Typography variant="body1">
        Grafikonok hamarosan...
      </Typography>
    </Container>
  );
};

export default Statistics;