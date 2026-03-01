import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// 1. Importáljuk az ExerciseSet osztályt
import { ExerciseSet } from '../model/ExerciseSet';

/**
 * SetRow (Szett) Komponens.
 * Ez a komponens egyetlen szett beviteli mezőit (súly, ismétlés) jeleníti meg.
 * * @param {Object} props - A komponens bemeneti tulajdonságai
 * @param {ExerciseSet} props.set - A szett adatobjektuma a modell alapján
 * @param {number} props.index - A szett sorszáma (0-tól indul, megjelenítésnél +1)
 * @param {Function} props.onChange - Callback függvény az adatváltozás jelzésére (id, field, value)
 * @param {Function} props.onDelete - Callback függvény a szett törlésére (id)
 */
const SetRow = ({ set, index, onChange, onDelete }) => {
  return (   
    <Box display="flex" alignItems="center" mb={1} sx={{ gap: 2 }}>
      {/* Sorszám kijelzése*/}
      <Typography variant="body2" sx={{ minWidth: '60px', color: 'text.secondary' }}>
        {index + 1}. szett
      </Typography>
      
      {/* Súly beviteli mező */}
      <TextField
        label="Súly (kg)"
        type="number"
        size="small"
        sx={{ width: '140px' }}
        value={set.weight}
        onChange={(e) => onChange(set.id, 'weight', e.target.value)}
        placeholder="0"        
      />

      {/* Ismétlés beviteli mező */}
      <TextField
        label="Ismétlés"
        type="number"
        size="small"
        sx={{ width: '140px' }}
        value={set.reps}
        onChange={(e) => onChange(set.id, 'reps', e.target.value)}
        placeholder="0"        
      />

      {/* Törlés gomb */}
      <IconButton size="small" onClick={() => onDelete(set.id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SetRow;