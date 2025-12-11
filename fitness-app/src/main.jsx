import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { WorkoutProvider } from './context/WorkoutContext';

// NAPTÁRHOZ SZÜKSÉGES KERETRENDSZER
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/hu'; // Magyar nyelv

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Ez a Provider kell a naptár működéséhez! */}
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
      {/*A WorkoutProvider biztosítja, hogy minden komponensben elérhető legyen a useWorkouts*/}
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </LocalizationProvider>
  </React.StrictMode>,
)