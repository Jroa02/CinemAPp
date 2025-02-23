import { Notifications } from '../../domain/entities/Notification';
import { sendEmail } from './../../infrastructure/email/SesEmailService';

export class NotificationService {
    async sendEmail(notification: Notifications): Promise<boolean> {
        try {
            await sendEmail(notification.to, notification.subject, notification.body);
            console.log('Email enviado:', notification);
            return true;
        } catch (error: any) {
            console.error('Error al enviar el email:', error);
            throw error;
        }
    }
}