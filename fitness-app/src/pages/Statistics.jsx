import React, { useMemo, useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import SummaryCard from '../components/SummaryCard';
import WorkoutCalendar from '../components/WorkoutCalendar';
import ProgressChart from '../components/ProgressChart';
import ShareButton from '../components/ShareButton';

const Statistics = () => {
  const { workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');

  // 1. Gyakorlatnevek kigyűjtése
  const uniqueExerciseNames = useMemo(() => {
    const names = new Set();
    workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        if (ex.name) names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [workouts]);

  // 2. Grafikon adat (és rekord) kiszámolása
  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    const data = [];
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedWorkouts.forEach(workout => {
      const exercise = workout.exercises?.find(ex => ex.name === selectedExercise);
      if (exercise && Array.isArray(exercise.sets)) {
        const maxWeight = Math.max(...exercise.sets.map(s => Number(s.weight) || 0));
        if (maxWeight > 0) {
          data.push({ date: workout.date, weight: maxWeight });
        }
      }
    });
    return data;
  }, [workouts, selectedExercise]);

  // 3. Rekord kiszámítása
  const personalRecord = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(d => d.weight));
  }, [chartData]);

  
  const shareText = `${selectedExercise} gyakorlatban az egyéni rekordom ${personalRecord}kg!`;
  const shareTitle = `Új rekord: ${selectedExercise}`;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statisztika
      </Typography>

      {/* Felső kártyák */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard 
            icon={EventAvailableIcon}
            title="Összes edzés"
            value={workouts.length}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard 
            icon={TrendingUpIcon}
            title="Gyakorlatok"
            value={uniqueExerciseNames.length}
            subtitle="különböző típus"
            color="secondary"
          />
        </Grid>
      </Grid>
      
      {/*
         Csak akkor jelenjen meg ez a blokk,
         ha VAN kiválasztott gyakorlat.
      */}
      {selectedExercise && (
        <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
          <ShareButton 
            title={shareTitle}
            text={shareText} 
          />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Naptár */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <WorkoutCalendar workouts={workouts} />
        </Grid>

        {/* Grafikon */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <ProgressChart 
            uniqueExerciseNames={uniqueExerciseNames}
            selectedExercise={selectedExercise}
            onExerciseChange={setSelectedExercise}
            chartData={chartData}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;