import { Router } from 'express';
import {MoviesController} from './../../../application/controllers/moviesController';

const router = Router();

export function setMoviesRoutes(app: Router) {
    app.post('/movies', MoviesController.create);
    app.get('/movies', MoviesController.getAll);
    app.get('/movies/:id', MoviesController.getById);
    app.put('/movies/:id', MoviesController.update);
    app.delete('/movies/:id', MoviesController.delete);
}