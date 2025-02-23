import { Schedule } from '../entities/Schedule';

export interface IScheduleRepository {
    create(schedule: Omit<Schedule, 'id'>): Promise<Schedule>;
    getAll(): Promise<Schedule[]>;
    getById(id: number): Promise<Schedule | undefined>;
    update(id: number, schedule: Partial<Schedule>): Promise<Schedule | undefined>;
    delete(id: number): Promise<void>;
}