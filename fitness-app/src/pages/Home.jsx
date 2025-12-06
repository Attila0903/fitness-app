import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { 
  Container, Typography, Card, CardContent, IconButton, Box, Chip, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

const Home = () => {
  const { workouts, deleteWorkout } = useWorkouts();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Korábbi Edzések
      </Typography>

      {workouts.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Még nincs rögzített edzésed. Kattints az "Új edzés" gombra!
        </Typography>
      ) : (
        workouts.map((workout) => (
          <Card key={workout.id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              {/* Fejléc: Dátum és Név */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <EventIcon color="action" />
                  <Typography variant="h6">{workout.name}</Typography>
                </Box>
                <IconButton onClick={() => deleteWorkout(workout.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2, ml: 4 }}>
                {workout.date}
              </Typography>
              
              <Divider sx={{ mb: 2 }} />

              {/* Gyakorlatok listázása */}
              <Box sx={{ ml: 1 }}>
               {workout.exercises?.map((exercise, idx) => (
                  <Box key={exercise.id || idx} mb={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {exercise.name}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                      {/* Itt is használhatjuk a kérdőjelet a szetteknél: */}
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
        ))
      )}
    </Container>
  );
};

export default Home;