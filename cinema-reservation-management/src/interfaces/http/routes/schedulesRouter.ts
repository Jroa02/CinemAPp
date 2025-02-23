import { Router } from 'express';
import { SchedulesController } from './../../../application/controllers/schedulesController';

const router = Router();

export function setSchedulesRoutes(app: Router) {
    app.post('/schedules', SchedulesController.create);
    app.get('/schedules', SchedulesController.getAll);
    app.get('/schedules/:id', SchedulesController.getById);
    app.put('/schedules/:id', SchedulesController.update);
    app.delete('/schedules/:id', SchedulesController.delete);
}