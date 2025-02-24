import React, { useEffect, useState } from "react";
import { RoomAPI } from "../services/api";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState(0);
  const [errors, setErrors] = useState({}); // Para manejar errores de validación

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomAPI.getAll();
        setRooms(data);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta sala?")) {
      try {
        await RoomAPI.delete(id);
        setRooms(rooms.filter((room) => room.id !== id));
      } catch (error) {
        console.log("Error deleting room:", error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newRoomName.trim()) {
      newErrors.newRoomName = "El nombre de la sala no puede estar vacío.";
    }
    if (newRoomCapacity <= 0) {
      newErrors.newRoomCapacity = "La capacidad debe ser mayor que 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleCreateRoom = async () => {
    if (!validateForm()) return; // Si hay errores, no continúa

    try {
      const newRoom = {
        name: newRoomName,
        capacity: Number(newRoomCapacity),
      };
      await RoomAPI.create(newRoom);
      setShowCreateModal(false);
      setNewRoomName("");
      setNewRoomCapacity(0);
      const data = await RoomAPI.getAll();
      setRooms(data);
    } catch (error) {
      console.log("Error creating room:", error);
    }
  };

  return (
    <div className="container mt-4 bg-dark text-white p-4 rounded">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          <Plus size={24} />
        </Button>
        <h2>Salas Disponibles</h2>
      </div>

      {rooms.length > 0 ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(room.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No hay salas disponibles.</p>
      )}

      {/* Modal con estilo personalizado y validación */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        contentClassName="bg-success text-white" // Fondo verde y letra blanca
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Crear Sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Sala</Form.Label>
              <Form.Control
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                isInvalid={!!errors.newRoomName} // Marcar como inválido si hay error
              />
              {errors.newRoomName && (
                <Form.Control.Feedback type="invalid">
                  {errors.newRoomName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                value={newRoomCapacity}
                onChange={(e) => setNewRoomCapacity(e.target.value)}
                isInvalid={!!errors.newRoomCapacity} // Marcar como inválido si hay error
              />
              {errors.newRoomCapacity && (
                <Form.Control.Feedback type="invalid">
                  {errors.newRoomCapacity}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="light" onClick={handleCreateRoom}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Rooms;