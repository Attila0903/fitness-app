import React from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * ProgressChart (Fejlődési Grafikon) Komponens.
 * * Ez a komponens felelős a kiválasztott gyakorlat teljesítményének időbeli ábrázolásáért.
 * * Felépítése:
 * - Felső rész: Legördülő menü (Select) a gyakorlat kiválasztásához.
 * - Alsó rész: Maga a vonaldiagram (LineChart), vagy egy tájékoztató üzenet, ha nincs adat.
 * * @param {Object} props
 * @param {string[]} props.uniqueExerciseNames - Az összes választható gyakorlat neve (ABC sorrendben).
 * @param {string} props.selectedExercise - A jelenleg kiválasztott gyakorlat neve (állapot a szülőben).
 * @param {Function} props.onExerciseChange - Callback függvény, ami jelzi a szülőnek, ha a felhasználó váltott.
 * @param {Array} props.chartData - A grafikon számára előkészített adatok: [{ date: '...', weight: 80 }, ...].
 */
const ProgressChart = ({ 
  uniqueExerciseNames, 
  selectedExercise, 
  onExerciseChange, 
  chartData 
}) => {
  // --- FELTÉTELES RENDERELÉS (A doboz tartalma) ---
  let content;

  if (!selectedExercise) {
    // 1. Eset: Nincs kiválasztva semmi
    content = (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="textSecondary">Válassz gyakorlatot a listából!</Typography>
      </Box>
    );
  } else if (chartData.length === 0) {
    // 2. Eset: Kiválasztva, de nincs adat
    content = (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="textSecondary">Ehhez a gyakorlathoz nincs elég adat.</Typography>
      </Box>
    );
  } else {
    // 3. Eset: Minden rendben, rajzolunk
    content = (
      //Responsive Container, hogy automatikusan kitöltse a helyet
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
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: 400 }}>
      <Typography variant="h6" gutterBottom>Fejlődés követése</Typography>
      
      {/* Választó menü (Dropdown) */}
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Válassz gyakorlatot</InputLabel>
          <Select
            value={selectedExercise}
            label="Válassz gyakorlatot"
            // Amikor váltunk, szól a szülőnek (Statistics.jsx)
            onChange={(e) => onExerciseChange(e.target.value)}
          >
            {uniqueExerciseNames.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: '100%', height: 350 }}>
        {content}
      </Box>
    </Paper>
  );
};

export default ProgressChart;