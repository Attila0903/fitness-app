import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'  <-- Ezt kikommentezheted vagy törölheted, ha zavar a default stílus
import { WorkoutProvider } from './context/WorkoutContext'; // Importáljuk a Providert

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Becsomagoljuk az App-ot, így mindenki eléri az adatokat */}
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </React.StrictMode>,
)