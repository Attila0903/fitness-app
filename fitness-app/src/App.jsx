import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddWorkout from './pages/AddWorkout';
import Statistics from './pages/Statistics';
import Footer from './components/Footer'; // ÚJ IMPORT
import { CssBaseline, Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      
      {/* Flexbox layout, hogy a Footer mindig legalul legyen */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/*Navigációs sáv*/}
        <Navbar />

        {/* A tartalomnak flex-grow, hogy kitöltse a helyet */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddWorkout />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </Box>

        {/*Lábléc*/}
        <Footer /> 
      </Box>
    </BrowserRouter>
  );
}

export default App;