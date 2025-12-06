import React, { useState, useMemo } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { 
  Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, Card, CardContent 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function WorkoutDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected = !props.outsideCurrentMonth && highlightedDays.includes(day.format('YYYY-MM-DD'));

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <FitnessCenterIcon sx={{ fontSize: 12, color: 'white' }} /> : undefined}
      color="success"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const Statistics = () => {
  const { workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');

  const uniqueExerciseNames = useMemo(() => {
    const names = new Set();
    workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        if (ex.name) names.add(ex.name);
      });
    });
    return Array.from(names).sort();
  }, [workouts]);

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

  const workoutDates = useMemo(() => workouts.map(w => w.date), [workouts]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statisztika
      </Typography>

      {/* MODERN GRID HASZNÁLAT (Grid2) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* size={{ xs: 12, md: 6 }} a régi xs={12} md={6} helyett */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <EventAvailableIcon />
                <Typography variant="h6">Összes edzés</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">{workouts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon />
                <Typography variant="h6">Gyakorlatok</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">{uniqueExerciseNames.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* NAPTÁR: Keskenyebb (md: 4 egység) */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'center', height: '100%' }}>
            <DateCalendar
              readOnly
              slots={{ day: WorkoutDay }}
              slotProps={{ day: { highlightedDays: workoutDates } }}
            />
          </Paper>
        </Grid>

        {/* GRAFIKON: Szélesebb (md: 8 egység) */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>Fejlődés követése</Typography>
            
            <Box sx={{ mb: 3, maxWidth: 300 }}>
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

            <Box sx={{ width: '100%', height: 350 }}>
              {selectedExercise ? (
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="kg" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Max Súly" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">Válassz gyakorlatot!</Typography>
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