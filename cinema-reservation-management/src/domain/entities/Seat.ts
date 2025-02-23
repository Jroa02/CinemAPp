export class Seat {
    id: number;
    room_id: number;
    seat_identifier: string;

    constructor(id: number, room_id: number, seat_identifier: string) {
        this.id = id;
        this.room_id = room_id;
        this.seat_identifier = seat_identifier;
    }
}