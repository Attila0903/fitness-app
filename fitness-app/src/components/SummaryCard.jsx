import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const SummaryCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => {
  return (
    <Card sx={{ bgcolor: `${color}.light`, color: 'white', height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
        {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;