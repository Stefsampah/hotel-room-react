// Types pour les réservations
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: ReservationStatus;
  numberOfGuests: {
    adults: number;
    children: number;
  };
  specialRequests?: string;
  payment?: {
    method: string;
    status: string;
    amount: number;
  };
  notes?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
