import { Request, Response } from 'express';
import { Notifications } from '../../domain/entities/Notification';
import { NotificationService } from '../services/notificationsService';


const notificationService = new NotificationService();

export const NotificationsController = {
    sendEmail: async (req: Request, res: Response) => {
        try {
            const { to, subject, body } = req.body;
            const notification = new Notifications(to, subject, body);
            await notificationService.sendEmail(notification);
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    }
};