import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <Nav className="sidebar flex-column p-3">
      <Nav.Item className="mb-4">
        <Nav.Link as={Link} to="/" className="text-light">
          <h4>Cinema Reservation</h4>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <Nav.Link as={Link} to="/movies" className="text-light">
          Películas
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <Nav.Link as={Link} to="/rooms" className="text-light">
          Salas
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <Nav.Link as={Link} to="/schedules" className="text-light">
          Funciones
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-3">
        <Nav.Link as={Link} to="/reservations" className="text-light">
          Reservas
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;