export class Schedule {
    id: number;
    movie_id: number;
    room_id: number;
    date_time: string;

    constructor(id: number, movie_id: number, room_id: number, date_time: string) {
        this.id = id;
        this.movie_id = movie_id;
        this.room_id = room_id;
        this.date_time = date_time;
    }
}