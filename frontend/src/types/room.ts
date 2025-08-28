// Types pour les chambres
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
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  amenities: string[];
  status: RoomStatus;
  floor: number;
  description: string;
  imageUrl: string;
  features?: string[];
  maintenance?: {
    startDate?: Date;
    endDate?: Date;
    reason?: string;
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
