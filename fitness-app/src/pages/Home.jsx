import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { Container, Typography } from '@mui/material';
import WorkoutCard from '../components/WorkoutCard'; // Az új komponens importálása

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
          <WorkoutCard 
            key={workout.id} 
            workout={workout} 
            onDelete={deleteWorkout} 
          />
        ))
      )}
    </Container>
  );
};

export default Home;