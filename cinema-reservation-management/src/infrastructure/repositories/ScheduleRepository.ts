import { Schedule } from '../../domain/entities/Schedule';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';
import { getPool } from '../database/connection';

export class ScheduleRepository implements IScheduleRepository {
    private client = getPool();

    private validateRowCount(result: any, message: string, status: number) {
        if (result.rowCount === 0) {
            throw { message, status };
        }
    }

    private async isScheduleConflict(room_id: number, date_time: string, movie_id: number): Promise<boolean> {
        const query = `
            SELECT s.id 
            FROM schedule s
            JOIN movie m ON s.movie_id = m.id
            WHERE s.room_id = $1 
            AND (
                ($2 >= s.date_time AND $2 < s.date_time + interval '1 minute' * m.duration) OR
                ($2 + interval '1 minute' * (SELECT duration FROM movie WHERE id = $3) > s.date_time AND 
                 $2 + interval '1 minute' * (SELECT duration FROM movie WHERE id = $3) <= s.date_time + interval '1 minute' * m.duration)
            );
        `;
        const values = [room_id, date_time, movie_id];
        const result = await this.client.query(query, values);

        return result.rowCount ? true : false;
    }


    async create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
        try {
            const hasConflict = await this.isScheduleConflict(schedule.room_id, schedule.date_time, schedule.movie_id);

            if (hasConflict) {
                throw { message: 'Ya existe una función en la misma sala y hora', status: 400 };
            }

            const query = `
                INSERT INTO schedule (movie_id, room_id, date_time)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [schedule.movie_id, schedule.room_id, schedule.date_time];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, 'No se pudo crear el horario', 500);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al crear el horario:', error);
            throw error;
        }
    }

    async getAll(): Promise<Schedule[]> {
        try {
            const query = `SELECT id,movie_id,room_id, TO_CHAR(date_time, 'YYYY-MM-DD HH24:MI:SS') AS date_time FROM schedule ORDER BY room_id ASC;`;
            const result = await this.client.query(query);
            this.validateRowCount(result, 'No se encontraron horarios', 404);
            return result.rows;
        } catch (error: any) {
            console.error('Error en el repositorio al obtener los horarios:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Schedule | undefined> {
        try {
            const query = `SELECT id, movie_id, room_id, 
                to_char(date_time, 'YYYY-MM-DD HH24:MI:SS') AS date_time 
                FROM schedule 
                WHERE id = $1;
            `;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un horario con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al obtener el horario:', error);
            throw error;
        }
    }

    async update(id: number, schedule: Schedule): Promise<Schedule | undefined> {
        try {

            const hasConflict = await this.isScheduleConflict(schedule.room_id, schedule.date_time, schedule.movie_id);

            if (hasConflict) {
                throw { message: 'Ya existe una función en la misma sala y hora', status: 400 };
            }


            const fields = Object.keys(schedule).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(schedule);
            const query = `
                UPDATE schedule
                SET ${fields}
                WHERE id = $${values.length + 1}
                RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, `No se encontró un horario con el ID: ${id}`, 404);
            return result.rows[0];
        } catch (error: any) {
            console.error('Error en el repositorio al actualizar el horario:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const query = `DELETE FROM schedule WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, `No se encontró un horario con el ID: ${id}`, 404);
        } catch (error: any) {
            console.error('Error en el repositorio al eliminar el horario:', error);
            throw error;
        }
    }
}