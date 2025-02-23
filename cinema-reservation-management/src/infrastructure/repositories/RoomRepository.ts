import { Room } from '../../domain/entities/Room';
import { IRoomRepository } from '../../domain/repositories/IRoomRepository';
import { getPool } from '../database/connection';

export class RoomRepository implements IRoomRepository {
    private client = getPool();

    private validateRowCount(result: any, message: string, status: number) {
        if (result.rowCount === 0) {
            throw { message, status };
        }
    }

    private existRoom = async (nameRoom: string): Promise<boolean> => {
        const query = `SELECT * FROM room WHERE name = $1;`;
        const result = await this.client.query(query, [nameRoom]);
        return result.rowCount ? true : false;
    }

    async create(room: Omit<Room, 'id'>): Promise<Room> {
        try {

            const validateRoom = await this.existRoom(room.name);
            if (validateRoom) {
                throw { message: 'La sala ya existe', status: 400 };
            }
            
            const query = `
                INSERT INTO room (name, capacity)
                VALUES ($1, $2)
                RETURNING *;
            `;
            const values = [room.name, room.capacity];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, 'No se pudo crear la sala', 500);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al crear la sala:', error);
            throw error;
        }
    }

    async getAll(): Promise<Room[]> {
        try {
            const query = `SELECT * FROM room;`;
            const result = await this.client.query(query);
            this.validateRowCount(result, 'No se encontraron salas', 404);
            return result.rows;
        } catch (error: any) {
            console.error('Error en el repositorio al obtener las salas:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Room | undefined> {
        try {
            const query = `SELECT * FROM room WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró una sala con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al obtener la sala:', error);
            throw error;
        }
    }

    async update(id: number, room: Partial<Room>): Promise<Room | undefined> {
        try {
            const fields = Object.keys(room).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(room);
            const query = `
                UPDATE room
                SET ${fields}
                WHERE id = $${values.length + 1}
                RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, `No se encontró una sala con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al actualizar la sala:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const query = `DELETE FROM room WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró una sala con el ID: ${id}`, 404);
        } catch (error: any) {
            console.error('Error en el repositorio al eliminar la sala:', error);
            throw error;
        }
    }
}