import { Reservation } from '../../domain/entities/Reservation';
import { ReservationRepository } from '../../infrastructure/repositories/ReservationRepository';

export class ReservationService {
    private reservationRepository: ReservationRepository;

    constructor(reservationRepository: ReservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    async create(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
        try {
            const response = await this.reservationRepository.create(reservation);
            console.log('Reserva creada:', response);
            return response;
        } catch (error: any) {
            console.error('Error al crear la reserva:', error);
            throw error;
        }
    }

    async getAll(): Promise<Reservation[]> {
        try {
            const reservations = await this.reservationRepository.getAll();
            console.log('Reservas obtenidas:', reservations);
            return reservations;
        } catch (error: any) {
            console.error('Error al obtener las reservas:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Reservation | undefined> {
        try {
            const reservation = await this.reservationRepository.getById(id);
            console.log('Reserva obtenida:', reservation);
            return reservation;
        } catch (error: any) {
            console.error('Error al obtener la reserva:', error);
            throw error;
        }
    }

    async update(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined> {
        try {
            const response = await this.reservationRepository.update(id, reservation);
            console.log('Reserva actualizada:', response);
            return response;
        } catch (error: any) {
            console.error('Error al actualizar la reserva:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.reservationRepository.delete(id);
            console.log('Reserva eliminada:', id);
        } catch (error: any) {
            console.error('Error al eliminar la reserva:', error);
            throw error;
        }
    }
}