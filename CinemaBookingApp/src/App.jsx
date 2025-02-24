import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Container fluid className="bg-dark text-light p-0 min-vh-100">
      <Row className="min-vh-100">
        {/* Barra lateral */}
        <Col md={2} className="bg-dark p-0">
          <Sidebar />
        </Col>

        {/* Área de contenido principal */}
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default App;