import { ReservedSeat } from '../entities/ReservedSeat';

export interface IReservedSeatRepository {
    create(reservedSeat: Omit<ReservedSeat, 'id'>): Promise<ReservedSeat>;
    getAll(schedule_id: number): Promise<ReservedSeat[]>;
    getById(id: number): Promise<ReservedSeat | undefined>;
    update(id: number, reservedSeat: Partial<ReservedSeat>): Promise<ReservedSeat | undefined>;
    delete(id: number): Promise<void>;
}