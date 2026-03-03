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

/**
 * Statistics (Statisztika) Oldal.
 * * Ez a komponens felelős az edzésadatok vizualizációjáért és elemzéséért.
 * * Főbb funkciói:
 * - Összesített számok megjelenítése (Kártyák).
 * - Edzések időbeli eloszlásának ábrázolása naptárban.
 * - Fejlődési grafikon rajzolása kiválasztott gyakorlat alapján.
 * - Eredmények megosztása.
 */
const Statistics = () => {
  const { workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');

  /**
   * 1. Egyedi gyakorlatnevek kigyűjtése.
   * Végigiterál az összes edzés összes gyakorlatán, és egy Set segítségével
   * kiválogatja az egyedi neveket a legördülő menü számára.
   * Csak akkor fut újra, ha a 'workouts' tömb változik.
   */
  const uniqueExerciseNames = useMemo(() => {
    const names = new Set();
    workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        if (ex.name) names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [workouts]);

  /**
   * 2. Grafikon adatainak előkészítése.
   * Ha van kiválasztott gyakorlat, kigyűjti az időpontokat és a hozzájuk tartozó
   * maximális súlyt.
   * - Időrendbe rendezi az edzéseket (másolaton dolgozik!).
   * - Megkeresi az adott napi maximumot.
   * - Visszaad egy objektumtömböt: [{ date: '2023-12-01', weight: 80 }, ...]
   */
  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    const data = [];
    const copy = [...workouts]
    const sortedWorkouts = copy.sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedWorkouts.forEach(workout => {
      const exercise = workout.exercises?.find(ex => ex.name === selectedExercise);
      if (exercise && Array.isArray(exercise.sets)) {
        const maxWeight = Math.max(...exercise.sets.map(s => Number(s.weight) || 0));
        if (maxWeight > 0) {
          data.push({ date: workout.getFormattedDate(), weight: maxWeight });
        }
      }
    });
    return data;
  }, [workouts, selectedExercise]);

  /**
   * 3. Egyéni rekord (PR - Personal Record) kiszámítása.
   * A már előkészített grafikon adatokból ('chartData') keresi meg a legmagasabb értéket.
   */
  const personalRecord = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(d => d.weight));
  }, [chartData]);

  // Megosztandó üzenet összeállítása
  const shareText = `${selectedExercise} gyakorlatban az egyéni rekordom ${personalRecord}kg!`;
  const shareTitle = `Új rekord: ${selectedExercise}`;

  return (
    <Container maxWidth="l" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1">
        Statisztika
      </Typography>

      {/* --- Felső Összesítő Kártyák (Grid elrendezésben) --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard 
            icon={EventAvailableIcon}
            title="Összes edzés"
            value={workouts.length}            
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard 
            icon={TrendingUpIcon}
            title="Gyakorlatok"
            value={uniqueExerciseNames.length}
            subtitle="különböző típus"            
          />
        </Grid>
      </Grid>
      
      {/* --- Megosztás Gomb (Feltételes megjelenítés) --- */}
      {/* Csak akkor mutatjuk, ha a felhasználó választott gyakorlatot */}
      {selectedExercise && (
        <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
          <ShareButton 
            title={shareTitle}
            text={shareText} 
          />
        </Box>
      )}

      {/* --- Alsó szekció: Naptár és Grafikon --- */}
      <Grid container spacing={3}>
        {/* Naptár */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <WorkoutCalendar workouts={workouts} />
        </Grid>

        {/* Grafikon */}
        <Grid size={{ xs: 12, lg: 9 }}>
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