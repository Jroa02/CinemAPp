export class Detail {
    reservation_id: number;
    schedule_id: number;
    user_name: string;
    email: string;
    reserved_at: string;
    seat_id : number;
    seat_identifier: string;

    constructor(reservation_id: number, schedule_id: number, user_name: string, email: string, reserved_at: string, seat_id: number, seat_identifier: string) {
        this.reservation_id = reservation_id;
        this.schedule_id = schedule_id;
        this.user_name = user_name;
        this.email = email;
        this.reserved_at = reserved_at;
        this.seat_id = seat_id;
        this.seat_identifier = seat_identifier;
    }
}