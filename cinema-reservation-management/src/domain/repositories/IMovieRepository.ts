import { Movie } from '../entities/Movie';

export interface IMovieRepository {
    create(movie: Movie): Promise<Movie>;
    getAll(): Promise<Movie[]>;
    getById(id: number): Promise<Movie | undefined>;
    update(id: number, movie: Partial<Movie>): Promise<Movie | undefined>;
    delete(id: number): Promise<void>;
}