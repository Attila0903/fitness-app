import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SetRow = ({ set, index, onChange, onDelete }) => {
  return (
    <Box display="flex" alignItems="center" mb={1} sx={{ gap: 2 }}>
      <Typography variant="body2" sx={{ minWidth: '60px', color: 'text.secondary' }}>
        {index + 1}. szett
      </Typography>
      
      <TextField
        label="Súly (kg)"
        type="number"
        size="small"
        sx={{ width: '140px' }}
        value={set.weight}
        onChange={(e) => onChange(set.id, 'weight', e.target.value)}
        placeholder="0"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Ismétlés"
        type="number"
        size="small"
        sx={{ width: '140px' }}
        value={set.reps}
        onChange={(e) => onChange(set.id, 'reps', e.target.value)}
        placeholder="0"
        InputLabelProps={{ shrink: true }}
      />

      <IconButton size="small" onClick={() => onDelete(set.id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SetRow;