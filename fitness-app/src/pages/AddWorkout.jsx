import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { v4 as uuidv4 } from 'uuid';
import ExerciseForm from '../components/ExerciseForm';

/**
 * Új Edzés Rögzítése Oldal (AddWorkout).
 * * Ez a komponens felelős az új edzések összeállításáért és mentéséért.
 * Két fő állapota van:
 * 1. Kezdőképernyő: Edzés nevének és dátumának megadása.
 * 2. Rögzítő képernyő: Gyakorlatok és szettek dinamikus felvétele.
 * * Kezelt funkciók:
 * - Űrlap validáció (kötelező mezők).
 * - Dinamikus lista kezelés (gyakorlatok/szettek hozzáadása és törlése).
 * - Kapcsolódás a Context API-hoz a mentéshez.
 */
const AddWorkout = () => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  // Állapotok
  // isStarted: false = beállító nézet, true = gyakorlatok listája nézet
  const [isStarted, setIsStarted] = useState(false);
  
  // Az edzés metaadatai (fejléc)
  const [workoutMeta, setWorkoutMeta] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  // A gyakorlatok listája
  const [exercises, setExercises] = useState([]);

  // --- KEZELŐ FÜGGVÉNYEK (HANDLERS) ---

  /**
   * Az "Indítás" gomb kezelője.
   * Ellenőrzi, hogy van-e név megadva, majd átvált a részletes nézetre.
   */
  const handleStartWorkout = (e) => {
    e.preventDefault();
    if (workoutMeta.name.trim()) setIsStarted(true);
    else alert("Adj nevet az edzésnek!");
  };

  /**
   * Új, üres gyakorlat blokk hozzáadása a listához.
   * Egyedi ID-t generál (UUID) a helyes React renderelés érdekében.
   */
  const handleAddExercise = () => {
    setExercises([...exercises, { id: uuidv4(), name: '', sets: [] }]);
  };

  /**
   * Gyakorlat nevének frissítése.
   * Megkeresi az adott ID-jú gyakorlatot és módosítja a nevét.
   * @param {string} id - A gyakorlat azonosítója
   * @param {string} newName - Az új név
   */
  const handleExerciseNameChange = (id, newName) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, name: newName } : ex));
  };

  /**
   * Teljes gyakorlat törlése (a benne lévő szettekkel együtt).
   * @param {string} id - A törlendő gyakorlat azonosítója
   */
  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  /**
   * Új szett hozzáadása egy adott gyakorlathoz.
   * Beágyazott map-elést használ, hogy megtalálja a megfelelő gyakorlatot,
   * majd bővíti annak 'sets' tömbjét.
   * @param {string} exerciseId - Melyik gyakorlathoz adjuk?
   */
  const handleAddSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: [...ex.sets, { id: uuidv4(), weight: '', reps: '' }] };
      }
      return ex;
    }));
  };

  /**
   * Egy konkrét szett adatainak (súly vagy ismétlés) módosítása.
   * Mélyen beágyazott állapotfrissítést végez (Gyakorlat -> Szett -> Mező).
   * * @param {string} exerciseId - A szülő gyakorlat ID-ja
   * @param {string} setId - A módosítandó szett ID-ja
   * @param {string} field - Melyik mező változik ('weight' vagy 'reps')
   * @param {string} value - Az új érték
   */
  const handleSetChange = (exerciseId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map(set => set.id === setId ? { ...set, [field]: value } : set);
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  /**
   * Egyetlen szett törlése a listából.
   * @param {string} exerciseId - A gyakorlat ID-ja
   * @param {string} setId - A törlendő szett ID-ja
   */
  const handleSetDelete = (exerciseId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      }
      return ex;
    }));
  };

  /**
   * A teljes edzés mentése.
   * 1. Kiszűri az üres/érvénytelen gyakorlatokat.
   * 2. Ellenőrzi, hogy maradt-e valid adat.
   * 3. Meghívja a Context 'addWorkout' függvényét.
   * 4. Visszanavigál a főoldalra.
   */
  const handleSaveWorkout = () => {
    const validExercises = exercises.filter(ex => ex.name.trim() !== '' && ex.sets.length > 0);
    
    if (validExercises.length === 0) {
      alert("Rögzíts legalább egy gyakorlatot és egy szettet!");
      return;
    }
    
    addWorkout({ ...workoutMeta, exercises: validExercises });
    navigate('/');
  };

  // --- MEGJELENÍTÉS (RENDER) ---

  // 1. Nézet: Kezdőképernyő (ha még nincs elindítva)
  if (!isStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4">Új Edzés</Typography>
          <Box component="form">
            <TextField
              label="Edzés neve"
              fullWidth
              required
              value={workoutMeta.name}
              onChange={(e) => setWorkoutMeta({...workoutMeta, name: e.target.value})}
              sx={{ mb: 3 }}
              placeholder="pl. Hát-Bicepsz"
            />
            <TextField
              label="Dátum"
              type="date"
              fullWidth
              required
              value={workoutMeta.date}
              onChange={(e) => setWorkoutMeta({...workoutMeta, date: e.target.value})}
              sx={{ mb: 4 }}
            />
            <Button variant="contained" onClick={handleStartWorkout} size="large" fullWidth startIcon={<PlayArrowIcon />}>
              Indítás
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // 2. Nézet: Gyakorlatok listája és rögzítése
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4">{workoutMeta.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{workoutMeta.date}</Typography>
        </div>
        <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveWorkout}>
          Edzés Mentése
        </Button>
      </Box>

      {exercises.map((exercise, index) => (
        <ExerciseForm 
          key={exercise.id}
          exercise={exercise}
          index={index}
          onNameChange={handleExerciseNameChange}
          onDelete={handleDeleteExercise}
          onAddSet={handleAddSet}
          onSetChange={handleSetChange}
          onSetDelete={handleSetDelete}
        />
      ))}

      <Button 
        variant="outlined" fullWidth size="large" startIcon={<AddCircleOutlineIcon />} onClick={handleAddExercise}
        sx={{ borderStyle: 'dashed', height: '60px' }}
      >
        Új Gyakorlat Felvétele
      </Button>
    </Container>
  );
};

export default AddWorkout;