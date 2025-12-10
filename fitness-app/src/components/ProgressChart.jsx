import React from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProgressChart = ({ 
  uniqueExerciseNames, 
  selectedExercise, 
  onExerciseChange, 
  chartData 
}) => {
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
      
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Válassz gyakorlatot</InputLabel>
          <Select
            value={selectedExercise}
            label="Válassz gyakorlatot"
            // Amikor váltasz, szól a szülőnek (Statistics.jsx)
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