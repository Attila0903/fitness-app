import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
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

const WorkoutCalendar = ({ workouts }) => {
  const workoutDates = useMemo(() => workouts.map(w => w.date), [workouts]);

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DateCalendar
        readOnly
        slots={{ day: WorkoutDay }}
        slotProps={{ day: { highlightedDays: workoutDates } }}
      />
    </Paper>
  );
};

export default WorkoutCalendar;