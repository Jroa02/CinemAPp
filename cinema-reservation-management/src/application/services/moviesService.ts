import { Movie } from './../../domain/entities/Movie';
import { MovieRepository } from './../../infrastructure/repositories/MovieRepository';

export class MovieService {
    private movieRepository: MovieRepository;

    constructor() {
        this.movieRepository = new MovieRepository();
    }

    async create(movie: Omit<Movie, 'id'>): Promise<Movie> {
        try {
            const response = await this.movieRepository.create(movie);
            console.log('Movie Created!', response);
            return response
        } catch (error: any) {
            console.log('Error', error);
            throw error
        }
    }

    async getAll(): Promise<Movie[]> {
        try {
            const movies = await this.movieRepository.getAll();
            console.log('Get all Movies!');
            return movies;
        } catch (error: any) {
            console.log('Error', error);
            throw error
        }
    }

    async getById(id: number): Promise<Movie | undefined> {
        try {
            const movie =  await this.movieRepository.getById(id);
            console.log('Get Movie', movie);
            return movie;
        } catch (error: any) {
            console.log('Errorss', error.message);
            throw error
        }
    }

    async update(id: number, movie: Partial<Movie>): Promise<Movie | undefined> {
        try {
            const response = await this.movieRepository.update(id, movie);
            console.log('Movie Updated!', response);
            return response;
        } catch (error: any) {
            console.log('Error', error);
            throw error
        }
        
    }

    async delete(id: number): Promise<void> {
        try {
            const result = await this.movieRepository.delete(id);
            console.log(`Película con ID ${id} eliminada correctamente.`);
        } catch (error: any) {
            console.log('Error', error);
            throw error
        }
        
    }
}