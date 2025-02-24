import React, { useEffect, useState } from 'react';
import { MovieAPI } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para el modal de confirmación
  const [movieToDelete, setMovieToDelete] = useState(null); // Estado para almacenar el ID de la película a eliminar
  const [movie, setMovie] = useState({
    id: '', // Campo para el ID
    title: '',
    genre: '',
    duration: '',
    classification: '',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await MovieAPI.getAll();
      setMovies(moviesData);
    };
    fetchMovies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...movie, duration: parseInt(movie.duration) };
    if (movie.id) {
      await MovieAPI.update(data);
      setShowEditModal(false);
    } else {
      const { id, ...newMovie } = data;
      await MovieAPI.create(newMovie);
      setShowAddModal(false);
    }
    // Recargar la lista de películas
    const moviesData = await MovieAPI.getAll();
    setMovies(moviesData);
  };

  const handleEditClick = (movie) => {
    setMovie(movie); // Precarga los datos de la película
    setShowEditModal(true); // Abre el modal de edición
  };

  const handleDeleteClick = (id) => {
    setMovieToDelete(id); // Almacena el ID de la película a eliminar
    setShowDeleteModal(true); // Abre el modal de confirmación
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      await MovieAPI.delete(movieToDelete); // Llama al método deleteMovie
      setShowDeleteModal(false); // Cierra el modal de confirmación
      // Recargar la lista de películas
      const moviesData = await MovieAPI.getAll();
      setMovies(moviesData);
    }
  };

  const resetMovieForm = () => {
    setMovie({
      id: '',
      title: '',
      genre: '',
      duration: '',
      classification: '',
    });
  };

  return (
    <div className="container mt-5">
      <Button
        variant="primary"
        className="rounded-circle"
        onClick={() => {
          resetMovieForm(); // Limpia el formulario
          setShowAddModal(true);
        }}
      >
        +
      </Button>

      {/* Modal para agregar película */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Agregar Película</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="title"
                placeholder="Título"
                value={movie.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="genre"
                placeholder="Género"
                value={movie.genre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="duration"
                placeholder="Duración"
                value={movie.duration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="classification"
                placeholder="Clasificación"
                value={movie.classification}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar película */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>Editar Película</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="title"
                placeholder="Título"
                value={movie.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="genre"
                placeholder="Género"
                value={movie.genre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="duration"
                placeholder="Duración"
                value={movie.duration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="classification"
                placeholder="Clasificación"
                value={movie.classification}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar película */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Eliminar Película</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center text-black">
          ¿Estás seguro de que deseas eliminar esta película?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lista de películas */}
      <div className="row mt-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card h-100 movie-box dark-theme">
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">Género: {movie.genre}</p>
                <p className="card-text">Duración: {movie.duration} mins</p>
                <p className="card-text">Clasificación: {movie.classification}</p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => handleEditClick(movie)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(movie.id)} // Pasa el ID de la película al hacer clic
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;