import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; 
import Movies from './pages/Movies';
import Rooms from './pages/Rooms';
import Schedules from './pages/Schedules';
import Reservations from './pages/Reservations';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> {/* Usa App como contenedor principal */}
          <Route path="/movies" element={<Movies />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/reservations" element={<Reservations />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);