import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/**
 * Navbar (Navigációs Sáv) Komponens.
 * * Ez az alkalmazás felső menüsorát valósítja meg.
 * * Felhasznált technológiák:
 * - **Material UI AppBar & Toolbar**
 * - **React Router Integration:** A gombok (`Button`) a `component={RouterLink}` prop segítségével
 * közvetlenül a React Router navigációs rendszerét használják, így az oldal újratöltés nélkül vált nézetet (SPA működés).
 * - **Flexbox:** A `flexGrow: 1` a címnél balra tolja a logót, jobbra pedig a menüpontokat.
 */
const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo és Cím */}
        <FitnessCenterIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fitness App
        </Typography>

        {/* Menügombok - React Router Linkkel összekötve */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Napló
          </Button>
          <Button color="inherit" component={RouterLink} to="/add">
            Új edzés
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Statisztika
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;