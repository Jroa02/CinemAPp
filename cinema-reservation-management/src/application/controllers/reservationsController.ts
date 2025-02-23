import { Request, Response } from 'express';
import { ReservationService } from './../services/reservationsService';
import { ReservationRepository } from './../../infrastructure/repositories/ReservationRepository';
import { Reservation } from './../../domain/entities/Reservation';

const reservationRepository = new ReservationRepository();
const reservationService = new ReservationService(reservationRepository);

export const ReservationsController = {
    create: async (req: Request, res: Response) => {
        try {
            const { schedule_id, user_name, email, reserved_at } = req.body;
            const reservation = new Reservation(0, schedule_id, user_name, email); // ID se genera automáticamente
            await reservationService.create(reservation);
            res.status(201).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const reservations = await reservationService.getAll();
            // UTC local Date
            const userTimeZone = 'America/Bogota';
            const reservationsWithLocalTime = reservations.map(reservation => {
                const reservedAtLocal = reservation.reserved_at ? new Date(reservation.reserved_at).toLocaleString('es-CO', {
                    timeZone: userTimeZone,
                    dateStyle: 'full', 
                    timeStyle: 'medium', 
                }):null;
                return {
                    ...reservation,
                    reserved_at: reservedAtLocal
                };
            });

            // Devolver las reservas con la hora convertida
            res.status(200).json(reservationsWithLocalTime);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const reservation = await reservationService.getById(parseInt(req.params.id));
            if (!reservation) {
                return res.status(404).send();
            }
            // UTC local Date
            const userTimeZone = 'America/Bogota';
            const reservedAtLocal = reservation.reserved_at
                ? new Date(reservation.reserved_at).toLocaleString('es-CO', {
                    timeZone: userTimeZone,
                    dateStyle: 'full',
                    timeStyle: 'medium',
                })
                : null;
            res.status(200).json({ ...reservation, reserved_at: reservedAtLocal })
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedReservation = await reservationService.update(parseInt(req.params.id), req.body);
            if (!updatedReservation) {
                return res.status(404).send();
            }
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await reservationService.delete(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },
};