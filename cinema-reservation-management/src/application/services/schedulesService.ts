import { Schedule } from '../../domain/entities/Schedule';
import { ScheduleRepository } from '../../infrastructure/repositories/ScheduleRepository';

export class ScheduleService {
    private scheduleRepository: ScheduleRepository;

    constructor() {
        this.scheduleRepository = new ScheduleRepository();   
    }

    async create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
        try {
            const response = await this.scheduleRepository.create(schedule);
            console.log('Horario creado:', response);
            return response;
        } catch (error: any) {
            console.error('Error al crear el horario:', error);
            throw error
        }
    }

    async getAll(): Promise<Schedule[]> {
        try {
            const schedules = await this.scheduleRepository.getAll();
            console.log('Horarios obtenidos!!',schedules);
            return schedules;
        } catch (error: any) {
            console.error('Error al obtener los horarios:', error);
            throw error
        }
    }

    async getById(id: number): Promise<Schedule | undefined> {
        try {
            const schedule = await this.scheduleRepository.getById(id);
            console.log('Horario obtenido:', schedule);
            return schedule;
        } catch (error: any) {
            console.error('Error al obtener el horario:', error);
            throw error
        }
    }

    async update(id: number, schedule: Schedule): Promise<Schedule | undefined> {
        try {
            const response = await this.scheduleRepository.update(id, schedule);
            console.log('Horario actualizado:', response);
            return response;
        } catch (error: any) {
            console.error('Error al actualizar el horario:', error);
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.scheduleRepository.delete(id);
            console.log('Horario eliminado:', id);
        } catch (error: any) {
            console.error('Error al eliminar el horario:', error);
            throw error
        }
    }
}