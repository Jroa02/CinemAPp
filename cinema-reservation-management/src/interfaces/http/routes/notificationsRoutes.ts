import { Router } from 'express';
import {NotificationsController} from '../../../application/controllers/notificationsController';

const router = Router();

export function setNotificationsRouter(app: Router) {
    app.post('/notifications/emails', NotificationsController.sendEmail);    
}