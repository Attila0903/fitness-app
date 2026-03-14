import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { v4 as uuidv4 } from 'uuid';


import {Workout} from '../model/Workout';
import {Exercise} from '../model/Exercise';

import {ExerciseSet} from '../model/ExerciseSet'; 
import ExerciseForm from '../components/ExerciseForm';

const AddWorkout = () => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [savedVolume, setSavedVolume] = useState(0);
  
  // EGYETLEN ÁLLAPOT: A teljes edzés egyetlen osztálypéldányban él
  const [workout, setWorkout] = useState(new Workout({
    name: '',
    date: new Date(),
    exercises: []
  }));

  // --- KEZELŐ FÜGGVÉNYEK (HANDLERS) ---

  const handleStartWorkout = (e) => {
    e.preventDefault();
    // A logikát rábízzuk az osztályra!
    if (workout.isNameValid()) {
      setIsStarted(true);
    } else {
      alert("Kérlek, adj meg egy érvényes nevet az edzésnek (min. 3 karakter)!");
    }
  };

  // Segédfüggvény az állapot frissítéséhez (DRY elv)
  // Létrehoz egy másolatot az edzésből, hogy a React újrarendereljen
  const updateWorkoutState = (updaterFn) => {
    setWorkout(prev => {
      const clonedWorkout = new Workout(prev); // Új példány (mély másolat)
      updaterFn(clonedWorkout); // Módosítjuk a másolatot
      return clonedWorkout; // Visszaadjuk a React-nek
    });
  };

  const handleAddExercise = () => {
    updateWorkoutState((w) => {
      w.exercises.push(new Exercise({ id: uuidv4(), name: '', sets: [] }));
    });
  };

  const handleExerciseNameChange = (id, newName) => {
    updateWorkoutState((w) => {
      const exercise = w.exercises.find(ex => ex.id === id);
      if (exercise) exercise.name = newName;
    });
  };

  const handleDeleteExercise = (id) => {
    updateWorkoutState((w) => {
      w.exercises = w.exercises.filter(ex => ex.id !== id);
    });
  };

  const handleAddSet = (exerciseId) => {
    updateWorkoutState((w) => {
      const exercise = w.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        exercise.sets.push(new ExerciseSet({ id: uuidv4(), weight: 0, reps: 0 }));
      }
    });
  };

  const handleSetChange = (exerciseId, setId, field, value) => {
    updateWorkoutState((w) => {
      const exercise = w.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        const set = exercise.sets.find(s => s.id === setId);
        if (set) set[field] = value;
      }
    });
  };

  const handleSetDelete = (exerciseId, setId) => {
    updateWorkoutState((w) => {
      const exercise = w.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        exercise.sets = exercise.sets.filter(s => s.id !== setId);
      }
    });
  };

  const handleSaveWorkout = async () => {
    // Kiszűrjük az üres gyakorlatokat egy új, mentésre szánt példányban
    const workoutToSave = new Workout(workout);
    workoutToSave.exercises = workoutToSave.exercises.filter(
      ex => ex.name.trim() !== '' && ex.sets.length > 0
    );

    if (workoutToSave.exercises.length === 0) {
      alert("Rögzíts legalább egy gyakorlatot és egy szettet!");
      return;
    }

    const result = await addWorkout(workoutToSave.dtoFormat());

    if (result.success) {
      // Sikeres mentés esetén kinyerjük a Volume-ot és kinyitjuk a Dialogot
      setSavedVolume(result.data.totalVolume);
      setSuccessDialogOpen(true);
    } else {
      // Itt továbbra is kezelheted a hiba ablakot, amit előzőleg csináltunk
      alert(result.message);
    }   
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    navigate('/');
  };

  const getInputValueForDate = () => {
      const d = workout.date;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // --- MEGJELENÍTÉS (RENDER) ---

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
              value={workout.name}
              onChange={(e) => updateWorkoutState(w => w.name = e.target.value)}
              sx={{ mb: 3 }}
              placeholder="pl. Hát-Bicepsz"
            />
            <TextField
              label="Dátum"
              type="date"
              fullWidth
              required
              value={getInputValueForDate()}
              onChange={(e) => updateWorkoutState(w => w.date = new Date(e.target.value))}
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4">{workout.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{getInputValueForDate()}</Typography>
        </div>
        <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveWorkout}>
          Edzés Mentése
        </Button>
      </Box>

      {/* Itt már a workout.exercises tömbön iterálunk végig! */}
      {workout.exercises.map((exercise, index) => (
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

      <Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog}>
        <DialogTitle sx={{ color: 'success.main', fontWeight: 'bold' }}>
          Sikeres edzés! 🎉
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.1rem' }}>
            Szép munka volt a mai! Ezen az edzésen összesen <strong>{savedVolume} kg</strong>-ot mozgattál meg.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="success" variant="contained">
            Irány a főoldal!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddWorkout;