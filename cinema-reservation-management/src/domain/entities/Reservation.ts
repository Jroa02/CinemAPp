export class Reservation {
    id: number;
    schedule_id: number;
    user_name: string;
    email: string;
    reserved_at?: string;

    constructor(id: number, schedule_id: number, user_name: string, email: string, reserved_at?: string) {
        this.id = id;
        this.schedule_id = schedule_id;
        this.user_name = user_name;
        this.email = email;
        this.reserved_at = reserved_at;
    }
}