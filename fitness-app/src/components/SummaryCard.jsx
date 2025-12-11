import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

/**
 * SummaryCard (Összegző Kártya) Komponens.
 * * Ez a komponens egyetlen statisztikai adat (pl. Összes edzés száma) megjelenítésére szolgál.
 * Színes hátteret és kiemelt tipográfiát használ a figyelem felkeltésére.
 * * @param {Object} props - A komponens tulajdonságai
 * @param {Object} props.icon - A megjelenítendő Material UI ikon komponens (referenciaként átadva)
 * @param {string} props.title - A kártya címe (pl. "Összes edzés")
 * @param {number|string} props.value - A fő adat/szám (pl. 12)
 * @param {string} [props.subtitle] - Opcionális alcím vagy magyarázat (pl. "különböző típus")
 */
const SummaryCard = ({ icon: Icon, title, value, subtitle }) => {
  return (
    <Card sx={{ bgcolor: `primary.light`, color: 'white', height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon/>
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