import { Router } from 'express';
import { ReservationsController } from './../../../application/controllers/reservationsController';

const router = Router();

export function setReservationsRoutes(app: Router) {
    app.post('/reservations', ReservationsController.create);
    app.get('/reservations', ReservationsController.getAll);
    app.get('/reservations/:id', ReservationsController.getById);
    app.get('/reservations/:reservation_id/details', ReservationsController.getDetails);
    app.put('/reservations/:id', ReservationsController.update);
    app.delete('/reservations/:id', ReservationsController.delete);
}