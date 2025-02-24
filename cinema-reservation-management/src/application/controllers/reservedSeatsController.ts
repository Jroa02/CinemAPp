import { Request, Response } from 'express';
import { ReservedSeatService } from './../services/reservedSeatService';
import { ReservedSeat } from './../../domain/entities/ReservedSeat';
import { get } from 'http';
import { parse } from 'path';

const reservedSeatService = new ReservedSeatService();

export const ReservedSeatsController = {
    create: async (req: Request, res: Response) => {
        try {
            const { reservation_id, seat_id } = req.body;
            const reservedSeat = new ReservedSeat(0, reservation_id, seat_id);
            await reservedSeatService.create(reservedSeat);
            res.status(201).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const reservedSeats = await reservedSeatService.getAll();
            res.status(200).json(reservedSeats);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const reservedSeat = await reservedSeatService.getById(parseInt(req.params.id));
            if (!reservedSeat) {
                return res.status(404).send();
            }
            res.status(200).json(reservedSeat);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getByScheduleId: async (req: Request, res: Response) => {
        try {
            const reservedSeats = await reservedSeatService.getByScheduleId(parseInt(req.params.schedule_id));
            if (!reservedSeats) {
                return res.status(404).send();
            }
            res.status(200).json(reservedSeats);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedReservedSeat = await reservedSeatService.update(parseInt(req.params.id), req.body);
            if (!updatedReservedSeat) {
                return res.status(404).send();
            }
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await reservedSeatService.delete(parseInt(req.params.reservation_id),parseInt(req.params.seat_id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    }
};