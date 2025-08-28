import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Bed
} from 'lucide-react';
import type { Reservation, ReservationStatus } from '../types/reservation.js';
import type { Room } from '../types/room.js';

// Données simulées pour les réservations
const mockReservations: Reservation[] = [
  {
    id: '1',
    roomId: '101',
    guestName: 'Marie Dupont',
    guestEmail: 'marie.dupont@email.com',
    guestPhone: '+33 6 12 34 56 78',
    checkIn: new Date('2024-01-15'),
    checkOut: new Date('2024-01-17'),
    totalPrice: 179.98,
    status: ReservationStatus.CONFIRMED,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    specialRequests: 'Vue sur la ville si possible'
  },
  {
    id: '2',
    roomId: '201',
    guestName: 'Jean Martin',
    guestEmail: 'jean.martin@email.com',
    guestPhone: '+33 6 98 76 54 32',
    checkIn: new Date('2024-01-16'),
    checkOut: new Date('2024-01-19'),
    totalPrice: 749.97,
    status: ReservationStatus.CHECKED_IN,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    specialRequests: 'Arrivée tardive (22h)'
  },
  {
    id: '3',
    roomId: '102',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.bernard@email.com',
    guestPhone: '+33 6 45 67 89 01',
    checkIn: new Date('2024-01-18'),
    checkOut: new Date('2024-01-20'),
    totalPrice: 259.98,
    status: ReservationStatus.PENDING,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    specialRequests: 'Chambre au calme'
  },
  {
    id: '4',
    roomId: '301',
    guestName: 'Pierre Dubois',
    guestEmail: 'pierre.dubois@email.com',
    guestPhone: '+33 6 23 45 67 89',
    checkIn: new Date('2024-01-14'),
    checkOut: new Date('2024-01-15'),
    totalPrice: 169.99,
    status: ReservationStatus.CHECKED_OUT,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    specialRequests: 'Départ tôt (6h)'
  },
  {
    id: '5',
    roomId: '202',
    guestName: 'Claire Moreau',
    guestEmail: 'claire.moreau@email.com',
    guestPhone: '+33 6 78 90 12 34',
    checkIn: new Date('2024-01-20'),
    checkOut: new Date('2024-01-22'),
    totalPrice: 379.98,
    status: ReservationStatus.CANCELLED,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-13'),
    specialRequests: 'Annulé par le client'
  }
];

// Données simulées pour les chambres (pour l'affichage)
const mockRooms: Room[] = [
  { id: '101', number: '101', type: 'single' as any, capacity: 1, price: 89.99, amenities: [], status: 'available' as any, floor: 1 },
  { id: '102', number: '102', type: 'double' as any, capacity: 2, price: 129.99, amenities: [], status: 'occupied' as any, floor: 1 },
  { id: '201', number: '201', type: 'suite' as any, capacity: 3, price: 249.99, amenities: [], status: 'reserved' as any, floor: 2 },
  { id: '202', number: '202', type: 'deluxe' as any, capacity: 2, price: 189.99, amenities: [], status: 'maintenance' as any, floor: 2 },
  { id: '301', number: '301', type: 'family' as any, capacity: 4, price: 169.99, amenities: [], status: 'available' as any, floor: 3 }
];

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ReservationStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case ReservationStatus.CHECKED_IN:
        return 'bg-green-100 text-green-800';
      case ReservationStatus.CHECKED_OUT:
        return 'bg-gray-100 text-gray-800';
      case ReservationStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'En attente';
      case ReservationStatus.CONFIRMED:
        return 'Confirmée';
      case ReservationStatus.CHECKED_IN:
        return 'Enregistrée';
      case ReservationStatus.CHECKED_OUT:
        return 'Départ';
      case ReservationStatus.CANCELLED:
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case ReservationStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />;
      case ReservationStatus.CHECKED_IN:
        return <CheckCircle className="h-4 w-4" />;
      case ReservationStatus.CHECKED_OUT:
        return <CheckCircle className="h-4 w-4" />;
      case ReservationStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getRoomNumber = (roomId: string) => {
    const room = mockRooms.find(r => r.id === roomId);
    return room ? room.number : roomId;
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoomNumber(reservation.roomId).includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez toutes les réservations de votre hôtel
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/reservations/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hotel-600 hover:bg-hotel-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Nom, email ou chambre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md focus:ring-hotel-500 focus:border-hotel-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full border-gray-300 rounded-md focus:ring-hotel-500 focus:border-hotel-500 sm:text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value={ReservationStatus.PENDING}>En attente</option>
              <option value={ReservationStatus.CONFIRMED}>Confirmée</option>
              <option value={ReservationStatus.CHECKED_IN}>Enregistrée</option>
              <option value={ReservationStatus.CHECKED_OUT}>Départ</option>
              <option value={ReservationStatus.CANCELLED}>Annulée</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReservations.map((reservation) => (
            <li key={reservation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-hotel-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-hotel-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {reservation.guestName}
                        </h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-1">{getStatusText(reservation.status)}</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {reservation.guestEmail}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {reservation.guestPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-hotel-600">
                      {reservation.totalPrice.toFixed(2)} €
                    </div>
                    <div className="text-sm text-gray-500">
                      Chambre {getRoomNumber(reservation.roomId)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500 mr-6">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">Arrivée:</span>
                      <span className="ml-1">{formatDate(reservation.checkIn)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mr-6">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">Départ:</span>
                      <span className="ml-1">{formatDate(reservation.checkOut)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="font-medium">Durée:</span>
                      <span className="ml-1">
                        {Math.ceil((reservation.checkOut.getTime() - reservation.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nuit(s)
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <Link
                      to={`/reservations/${reservation.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-hotel-700 bg-hotel-100 hover:bg-hotel-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Link>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {reservation.specialRequests && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Demandes spéciales:</span> {reservation.specialRequests}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reservations;
