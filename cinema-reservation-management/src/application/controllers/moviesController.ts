import { Request, Response } from 'express';
import { MovieService } from './../services/moviesService';
import { Movie } from './../../domain/entities/Movie';


const movieService = new MovieService();

export const MoviesController = {
    create: async (req: Request, res: Response) => {
        try {
            const { title, genre, duration, classification } = req.body;
            const movie = new Movie(0, title, genre, duration, classification); // ID se genera automáticamente
            await movieService.create(movie);
            res.status(201).send()
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const movies = await movieService.getAll();
            res.status(200).json(movies);
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const movie = await movieService.getById(parseInt(req.params.id));
            if (!movie) {
                return res.status(404).send();
            }
            res.status(200).json(movie);
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send();
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const updatedMovie = await movieService.update(parseInt(req.params.id), req.body);
            if (!updatedMovie) {
                return res.status(404).json();
            }
            res.status(200).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await movieService.delete(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(error.status || 500).send();
        }
    },
};