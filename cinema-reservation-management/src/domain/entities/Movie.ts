export class Movie {
    id: number;
    title: string;
    genre: string;
    duration: number;
    classification: string;

    constructor(id: number, title: string, genre: string, duration: number, classification: string) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.classification = classification;
    }
}