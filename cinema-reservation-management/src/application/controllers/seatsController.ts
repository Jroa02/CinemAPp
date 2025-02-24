import { Request, Response } from 'express';
import { SeatService } from './../services/seatsService';
import { Seat } from './../../domain/entities/Seat';


const seatService = new SeatService();

export const SeatsController = {
    create: async (req: Request, res: Response) => {
        try {
            const { room_id, seat_identifier } = req.body;
            const seat = new Seat(0, room_id, seat_identifier); // ID se genera automáticamente
            await seatService.create(seat);
            res.status(201).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const seats = await seatService.getAll(parseInt(req.query.room as string)||0);
            res.status(200).json(seats);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const seat = await seatService.getById(parseInt(req.params.id));
            if (!seat) {
                return res.status(404).send();
            }
            res.status(200).json(seat);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getReservedSeats: async (req: Request, res: Response) => {
        try {
            const seats = await seatService.getReservedSeats(parseInt(req.params.schedule_id));
            res.status(200).json(seats);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedSeat = await seatService.update(parseInt(req.params.id), req.body);
            if (!updatedSeat) {
                return res.status(404).send();
            }
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await seatService.delete(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    deleteByRoom: async (req: Request, res: Response) => {
        try {
            await seatService.deleteByRoom(parseInt(req.params.room_id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
    }
    }   
}