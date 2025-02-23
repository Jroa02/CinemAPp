export class ReservedSeat {
    id: number;
    reservation_id: number;
    seat_id: number;

    constructor(id: number, reservation_id: number, seat_id: number) {
        this.id = id;
        this.reservation_id = reservation_id;
        this.seat_id = seat_id;
    }
}