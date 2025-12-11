import React from 'react';
import { Box, Typography, Container } from '@mui/material';

/**
 * Footer (Lábléc) Komponens
 * * Ez az alkalmazás alsó sávja, amely minden oldalon megjelenik.
 * * Felépítés és Stílusozás:
 * - A `component="footer"` prop szemantikus HTML5 taget (<footer>) eredményez a jobb SEO és akadálymentesség érdekében.
 * - A `mt: 'auto'` (margin-top: auto) beállítás kritikus a "Sticky Footer" hatáshoz:
 * ez tolja le a láblécet a képernyő aljára, ha kevés a tartalom az oldalon (ehhez kell a flexbox a szülőben).
 */
const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">          
          Fitness App {new Date().getFullYear()}         
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;