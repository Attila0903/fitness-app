import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, TextField, Button, Typography, Box, 
  Paper, IconButton, Grid, Card, CardContent, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { v4 as uuidv4 } from 'uuid';

const AddWorkout = () => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  // 1. ÁLLAPOT: Setup (Név és Dátum megadása)
  const [isStarted, setIsStarted] = useState(false);
  const [workoutMeta, setWorkoutMeta] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  // 2. ÁLLAPOT: Edzés közben (Gyakorlatok és Szettek)
  // Struktúra: [{ id, name, sets: [{ id, weight, reps }] }]
  const [exercises, setExercises] = useState([]);

  // --- KEZELŐ FÜGGVÉNYEK ---

  const handleStartWorkout = (e) => {
    e.preventDefault();
    if (workoutMeta.name.trim()) {
      setIsStarted(true);
    } else {
      alert("Adj nevet az edzésnek!");
    }
  };

  // Új gyakorlat hozzáadása (pl. Fekvenyomás)
  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { id: uuidv4(), name: '', sets: [] }
    ]);
  };

  // Gyakorlat nevének módosítása
  const handleExerciseNameChange = (id, newName) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, name: newName } : ex));
  };

  // Gyakorlat törlése
  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  // Új SZETT hozzáadása egy konkrét gyakorlathoz
  const handleAddSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, { id: uuidv4(), weight: '', reps: '' }]
        };
      }
      return ex;
    }));
  };

  // Szett adatainak módosítása (súly vagy ismétlés)
  const handleSetChange = (exerciseId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map(set => 
          set.id === setId ? { ...set, [field]: value } : set
        );
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  // Szett törlése
  const handleDeleteSet = (exerciseId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      }
      return ex;
    }));
  };

  // VÉGSŐ MENTÉS
  const handleSaveWorkout = () => {
    // Csak azokat a gyakorlatokat mentjük, amiknek van neve és legalább 1 szettje
    const validExercises = exercises.filter(ex => ex.name.trim() !== '' && ex.sets.length > 0);
    
    if (validExercises.length === 0) {
      alert("Rögzíts legalább egy gyakorlatot és egy szettet!");
      return;
    }

    const finalData = {
      ...workoutMeta,
      exercises: validExercises
    };

    addWorkout(finalData);
    navigate('/');
  };

  // --- MEGJELENÍTÉS ---

  // 1. Nézet: SETUP
  if (!isStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Új Edzés</Typography>
          <Typography variant="body2" color="textSecondary" mb={4}>
            Add meg az alap adatokat az induláshoz
          </Typography>
          
          <Box component="form" onSubmit={handleStartWorkout}>
            <TextField
              label="Edzés neve"
              fullWidth
              required
              value={workoutMeta.name}
              onChange={(e) => setWorkoutMeta({...workoutMeta, name: e.target.value})}
              sx={{ mb: 3 }}
              placeholder="pl. Mell-Hát"
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
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              startIcon={<PlayArrowIcon />}
            >
              Indítás
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // 2. Nézet: EDZÉS RÖGZÍTÉSE
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
        <Card key={exercise.id} sx={{ mb: 3, position: 'relative' }}>
          <CardContent>
            {/* Gyakorlat Fejléc */}
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ mr: 2, width: '30px' }}>#{index + 1}</Typography>
              <TextField 
                variant="standard" 
                placeholder="Gyakorlat neve (pl. Guggolás)"
                fullWidth
                value={exercise.name}
                onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                InputProps={{ style: { fontSize: '1.2rem', fontWeight: 500 } }}
              />
              <IconButton color="error" onClick={() => handleDeleteExercise(exercise.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Szettek listája */}
            {exercise.sets.map((set, setIndex) => (
              <Box key={set.id} display="flex" alignItems="center" mb={1} sx={{ gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: '60px', color: 'text.secondary' }}>
                  {setIndex + 1}. szett
                </Typography>
                
                <TextField
                  label="Súly (kg)"
                  type="number"
                  size="small"
                  sx={{ width: '150px' }}
                  value={set.weight}
                  onChange={(e) => handleSetChange(exercise.id, set.id, 'weight', e.target.value)}
                />
                <TextField
                  label="Ismétlés"
                  type="number"
                  size="small"
                  sx={{ width: '150px' }}
                  value={set.reps}
                  onChange={(e) => handleSetChange(exercise.id, set.id, 'reps', e.target.value)}
                />

                <IconButton size="small" onClick={() => handleDeleteSet(exercise.id, set.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button 
              size="small" 
              startIcon={<AddCircleOutlineIcon />} 
              onClick={() => handleAddSet(exercise.id)}
              sx={{ mt: 1 }}
            >
              Szett hozzáadása
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button 
        variant="outlined" 
        fullWidth 
        size="large" 
        startIcon={<AddCircleOutlineIcon />} 
        onClick={handleAddExercise}
        sx={{ borderStyle: 'dashed', height: '60px' }}
      >
        Új Gyakorlat Felvétele
      </Button>
    </Container>
  );
};

export default AddWorkout;