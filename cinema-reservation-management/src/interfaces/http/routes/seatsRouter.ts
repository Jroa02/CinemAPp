import { Router } from 'express';
import { SeatsController } from './../../../application/controllers/seatsController';

const router = Router();

export function setSeatsRoutes(app: Router) {
    app.post('/seats', SeatsController.create);
    app.get('/seats', SeatsController.getAll);
    app.get('/seats/:id', SeatsController.getById);
    app.get('/seats/reserved/:schedule_id', SeatsController.getReservedSeats);
    app.put('/seats/:id', SeatsController.update);
    app.delete('/seats/:id', SeatsController.delete);
    app.delete('/seats/rooms/:room_id', SeatsController.deleteByRoom)
}