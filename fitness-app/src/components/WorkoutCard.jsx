import React from 'react';
import { Card, CardContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

const WorkoutCard = ({ workout, onDelete }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon color="action" />
            <Typography variant="h6">{workout.name}</Typography>
          </Box>
          <IconButton onClick={() => onDelete(workout.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, ml: 4 }}>
          {workout.date}
        </Typography>
        
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ ml: 1 }}>
          {workout.exercises?.map((exercise, idx) => (
            <Box key={exercise.id || idx} mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {exercise.name}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                {exercise.sets?.map((set, sIdx) => (
                  <Chip 
                    key={sIdx} 
                    label={`${set.weight}kg x ${set.reps}`} 
                    size="small" 
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;