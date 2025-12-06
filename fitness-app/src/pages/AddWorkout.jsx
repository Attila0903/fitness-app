import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom'; // Navigációhoz kell
import { 
  Container, TextField, Button, Typography, Box, 
  Paper, IconButton, Divider, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid'; // Egyedi ID a gyakorlatoknak

const AddWorkout = () => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  // Űrlap állapotok
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Mai dátum alapból
  const [name, setName] = useState('');
  
  // Dinamikus gyakorlat lista állapota
  const [exercises, setExercises] = useState([
    { id: uuidv4(), name: '', sets: '', reps: '', weight: '' } // Egy üres sorral indulunk
  ]);

  /**
   * Új gyakorlat sor hozzáadása
   */
  const handleAddExerciseRow = () => {
    setExercises([
      ...exercises,
      { id: uuidv4(), name: '', sets: '', reps: '', weight: '' }
    ]);
  };

  /**
   * Gyakorlat törlése a listából
   */
  const handleRemoveExerciseRow = (id) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  /**
   * Input mező változásának kezelése a dinamikus listában
   */
  const handleExerciseChange = (id, field, value) => {
    const updatedExercises = exercises.map((ex) => 
      ex.id === id ? { ...ex, [field]: value } : ex
    );
    setExercises(updatedExercises);
  };

  /**
   * Mentés gomb kezelése
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validáció: csak akkor mentünk, ha van név
    if (!name.trim()) {
      alert("Kérlek adj meg egy nevet az edzésnek!");
      return;
    }

    // Összeállítjuk az adatobjektumot
    const workoutData = {
      name,
      date,
      exercises: exercises.filter(ex => ex.name.trim() !== '') // Üres nevűeket kiszűrjük
    };

    // Mentés a Context-be
    addWorkout(workoutData);

    // Visszaugrás a főoldalra
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Új edzés rögzítése
      </Typography>

      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Edzés neve (pl. Mell-Bicepsz)"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Dátum"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Gyakorlatok
        </Typography>

        {exercises.map((exercise, index) => (
          <Paper key={exercise.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" color="primary">
                {index + 1}. Gyakorlat
              </Typography>
              <IconButton 
                color="error" 
                onClick={() => handleRemoveExerciseRow(exercise.id)}
                disabled={exercises.length === 1} // Az utolsót ne lehessen törölni
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gyakorlat neve"
                  fullWidth
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                  placeholder="pl. Fekvenyomás"
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Szériák"
                  type="number"
                  fullWidth
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Ismétlés"
                  type="number"
                  fullWidth
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Súly (kg)"
                  type="number"
                  fullWidth
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(exercise.id, 'weight', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button 
            variant="outlined" 
            startIcon={<AddCircleOutlineIcon />} 
            onClick={handleAddExerciseRow}
          >
            Új gyakorlat
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            type="submit"
            startIcon={<SaveIcon />}
          >
            Mentés
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddWorkout;