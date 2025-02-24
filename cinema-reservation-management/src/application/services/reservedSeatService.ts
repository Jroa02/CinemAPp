import { ReservedSeat } from '../../domain/entities/ReservedSeat';
import { Seat } from '../../domain/entities/Seat';
import { ReservedSeatRepository } from '../../infrastructure/repositories/ReservedSeatRepository';
import { ReservationRepository } from '../../infrastructure/repositories/ReservationRepository';
import { ScheduleRepository } from '../../infrastructure/repositories/ScheduleRepository';
import { SeatRepository } from '../../infrastructure/repositories/SeatRepository';

export class ReservedSeatService {
    private reservedSeatRepository: ReservedSeatRepository;
    private reservedRepository: ReservationRepository;
    private scheduleRepository: ScheduleRepository;
    private seatRepository: SeatRepository;


    constructor() {
        this.reservedSeatRepository = new ReservedSeatRepository();
        this.reservedRepository = new ReservationRepository
        this.scheduleRepository = new ScheduleRepository();
        this.seatRepository = new SeatRepository();
    }

    async create(reservedSeat: Omit<ReservedSeat, 'id'>): Promise<ReservedSeat> {
        try {

            const reservation = await this.reservedRepository.getById(reservedSeat.reservation_id);
            if (!reservation) { throw { message: 'La reserva no existe', status: 404 }; }

            const schedule = await this.scheduleRepository.getById(reservation.schedule_id);
            if (!schedule) { throw { message: 'La función no existe', status: 404 }; }

            const seat = await this.seatRepository.getAll(schedule.room_id);
            const seatExists = seat.find(s => s.id === reservedSeat.seat_id);
            if (!seatExists) { throw { message: `El asiento no existe para la sala ${schedule.room_id}`, status: 404 }; }

            const response = await this.reservedSeatRepository.create(reservedSeat);
            console.log('Asiento Reservado!', response);
            return response;
        } catch (error: any) {
            console.log('Error creando la Reserva del Asiento', error);
            throw error;
        }
    }

    async getAll(): Promise<ReservedSeat[]> {
        try {
            const reservedSeats = await this.reservedSeatRepository.getAll();
            return reservedSeats;
            console.log('Asientos Reservados', reservedSeats);
        } catch (error: any) {
            console.log('Error ', error);
            throw error;
        }
    }

    async getById(id: number): Promise<ReservedSeat | undefined> {
        try {
            const reservedSeat = await this.reservedSeatRepository.getById(id);
            console.log('Asiento Reservado', reservedSeat);
            return reservedSeat;
        } catch (error: any) {
            console.log('Error ', error);
            throw error;
        }
    }

    async getByScheduleId(schedule_id: number): Promise<Seat[]> {
        try {
            const reservedSeats = await this.reservedSeatRepository.getByScheduleId(schedule_id);
            console.log(`Asientos Reservados para la funcion ${schedule_id}`, reservedSeats);
            return reservedSeats;
        } catch (error: any) {
            console.log('Error ', error);
            throw error;
        }

    }

    async update(id: number, reservedSeat: Partial<ReservedSeat>): Promise<ReservedSeat | undefined> {
        try {
            const response = await this.reservedSeatRepository.update(id, reservedSeat);
            console.log('Asiento Reservado Actualizado', response);
            return response;
        } catch (error: any) {
            console.log('Error ', error);
            throw error;
        }
    }

    async delete(reservation_id: number, seat_id: number ): Promise<void> {
        try {
            await this.reservedSeatRepository.delete(reservation_id, seat_id);
            console.log(`Asiento ID ${seat_id} de la Reserva ID ${reservation_id} eliminado`);
            return
        } catch (error: any) {
            console.log('Error ', error);
            throw error;
        }
    }
}