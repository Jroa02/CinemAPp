import { Reservation } from '../../domain/entities/Reservation';
import { Detail } from '../../domain/entities/Detail';
import { ReservationRepository } from '../../infrastructure/repositories/ReservationRepository';

export class ReservationService {
    private reservationRepository: ReservationRepository;

    constructor(reservationRepository: ReservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    private converUTCDateToLocalDate(data: any): any {
        const convertDate = (res: Reservation): Reservation => ({
            ...res,
            reserved_at: res.reserved_at
                ? new Date(res.reserved_at).toLocaleString('es-CO', {
                    timeZone: 'America/Bogota',
                    dateStyle: 'full',
                    timeStyle: 'medium',
                })
                : undefined, // Si reserved_at es null o undefined, se asigna undefined
        });

        if (Array.isArray(data)) {
            return data.map(convertDate);
        } else {
            return convertDate(data);
        }
    }

    async create(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
        try {
            const response = await this.reservationRepository.create(reservation);
            const validateRS = this.converUTCDateToLocalDate(response);
            console.log('Reserva creada:', validateRS);
            return validateRS as Reservation; // Asegura el tipo de retorno
        } catch (error: any) {
            console.error('Error al crear la reserva:', error);
            throw error;
        }
    }

    async getAll(): Promise<Reservation[]> {
        try {
            const reservations = await this.reservationRepository.getAll();
            const validateRS = this.converUTCDateToLocalDate(reservations);
            console.log('Reservas obtenidas:', validateRS);
            return validateRS as Reservation[]; // Asegura el tipo de retorno
        } catch (error: any) {
            console.error('Error al obtener las reservas:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Reservation | undefined> {
        try {
            const reservation = await this.reservationRepository.getById(id);
            const validateRS = this.converUTCDateToLocalDate(reservation);
            console.log('Reserva obtenida:', validateRS);
            return validateRS as Reservation; // Asegura el tipo de retorno
        } catch (error: any) {
            console.error('Error al obtener la reserva:', error);
            throw error;
        }
    }

    async getDetail(reservation_id: number): Promise<Detail[]> {
        try {
            const detail = await this.reservationRepository.getDetail(reservation_id);
            const validateRS = this.converUTCDateToLocalDate(detail);
            console.log('Detalle de la reserva obtenida:', validateRS);
            return validateRS as Detail[]; 
        } catch (error: any) {
            console.error('Error al obtener el detalle de la reserva:', error);
            throw error;
        }
    }

    async update(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined> {
        try {
            const response = await this.reservationRepository.update(id, reservation);
            const validateRS = this.converUTCDateToLocalDate(response as Reservation);
            console.log('Reserva actualizada:', validateRS);
            return validateRS as Reservation; // Asegura el tipo de retorno
        } catch (error: any) {
            console.error('Error al actualizar la reserva:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.reservationRepository.delete(id);
            console.log(`Reserva con id ${id} eliminada`);
        } catch (error: any) {
            console.error('Error al eliminar la reserva:', error);
            throw error;
        }
    }
}