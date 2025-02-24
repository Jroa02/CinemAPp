import React, { useEffect, useState } from "react";
import { Table, Accordion, Card, Spinner, Alert, Button } from "react-bootstrap";
import { ReservationAPI, ReservationSeatAPI, emailAPI } from "../services/api";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expandedReservationId, setExpandedReservationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllReservations = async () => {
    try {
      const response = await ReservationAPI.getAll();
      setReservations(response);
    } catch (err) {
      setError("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationDetails = async (reservationId) => {
    try {
      if (expandedReservationId === reservationId) {
        setExpandedReservationId(null);
        setSelectedReservation(null);
      } else {
        const details = await ReservationAPI.getDetails(reservationId);
        setSelectedReservation(details);
        setExpandedReservationId(reservationId);
      }
    } catch (err) {
      setError("No se pudieron cargar los detalles de la reserva.");
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      return; // Si el usuario cancela, no hacemos nada
    }

    try {
      setLoading(true);
      const reservationToDelete = reservations.find((r) => r.id === reservationId);

      if (!reservationToDelete) {
        throw new Error("Reserva no encontrada.");
      }

      // Verificar que el correo electrónico esté presente
      if (!reservationToDelete.email) {
        throw new Error("No se encontró el correo electrónico de la reserva.");
      }

      // Eliminar los asientos de la reserva
      const seatDetails = await ReservationAPI.getDetails(reservationId);
      for (const seat of seatDetails) {
        await ReservationSeatAPI.delete(reservationId, seat.seat_id);
      }

      // Eliminar la reserva
      await ReservationAPI.delete(reservationId);

      // Enviar correo de confirmación
      await emailAPI.send({
        to: reservationToDelete.email, // Usamos el email de la reserva
        subject: "Su reserva ha sido cancelada exitosamente",
        body: `Ha cancelado la reserva con ID: ${reservationId}`,
      });

      // Actualizar la lista de reservas
      setReservations((prevReservations) =>
        prevReservations.filter((r) => r.id !== reservationId)
      );
      setError(null); // Limpiar errores anteriores
    } catch (err) {
      setError(`No se pudo eliminar la reserva: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 text-white">
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="container mt-5 bg-dark text-white p-4 rounded">
      <h1 className="mb-4">Lista de Reservas</h1>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Usuario</th>
            <th>Email</th>
            <th>Fecha y Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <React.Fragment key={reservation.id}>
              <tr>
                <td>{reservation.id}</td>
                <td>{reservation.user_name}</td>
                <td>{reservation.email}</td>
                <td>{reservation.reserved_at}</td>
                <td>
                  <Button
                    variant={expandedReservationId === reservation.id ? "secondary" : "info"}
                    onClick={() => fetchReservationDetails(reservation.id)}
                    className="me-2"
                  >
                    {expandedReservationId === reservation.id ? (
                      <>
                        <i className="bi bi-eye-slash"></i> Ocultar Detalles
                      </>
                    ) : (
                      <>
                        <i className="bi bi-eye"></i> Ver Detalles
                      </>
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteReservation(reservation.id)}
                    title="Eliminar Reserva"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
              {selectedReservation &&
                selectedReservation[0]?.reservation_id === reservation.id && (
                  <tr>
                    <td colSpan="5">
                      <Accordion defaultActiveKey={expandedReservationId === reservation.id ? "0" : null}>
                        <Card bg="secondary" text="white">
                          <Accordion.Header>
                            Detalles de la Reserva (ID: {reservation.id})
                          </Accordion.Header>
                          <Accordion.Body>
                            <h5>Asientos Reservados</h5>
                            <Table striped bordered hover variant="dark">
                              <thead>
                                <tr>
                                  <th>Asiento ID</th>
                                  <th>Identificador del Asiento</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedReservation.map((seat) => (
                                  <tr key={seat.seat_id}>
                                    <td>{seat.seat_id}</td>
                                    <td>{seat.seat_identifier}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Card>
                      </Accordion>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reservations;