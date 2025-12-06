import React from 'react';
import { Typography, Container } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Edzésnapló
      </Typography>
      <Typography variant="body1">
        Itt jelennek majd meg a korábbi edzések.
      </Typography>
    </Container>
  );
};

export default Home;