import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          Fitness App {new Date().getFullYear()}
          {'. Minden jog fenntartva.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;