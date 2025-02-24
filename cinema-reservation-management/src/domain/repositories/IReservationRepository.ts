import { Reservation } from '../entities/Reservation';
import { Detail } from '../entities/Detail';

export interface IReservationRepository {
    create(reservation: Omit<Reservation, 'id'>): Promise<Reservation>;
    getAll(): Promise<Reservation[]>;
    getById(id: number): Promise<Reservation | undefined>;
    getDetail(reservation_id: number): Promise<Detail[]>;
    update(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined>;
    delete(id:number): Promise<void>;
}