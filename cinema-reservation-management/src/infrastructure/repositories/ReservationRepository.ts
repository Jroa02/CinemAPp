import { Reservation } from '../../domain/entities/Reservation';
import { Detail } from '../../domain/entities/Detail';
import { IReservationRepository } from '../../domain/repositories/IReservationRepository';
import { getPool } from '../database/connection';

export class ReservationRepository implements IReservationRepository {
    private client = getPool();

    private validateRowCount(result: any, message: string, status: number) {
        if (result.rowCount === null || result.rowCount === 0) {
            throw { message, status };
        }
    }

    async create(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
        try {
            const query = `
                INSERT INTO reservation (schedule_id, user_name, email)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [reservation.schedule_id, reservation.user_name, reservation.email];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, 'No se pudo crear la reserva', 500);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al crear la reserva:', error);
            throw error;
        }
    }

    async getAll(): Promise<Reservation[]> {
        try {
            const query = `SELECT * FROM reservation;`;
            const result = await this.client.query(query);
            this.validateRowCount(result, 'No se encontraron reservas', 404);
            return result.rows;
        } catch (error: any) {
            throw error;
        }
    }

    async getById(id: number): Promise<Reservation> {
        try {
            const query = `SELECT * FROM reservation WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró una reserva con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }


    async getDetail(reservation_id : number): Promise<Detail[]> {
        try {
            const query = `
                 SELECT 
                Reservation.id AS reservation_id,
                Reservation.schedule_id,
                Reservation.user_name,
                Reservation.email,
                Reservation.reserved_at,
                Seat.id AS seat_id,
                Seat.seat_identifier
                FROM 
                Reservation
                JOIN 
                ReservedSeat ON Reservation.id = ReservedSeat.reservation_id
                JOIN 
                Seat ON ReservedSeat.seat_id = Seat.id
                WHERE 
                Reservation.id = $1;
            `;
            const result = await this.client.query(query, [reservation_id ]);
            this.validateRowCount(result, `Reserva no encontrada: ${reservation_id }`, 404);
            return result.rows;
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined> {
        try {
            const fields = Object.keys(reservation).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(reservation);
            const query = `
                UPDATE reservation
                SET ${fields}
                WHERE id = $${values.length + 1}
                RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, `No se encontró una reserva con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number ): Promise<void> {
        try {
            const query = `DELETE FROM reservation WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró una reserva con el ID : ${id}`, 404);
            return
        } catch (error: any) {
            throw error;
        }
    }
}