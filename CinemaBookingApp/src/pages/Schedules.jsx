import React, { useState, useEffect } from "react";
import { ScheduleAPI, MovieAPI, RoomAPI } from "../services/api";
import ReservationModal from "./../components/ReservationModal";
import { Button, Card, Container, Row, Col, Alert, Modal, Form } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ movie_id: "", room_id: "", date_time: "" });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesResponse = await ScheduleAPI.getAll();
        setSchedules(schedulesResponse);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setError("No se pudieron cargar las funciones.");
      }
    };
    const fetchMoviesAndRooms = async () => {
      try {
        const moviesResponse = await MovieAPI.getAll();
        const roomsResponse = await RoomAPI.getAll();
        setMovies(moviesResponse);
        setRooms(roomsResponse);
      } catch (error) {
        console.error("Error fetching movies or rooms:", error);
        setError("No se pudieron cargar las películas o las salas.");
      }
    };
    fetchSchedules();
    fetchMoviesAndRooms();
  }, []);

  const handleReserveClick = (scheduleId, roomId) => {
    setSelectedRoomId(roomId);
    setSelectedScheduleId(scheduleId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedScheduleId(null);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await ScheduleAPI.delete(scheduleId);
      setSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.schedule_id !== scheduleId)
      );
      setError(null);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setError("No se pudo eliminar la función.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newSchedule.movie_id) {
      errors.movie_id = "Debes seleccionar una película.";
    }
    if (!newSchedule.room_id) {
      errors.room_id = "Debes seleccionar una sala.";
    }
    if (!newSchedule.date_time) {
      errors.date_time = "Debes seleccionar una fecha y hora.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retorna true si no hay errores
  };

  const handleCreateSchedule = async () => {
    if (!validateForm()) {
      return; // Si hay errores, no continúa
    }

    try {
      // Transformar el valor de date_time al formato YYYY-MM-DD HH:MM:SS
      const formattedDateTime = newSchedule.date_time.replace("T", " ") + ":00";

      // Convertir movie_id y room_id a números
      const scheduleData = {
        movie_id: Number(newSchedule.movie_id),
        room_id: Number(newSchedule.room_id),
        date_time: formattedDateTime, // Usar el valor transformado
      };

      // Crear la nueva función
      await ScheduleAPI.create(scheduleData);

      // Cerrar el modal y limpiar el formulario
      setShowCreateModal(false);
      setNewSchedule({ movie_id: "", room_id: "", date_time: "" });
      setFormErrors({}); // Limpiar errores de validación
      setError(null);

      // Recargar las funciones
      const schedulesResponse = await ScheduleAPI.getAll();
      setSchedules(schedulesResponse);
    } catch (error) {
      console.error("Error creating schedule:", error);
      setError("No se pudo crear la función.");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4 text-center">Funciones</h1>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Button variant="success" className="mb-4" onClick={() => setShowCreateModal(true)}>
        <Plus /> 
      </Button>

      <Row>
        {schedules.map((schedule) => (
          <Col key={schedule.schedule_id} md={4} className="mb-4">
            <Card className="h-100 shadow dark-theme">
              <Card.Body>
                <Card.Title>{schedule.movie_title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted bg-primary">
                  Sala: {schedule.room_name}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Fecha y hora:</strong> {schedule.date_time}
                </Card.Text>
                <Card.Text>
                  <strong>Duración:</strong> {schedule.duration} mins
                </Card.Text>
                <Card.Text>
                  <strong>Clasificación:</strong> {schedule.classification}
                </Card.Text>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReserveClick(schedule.schedule_id, schedule.room_id)}
                  >
                    Reservar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                  >
                    Eliminar Función
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {showModal && (
        <ReservationModal
          roomId={selectedRoomId}
          onClose={handleCloseModal}
          scheduleId={selectedScheduleId}
        />
      )}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="text-white">Crear Nueva Función</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="movieSelect" className="mb-3">
              <Form.Label>Película</Form.Label>
              <Form.Select
                value={newSchedule.movie_id}
                onChange={(e) => setNewSchedule({ ...newSchedule, movie_id: e.target.value })}
                isInvalid={!!formErrors.movie_id}
              >
                <option value="">Seleccionar película</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
              </Form.Select>
              {formErrors.movie_id && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.movie_id}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="roomSelect" className="mb-3">
              <Form.Label>Sala</Form.Label>
              <Form.Select
                value={newSchedule.room_id}
                onChange={(e) => setNewSchedule({ ...newSchedule, room_id: e.target.value })}
                isInvalid={!!formErrors.room_id}
              >
                <option value="">Seleccionar sala</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </Form.Select>
              {formErrors.room_id && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.room_id}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="dateTime" className="mb-3">
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newSchedule.date_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, date_time: e.target.value })}
                isInvalid={!!formErrors.date_time}
              />
              {formErrors.date_time && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.date_time}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateSchedule}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Schedules;