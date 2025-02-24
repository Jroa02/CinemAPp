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
            let reservationRS = await reservationService.create(reservation);
            res.status(200).json(reservationRS);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const reservations = await reservationService.getAll();
            res.status(200).json(reservations);
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
            
            res.status(200).json(reservation)
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getDetails: async (req: Request, res: Response) => {
        try {
            const reservation = await reservationService.getDetail(parseInt(req.params.reservation_id ));
            if (!reservation) {
                return res.status(404).send();
            }
            
            res.status(200).json(reservation)
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