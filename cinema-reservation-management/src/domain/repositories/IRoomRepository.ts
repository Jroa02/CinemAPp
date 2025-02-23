import { Room } from '../entities/Room';

export interface IRoomRepository {
    create(room: Omit<Room, 'id'>): Promise<Room>;
    getAll(): Promise<Room[]>;
    getById(id: number): Promise<Room | undefined>;
    update(id: number, room: Partial<Room>): Promise<Room | undefined>;
    delete(id: number): Promise<void>;
}