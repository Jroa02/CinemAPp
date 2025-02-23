import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
    create(reservation: Omit<Reservation, 'id'>): Promise<Reservation>;
    getAll(): Promise<Reservation[]>;
    getById(id: number): Promise<Reservation | undefined>;
    update(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined>;
    delete(id: number): Promise<void>;
}