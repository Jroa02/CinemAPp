import React, { useEffect, useState } from "react";
import { SeatAPI, ReservationAPI, ReservationSeatAPI, emailAPI } from "../services/api";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const ReservationModal = ({ roomId, onClose, scheduleId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const seatsData = await SeatAPI.getByRoom(roomId);
        setSeats(seatsData);

        const reservedData = await SeatAPI.getReservedBySchedule(scheduleId);
        setReservedSeats(reservedData.map((seat) => seat.id));

      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [roomId, scheduleId]);

  const handleSeatClick = (seat) => {
    if (reservedSeats.includes(seat.id)) return;
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) {
      alert("Por favor, selecciona al menos un asiento.");
      return;
    }

    if (!name || !email) {
      alert("Por favor, ingresa tu nombre y email.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, ingresa un email válido.");
      return;
    }

    try {
      const reservationResponse = await ReservationAPI.create({
        schedule_id: scheduleId,
        user_name: name,
        email: email,
      });

      if (reservationResponse === null) {
        throw new Error("Error al crear la reserva");
      }

      for (const seat of selectedSeats) {
        await ReservationSeatAPI.create({
          reservation_id: reservationResponse.id,
          seat_id: seat.id,
        });
      }

      await emailAPI.send({to:email,subject:`${name} Su reserva a sido Creada exitosamente!!`, body:`A reservado ${selectedSeats.length} asientos`});

      alert(`Reserva creada con éxito. ID de reserva: ${reservationResponse.id}`);
      onClose();
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Hubo un error al crear la reserva. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Reservar Asientos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Form>

        <Row className="g-3">
          {seats.map((seat) => (
            <Col key={seat.id} xs={3} sm={2}>
              <Button
                variant={
                  reservedSeats.includes(seat.id)
                    ? "secondary"
                    : selectedSeats.some((s) => s.id === seat.id)
                    ? "primary"
                    : "outline-primary"
                }
                className="w-100"
                onClick={() => handleSeatClick(seat)}
                disabled={reservedSeats.includes(seat.id)}
              >
                {seat.seat_identifier}
              </Button>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleReserve}>
          Reservar ({selectedSeats.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationModal;
