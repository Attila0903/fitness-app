import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { v4 as uuidv4 } from 'uuid';
import ExerciseForm from '../components/ExerciseForm'; // Új komponens

const AddWorkout = () => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);
  const [workoutMeta, setWorkoutMeta] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [exercises, setExercises] = useState([]);

  // --- KEZELŐ FÜGGVÉNYEK ---

  const handleStartWorkout = (e) => {
    e.preventDefault();
    if (workoutMeta.name.trim()) setIsStarted(true);
    else alert("Adj nevet az edzésnek!");
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { id: uuidv4(), name: '', sets: [] }]);
  };

  const handleExerciseNameChange = (id, newName) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, name: newName } : ex));
  };

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleAddSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: [...ex.sets, { id: uuidv4(), weight: '', reps: '' }] };
      }
      return ex;
    }));
  };

  const handleSetChange = (exerciseId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map(set => set.id === setId ? { ...set, [field]: value } : set);
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  const handleSetDelete = (exerciseId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      }
      return ex;
    }));
  };

  const handleSaveWorkout = () => {
    const validExercises = exercises.filter(ex => ex.name.trim() !== '' && ex.sets.length > 0);
    if (validExercises.length === 0) {
      alert("Rögzíts legalább egy gyakorlatot és egy szettet!");
      return;
    }
    addWorkout({ ...workoutMeta, exercises: validExercises });
    navigate('/');
  };

  // --- MEGJELENÍTÉS ---

  if (!isStarted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Új Edzés</Typography>
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
            <Button type="submit" variant="contained" size="large" fullWidth startIcon={<PlayArrowIcon />}>
              Indítás
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

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