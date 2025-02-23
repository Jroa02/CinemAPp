import { ReservedSeat } from '../../domain/entities/ReservedSeat';
import { Seat } from '../../domain/entities/Seat';
import { IReservedSeatRepository } from '../../domain/repositories/IReservedSeatRepository';
import { getPool } from '../database/connection';

export class ReservedSeatRepository implements IReservedSeatRepository {
    private client = getPool();

    private validateRowCount(result: any, message: string, status: number) {
        if (result.rowCount === null || result.rowCount === 0) {
            throw { message, status };
        }
    }

    private async isSeatReserved(reservation_id: number): Promise<Seat[]> {
        try {

            const scheduleIdQuery = `
            SELECT s.id 
            FROM schedule s
            JOIN reservation r ON s.id = r.schedule_id
            WHERE r.id = $1;
            `;
            const schedule_id = await this.client.query(scheduleIdQuery, [reservation_id]);
            const seatsByScheduleQuery = `
                SELECT s.* FROM seat s
                JOIN reservedseat rs ON s.id = rs.seat_id
                JOIN reservation r ON rs.reservation_id = r.id
                WHERE r.schedule_id = $1;
            `;
            const seatsBySchedule = await this.client.query(seatsByScheduleQuery, [schedule_id.rows[0].id]);
            console.log('Asientos reservados', seatsBySchedule.rows);
            return seatsBySchedule.rows
        } catch (error: any) {
            throw error;
        }
    }


    async create(reservedSeat: Omit<ReservedSeat, 'id'>): Promise<ReservedSeat> {
        try {

            const isReserved = await this.isSeatReserved(reservedSeat.reservation_id);
            if (isReserved.length > 0 && isReserved.find(s => s.id === reservedSeat.seat_id)) {
                throw { message: 'El asiento ya está reservado', status: 400 };
            }

            const query = `
                INSERT INTO reservedseat (reservation_id, seat_id)
                VALUES ($1, $2)
                RETURNING *;
            `;
            const values = [reservedSeat.reservation_id, reservedSeat.seat_id];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, 'No se pudo crear el asiento reservado', 500);
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }

    async getAll(): Promise<ReservedSeat[]> {
        try {
            const query = `SELECT * FROM reservedseat;`;
            const result = await this.client.query(query);
            this.validateRowCount(result, 'No se encontraron asientos reservados', 404);
            return result.rows;
        } catch (error: any) {
            throw error;
        }
    }

    async getById(id: number): Promise<ReservedSeat | undefined> {
        try {
            const query = `SELECT * FROM reservedseat WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un asiento reservado con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }

    async getByScheduleId(schedule_id: number): Promise<Seat[]> {
        try {
            const query =  `
            SELECT s.* FROM seat s
            JOIN reservedseat rs ON s.id = rs.seat_id
            JOIN reservation r ON rs.reservation_id = r.id
            WHERE r.schedule_id = $1;
            `;
            const result = await this.client.query(query, [schedule_id]);
            this.validateRowCount(result, `No se encontraron asientos reservados para la funcion ${schedule_id} `, 404);
            return result.rows;
        } catch (error: any) {
            throw error;
        }

    }


    async update(id: number, reservedSeat: Partial<ReservedSeat>): Promise<ReservedSeat | undefined> {
        try {
            const fields = Object.keys(reservedSeat).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(reservedSeat);
            const query = `
                UPDATE reservedseat
                SET ${fields}
                WHERE id = $${values.length + 1}
                RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, `No se encontró un asiento reservado con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const query = `DELETE FROM reservedseat WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un asiento reservado con el ID: ${id}`, 404);
        } catch (error: any) {
            throw error;
        }
    }
}