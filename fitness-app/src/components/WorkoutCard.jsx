import React from 'react';
import { Card, CardContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
// 1. Importáljuk a Workout osztályt
import { Workout } from '../model/Workout';

/**
 * WorkoutCard Komponens
 * * @param {Object} props - A komponens bemeneti tulajdonságai
 * @param {Workout} props.workout - Az edzés objektum a modell alapján
 * @param {Function} props.onDelete - Callback függvény az edzés törlésekor
 */
const WorkoutCard = ({ workout, onDelete }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        {/* --- Kártya Fejléc: Edzés Neve és Törlés gomb --- */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon color="action" />
            {/* Az IDE most már tudja, hogy a workout.name egy string */}
            <Typography variant="h6">{workout.name}</Typography>
          </Box>
          <IconButton onClick={() => onDelete(workout.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
        
        {/*Dátum - Itt kritikus, hogy a modell példányosítva legyen, így a date egy Date objektum*/}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, ml: 4 }}>
          {workout.date.toLocaleDateString('hu-HU')}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />

        {/*Gyakorlatok és Szettek*/}
        <Box sx={{ ml: 1 }}>
          {workout.exercises?.map((exercise, idx) => (
            <Box key={exercise.id || idx} mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {exercise.name} 
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                {exercise.sets?.map((set, sIdx) => (
                  <Chip 
                    key={sIdx} 
                    label={`${set.weight}kg x ${set.reps}`} 
                    size="small" 
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;