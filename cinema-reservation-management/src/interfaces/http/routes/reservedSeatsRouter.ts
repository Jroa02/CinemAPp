import { Router } from 'express';
import { ReservedSeatsController } from './../../../application/controllers/reservedSeatsController';

const router = Router();

export function setReservedSeatsRoutes(app: Router) {
    app.post('/reserved-seats', ReservedSeatsController.create);
    app.get('/reserved-seats', ReservedSeatsController.getAll);
    app.get('/reserved-seats/:id', ReservedSeatsController.getById);
    app.put('/reserved-seats/:id', ReservedSeatsController.update);
    app.delete('/reserved-seats/:reservation_id/:seat_id', ReservedSeatsController.delete);
    app.get('/reserved-seats/schedules/:schedule_id', ReservedSeatsController.getByScheduleId);
}