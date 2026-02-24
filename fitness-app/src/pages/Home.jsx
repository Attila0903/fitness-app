import React from "react";
import { useWorkouts } from "../context/WorkoutContext";
import { Container, Typography, CircularProgress } from "@mui/material";
import WorkoutCard from "../components/WorkoutCard"; // Az új komponens importálása

/**
 * Főoldal (Home) Komponens.
 * * Ez az alkalmazás kezdőképernyője, a "Napló".
 * * Funkciói:
 * 1. Lekéri az összes rögzített edzést a Context-ből.
 * 2. Ha nincs edzés, egy üres állapotot (empty state) és útmutatást jelenít meg.
 * 3. Ha van edzés, listázza őket időrendben (a Context alapértelmezése szerint),
 * minden edzést egy külön `WorkoutCard` komponenssel megjelenítve.
 * 4. Továbbadja a törlés funkciót a kártyáknak.
 */
const Home = () => {
  const { workouts, isLoadingWorkout, deleteWorkout } = useWorkouts();

  const renderWorkoutContent = () => {
    if (workouts.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary">
          Még nincs rögzített edzésed. Kattints az "Új edzés" gombra!
        </Typography>
      );
    }

    return workouts.map((workout) => (
      <WorkoutCard
        /* Lista renderelése: Minden edzéshez egy kártyát hozunk létre */
        key={workout.id}
        workout={workout}
        onDelete={deleteWorkout}
      />
    ));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1">
        Korábbi Edzések
      </Typography>

      {isLoadingWorkout ? (
        <CircularProgress color="primary" size={60} thickness={4} />
      ) : (
        renderWorkoutContent()
      )}
    </Container>
  );
};

export default Home;
