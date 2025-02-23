import { query } from 'express';
import { Seat } from '../../domain/entities/Seat';
import { ISeatRepository } from '../../domain/repositories/ISeatRepository';
import { getPool } from '../database/connection';

export class SeatRepository implements ISeatRepository {
    private client = getPool();

    private validateRowCount(result: any, message: string, status: number) {
        if (result.rowCount === null || result.rowCount === 0) {
            throw { message, status };
        }
    }

    private async validateSeat(seat: Omit<Seat,'id'>): Promise<boolean> {  
        const query = `SELECT * FROM seat WHERE room_id = $1 AND seat_identifier = $2;`;
        const values = [seat.room_id, seat.seat_identifier];
        const result = await this.client.query(query, values);
        return result.rowCount ? true : false;
    }

    async create(seat: Omit<Seat, 'id'>): Promise<Seat> {
        try {

            const existSeat = await this.validateSeat(seat);
            if (existSeat) {
                throw { message: 'El asiento ya existe', status: 400 };
            }

            const query = `
                INSERT INTO seat (room_id, seat_identifier)
                VALUES ($1, $2)
                RETURNING *;
            `;
            const values = [seat.room_id, seat.seat_identifier];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, 'No se pudo crear el asiento', 500);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al crear el asiento:', error);
            throw error;
        }
    }

    async getAll(id:number): Promise<Seat[]> {
        try {
            if(id === 0){
                const query = `SELECT * FROM seat;`;
                const result = await this.client.query(query);
                this.validateRowCount(result, 'No se encontraron asientos', 404);
                return result.rows;
            }
            // Consulta para obtener los asientos de una sala específica
            const query = `SELECT * FROM seat WHERE room_id = $1;`;
            const result = await this.client.query(query,[id]);
            this.validateRowCount(result, 'No se encontraron asientos', 404);
            return result.rows;
        } catch (error: any) {
            console.error('Error en el repositorio al obtener los asientos:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Seat | undefined> {
        try {
            const query = `SELECT * FROM seat WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un asiento con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al obtener el asiento:', error);
            throw error;
        }
    }

    async update(id: number, seat: Partial<Seat>): Promise<Seat | undefined> {
        try {

            const existSeat = await this.validateSeat(seat as Omit<Seat,'id'>);
            if (existSeat) {
                throw { message: 'El asiento ya existe', status: 400 };
            }

            const fields = Object.keys(seat).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(seat);
            const query = `
                UPDATE seat
                SET ${fields}
                WHERE id = $${values.length + 1}
                RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, `No se encontró un asiento con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al actualizar el asiento:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const query = `DELETE FROM seat WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un asiento con el ID: ${id}`, 404);
        } catch (error: any) {
            console.error('Error en el repositorio al eliminar el asiento:', error);
            throw error;
        }
    }

    async deleteByRoom(room_id: number): Promise<void> {
        try {
            const query = `DELETE FROM seat WHERE room_id = $1;`;
            const result =  this.client.query(query, [room_id]);
            this.validateRowCount(result, `No se encontraron asientos para la sala con el ID: ${room_id}`, 404);
        } catch (error: any) {
            console.log('Error al eliminar los asientos de la sala:', error);
            throw error;    
        }
    }
}