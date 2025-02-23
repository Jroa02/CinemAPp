export class Room {
    id: number;
    name: string;
    capacity: number;

    constructor(id: number, name: string, capacity: number) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
    }
}