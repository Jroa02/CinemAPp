import { Seat } from '../../domain/entities/Seat';
import { SeatRepository } from '../../infrastructure/repositories/SeatRepository';

export class SeatService {
    private seatRepository: SeatRepository;

    constructor() {
        this.seatRepository = new SeatRepository();
    }

    async create(seat: Omit<Seat, 'id'>): Promise<Seat> {
        try {
            const response = await this.seatRepository.create(seat);
            console.log('Asiento creado:', response);
            return response;
        } catch (error: any) {
            console.log('Error al crear el asiento:', error);
            throw error
        }
    }

    async getAll(id: number): Promise<Seat[]> {
        try {
            const seats = await this.seatRepository.getAll(id);
            console.log('Asientos obtenidos:', seats);
            return seats;
        } catch (error: any) {
            console.log('Error al obtener los asientos:', error);
            throw error
        }
    }

    async getById(id: number): Promise<Seat | undefined> {
        try {
            const seat = await this.seatRepository.getById(id);
            console.log('Asiento obtenido:', seat);
            return seat;
        } catch (error: any) {
            console.log('Error al obtener el asiento:', error);
            throw error
        }
    }

    async getReservedSeats(schedule_id: number): Promise<object> {
        try {
            const seats = await this.seatRepository.getReservedSeats(schedule_id);
            console.log('Asientos reservados obtenidos:', seats);
            return seats;
        } catch (error: any) {
            console.log('Error al obtener los asientos reservados:', error);
            throw error
        }

    }

    async update(id: number, seat: Partial<Seat>): Promise<Seat | undefined> {
        try {
            const response = await this.seatRepository.update(id, seat);
            console.log('Asiento actualizado:', response);
            return response;
        } catch (error: any) {
            console.log('Error al actualizar el asiento:', error);
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.seatRepository.delete(id);
            console.log('Asiento eliminado:', id);
            return;
        } catch (error: any) {
            console.log('Error al eliminar el asiento:', error);
            throw error
        }
    }

    async deleteByRoom(room_id: number): Promise<void> {
        try {
            await this.seatRepository.deleteByRoom(room_id);
            console.log('Asientos eliminados de la sala:', room_id);
            return;
        } catch (error: any) {
            console.log('Error al eliminar los asientos de la sala:', error);
            throw error
        }

    }
}