import { Seat } from '../entities/Seat';

export interface ISeatRepository {
    create(seat: Omit<Seat, 'id'>): Promise<Seat>;
    getAll(id: number): Promise<Seat[]>;
    getById(id: number): Promise<Seat | undefined>;
    update(id: number, seat: Partial<Seat>): Promise<Seat | undefined>;
    delete(id: number): Promise<void>;
}