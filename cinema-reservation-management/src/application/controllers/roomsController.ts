import { Request, Response } from 'express';
import { RoomService } from './../services/roomsService';
import { Room } from './../../domain/entities/Room';

const roomService = new RoomService();

export const RoomsController = {
    create: async (req: Request, res: Response) => {
        try {
            const { name, capacity } = req.body;
            const room = new Room(0, name, capacity); // ID se genera automáticamente
            await roomService.create(room);
            res.status(201).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const rooms = await roomService.getAll();
            res.status(200).json(rooms);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const room = await roomService.getById(parseInt(req.params.id));
            if (!room) {
                return res.status(404).json({ error: 'Sala no encontrada' });
            }
            res.status(200).json(room);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedRoom = await roomService.update(parseInt(req.params.id), req.body);
            if (!updatedRoom) {
                return res.status(404).send();
            }
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await roomService.delete(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },
};