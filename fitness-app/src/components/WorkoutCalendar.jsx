import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/**
 * WorkoutDay (Egyedi Nap Renderelő) Komponens.
 * * Ez egy ún. "Slot" komponens, amit a DateCalendar belsejébe injektálunk.
 * A feladata, hogy felülírja, hogyan nézzen ki egyetlen nap a naptárban.
 * * @param {Object} props - A naptártól kapott tulajdonságok (dátum, kiválasztottság, stb.)
 */
function WorkoutDay(props) {
  // Kicsomagoljuk a props-okat. 
  // - highlightedDays: A mi saját listánk az edzésnapokról (amit lentről adtunk át).
  // - day: Az éppen renderelt nap (Dayjs objektum).
  // - outsideCurrentMonth: Bool, jelzi ha a nap nem az aktuális hónaphoz tartozik (halvány).
  // - ...other: Minden más technikai adat (onClick, stílusok), amit a DateCalendar küld.
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // Kiszámoljuk, hogy ezen a napon volt-e edzés.
  // 1. Ne legyen előző/következő hónap napja.
  // 2. A dátum szerepeljen a 'highlightedDays' tömbben.
  const isSelected = !props.outsideCurrentMonth && highlightedDays.includes(day.format('YYYY-MM-DD'));

  return (
    <Badge
      key={props.day.toString()}      
      badgeContent={isSelected ? <FitnessCenterIcon sx={{ fontSize: 12, color: 'white' }} /> : undefined}
      color="success"      
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

/**
 * WorkoutCalendar (Edzés Naptár) Komponens.
 * * Egy statikus naptárat jelenít meg, ahol zöld jelvény jelzi azokat a napokat,
 * amikor a felhasználónak volt rögzített edzése.
 * * @param {Object} props
 * @param {Array} props.workouts - Az edzések tömbje
 */
const WorkoutCalendar = ({ workouts }) => {  
  const workoutDates = useMemo(() => workouts.map(w => w.getFormattedDate()), [workouts]);

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