import { Room } from '../../domain/entities/Room';
import { RoomRepository } from '../../infrastructure/repositories/RoomRepository';
import { SeatService } from './../services/seatsService';

export class RoomService {
    private roomRepository: RoomRepository;
    private seatService: SeatService;

    constructor() {
        this.roomRepository = new RoomRepository();
        this.seatService  = new SeatService();
    }


    private async  generateSeatsForRoom (room_id: number, capacity: number): Promise<void> {
        const rows = Math.ceil(capacity / 5); 
        const columns = 10; 

        let seatNumber = 1;

        for (let row = 0; row < rows; row++) {
            const rowLetter = String.fromCharCode(65 + row); // A, B, C
            for (let col = 1; col <= columns && seatNumber <= capacity; col++) {
                const seatLabel = `${rowLetter}${col}`; // Ej: A1, A2, B1, B2, etc.
                await this.seatService.create({ room_id, seat_identifier: seatLabel });
                seatNumber++;
            }
        }

        console.log(`Se generaron ${capacity} asientos para la sala ${room_id}`);
    }

    async create(room: Omit<Room, 'id'>): Promise<Room> {
        try {
            const response = await this.roomRepository.create(room);
            await this.generateSeatsForRoom(response.id, response.capacity);
            console.log('Sala creada con asientos:', response);
            return response;
        } catch (error: any) {
            console.error('Error al crear la sala:', error);
            throw error
        }
    }

    async getAll(): Promise<Room[]> {
        try {
            const rooms = await this.roomRepository.getAll();
            console.log('Salas obtenidas:', rooms);
            return rooms;
        } catch (error: any) {
            console.error('Error al obtener las salas:', error);
            throw error
        }
    }

    async getById(id: number): Promise<Room | undefined> {
        try {
            const room = await this.roomRepository.getById(id);
            console.log('Sala obtenida:', room);
            return room;
        } catch (error: any) {
            console.error('Error al obtener la sala:', error);
            throw error
        }
    }

    async update(id: number, room: Partial<Room>): Promise<Room | undefined> {
        try {
            const response = await this.roomRepository.update(id, room);
            console.log('Sala actualizada:', response);
            return response;
        } catch (error: any) {
            console.error('Error al actualizar la sala:', error);
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.seatService.deleteByRoom(id);
            await this.roomRepository.delete(id);
            console.log('Sala eliminada:', id);
        } catch (error: any) {
            console.error('Error al eliminar la sala:', error);
            throw error
        }
    }
}