import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddWorkout from './pages/AddWorkout';
import Statistics from './pages/Statistics';

// Material UI téma reset (opcionális, de szebb tőle)
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      {/* CssBaseline normalizálja a böngésző stílusokat */}
      <CssBaseline />
      
      {/* A Navbar mindig látszik */}
      <Navbar />

      {/* Itt cserélődnek az oldalak az URL alapján */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddWorkout />} />
        <Route path="/stats" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;