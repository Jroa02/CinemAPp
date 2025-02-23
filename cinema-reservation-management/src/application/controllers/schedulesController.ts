import { Request, Response } from 'express';
import { ScheduleService } from './../services/schedulesService';
import { Schedule } from './../../domain/entities/Schedule';


const scheduleService = new ScheduleService();

export const SchedulesController = {
    create: async (req: Request, res: Response) => {
        try {
            const { movie_id, room_id, date_time } = req.body;
            const schedule = new Schedule(0, movie_id, room_id, date_time); // ID se genera automáticamente
            await scheduleService.create(schedule);
            res.status(201).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const schedules = await scheduleService.getAll();
            res.status(200).json(schedules);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const schedule = await scheduleService.getById(parseInt(req.params.id));
            if (!schedule) {
                return res.status(404).send();;
            }
            res.status(200).json(schedule);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedSchedule = await scheduleService.update(parseInt(req.params.id), req.body);
            if (!updatedSchedule) {
                return res.status(404).send();;
            }
            res.status(200).send();;
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await scheduleService.delete(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },
};