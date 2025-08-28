export interface Room {
  id: string;
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  amenities: string[];
  status: RoomStatus;
  floor: number;
  description?: string;
  imageUrl?: string;
}

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  SUITE = 'suite',
  DELUXE = 'deluxe',
  FAMILY = 'family'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
  CLEANING = 'cleaning'
}
