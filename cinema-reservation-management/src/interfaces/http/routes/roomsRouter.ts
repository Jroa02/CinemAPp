import { Router } from 'express';
import { RoomsController } from './../../../application/controllers/roomsController';

const router = Router();

export function setRoomsRoutes(app: Router) {
    app.post('/rooms', RoomsController.create);
    app.get('/rooms', RoomsController.getAll);
    app.get('/rooms/:id', RoomsController.getById);
    app.put('/rooms/:id', RoomsController.update);
    app.delete('/rooms/:id', RoomsController.delete);
}