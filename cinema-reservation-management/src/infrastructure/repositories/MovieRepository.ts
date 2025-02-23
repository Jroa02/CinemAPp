import { json } from 'stream/consumers';
import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository';
import { getPool } from './../database/connection';

export class MovieRepository implements IMovieRepository {
    private client = getPool();

    private validateRowCount(result: any, message: object) {
        if (result.rowCount === 0) {
            throw message;
        }
    }

    async create(movie: Omit<Movie, 'id'>): Promise<Movie> {
        try {
            const query = `
            INSERT INTO movie (title, genre, duration, classification)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `;
            const values = [movie.title, movie.genre, movie.duration, movie.classification];
            const result = await this.client.query(query, values);
            this.validateRowCount(result, {message: 'No se pudo crear la película.', status: 500});
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }

    }

    async getAll(): Promise<Movie[]> {
        try {
            const query = `SELECT * FROM movie;`;
            const result = await this.client.query(query);
            this.validateRowCount(result, {message: 'No se encontraron películas.', status: 404});
            return result.rows;
        } catch (error: any) {
            throw error;
        }

    }

    async getById(id: number): Promise<Movie | undefined> {
        try {
            const query = `SELECT * FROM movie WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, {message: `No se encontró una película con el ID: ${id}`,status: 404});
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, movie: Partial<Movie>): Promise<Movie | undefined> {
        try {
            const fields = Object.keys(movie).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(movie);
            const query = `
            UPDATE movie
            SET ${fields}
            WHERE id = $${values.length + 1}
            RETURNING *;
            `;
            const result = await this.client.query(query, [...values, id]);
            this.validateRowCount(result, {message: `No se encontró una película con el ID: ${id}`,status: 404});
            return result.rows[0];
        } catch (error: any) {
            throw error;
        }

    }

    async delete(id: number): Promise<void> {
        try {
            const query = `DELETE FROM movie WHERE id = $1;`;
            const result = await this.client.query(query, [id]);
            this.validateRowCount(result, {message: `No se encontró una película con el ID: ${id}`,status: 404});
            return;
        } catch (error: any) {
            throw error;
        }

    }
}