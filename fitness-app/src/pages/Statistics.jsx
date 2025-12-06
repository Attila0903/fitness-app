import React, { useState, useMemo } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { 
  Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Badge 
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Naptárhoz szükséges importok
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import 'dayjs/locale/hu'; // Magyar lokalizáció

// Beállítjuk a dayjs-t magyarra, hogy a naptár magyar legyen (Hétfő, Kedd...)
dayjs.locale('hu');

/**
 * Egyedi nap megjelenítő komponens a naptárhoz.
 * Ha az adott napon volt edzés, tesz rá egy ikont/jelzést.
 */
function WorkoutDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // Megnézzük, hogy a naptár éppen renderelt napja (day) benne van-e a mi edzéslistánkban
  // A format('YYYY-MM-DD') biztosítja, hogy a szöveges dátumokat hasonlítsuk össze
  const isSelected = !props.outsideCurrentMonth && highlightedDays.includes(day.format('YYYY-MM-DD'));

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <FitnessCenterIcon sx={{ fontSize: 12, color: 'white' }} /> : undefined}
      color="success" // Zöld színű jelzés
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Jobb aljára tesszük
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const Statistics = () => {
  const { workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');

  // 1. Összes egyedi gyakorlatnév kigyűjtése
  const uniqueExerciseNames = useMemo(() => {
    const names = new Set();
    workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        if (ex.name) names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [workouts]);

  // 2. Grafikon adatok
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

  // 3. Kigyűjtjük azokat a dátumokat, amikor volt edzés (a naptár jelöléshez)
  const workoutDates = useMemo(() => {
    return workouts.map(w => w.date);
  }, [workouts]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statisztika
      </Typography>

      {/* Felső információs kártyák */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <EventAvailableIcon />
                <Typography variant="h6">Összes edzés</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {workouts.length}
              </Typography>
              <Typography variant="body2">alkalommal edzettél eddig</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon />
                <Typography variant="h6">Gyakorlatok</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {uniqueExerciseNames.length}
              </Typography>
              <Typography variant="body2">különböző típus</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* NAPTÁR SZEKCIÓ - Bal oldal (vagy fenti mobilon) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'center', height: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
              <DateCalendar
                readOnly // Hogy ne lehessen átkattintani a dátumot
                slots={{
                  day: WorkoutDay, // Itt adjuk át a saját renderelőnket
                }}
                slotProps={{
                  day: {
                    highlightedDays: workoutDates, // Átadjuk a dátumok listáját
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* GRAFIKON SZEKCIÓ - Jobb oldal */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%'}}>
            <Typography variant="h6" gutterBottom>
              Fejlődés követése
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Válassz gyakorlatot</InputLabel>
                <Select
                  value={selectedExercise}
                  label="Válassz gyakorlatot"
                  onChange={(e) => setSelectedExercise(e.target.value)}
                >
                  {uniqueExerciseNames.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: '100%', height: 250 }}>
              {selectedExercise ? (
                chartData.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit="kg" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#8884d8" 
                        name="Max Súly" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="body2" color="textSecondary" align="center">
                      Nincs elég adat a grafikonhoz.<br/>Vegyél fel több edzést ezzel a gyakorlattal!
                    </Typography>
                  </Box>
                )
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="body2" color="textSecondary" align="center">
                    Válassz egy gyakorlatot a fenti listából,<br/>hogy lásd a fejlődésed!
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;