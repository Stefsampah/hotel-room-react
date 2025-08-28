import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bed, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Wifi,
  Star,
  Building2
} from 'lucide-react';
// Types définis localement
interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  status: string;
  floor: number;
  description: string;
  imageUrl: string;
}

interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  specialRequests?: string;
}

// Données simulées pour le tableau de bord
const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single' as any,
    capacity: 1,
    price: 89.99,
    amenities: ['wifi', 'tv', 'coffee'],
    status: 'available' as any,
    floor: 1,
    description: 'Chambre confortable avec vue sur la ville',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    number: '102',
    type: 'double' as any,
    capacity: 2,
    price: 129.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony'],
    status: 'occupied' as any,
    floor: 1,
    description: 'Chambre spacieuse avec balcon privé',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    number: '201',
    type: 'suite' as any,
    capacity: 3,
    price: 249.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'jacuzzi'],
    status: 'reserved' as any,
    floor: 2,
    description: 'Suite de luxe avec jacuzzi privé',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    number: '202',
    type: 'deluxe' as any,
    capacity: 2,
    price: 189.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'city-view'],
    status: 'maintenance' as any,
    floor: 2,
    description: 'Chambre de luxe avec vue panoramique',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    number: '301',
    type: 'family' as any,
    capacity: 4,
    price: 169.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'family-friendly'],
    status: 'available' as any,
    floor: 3,
    description: 'Chambre familiale spacieuse',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  }
];

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
    status: 'confirmed' as any,
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
    status: 'checked_in' as any,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    specialRequests: 'Arrivée tardive (22h)'
  }
];

const Dashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Occupée';
      case 'maintenance':
        return 'Maintenance';
      case 'reserved':
        return 'Réservée';
      case 'cleaning':
        return 'Nettoyage';
      default:
        return status;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4 text-blue-600" />;
      case 'tv':
        return <Star className="h-4 w-4 text-purple-600" />;
      case 'coffee':
        return <Star className="h-4 w-4 text-orange-600" />;
      case 'balcony':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'jacuzzi':
        return <Star className="h-4 w-4 text-cyan-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header principal avec image immersive */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-8">
        {/* Image de fond */}
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop&crop=center"
          alt="Hôtel de luxe"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
        
        {/* Contenu centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            {/* Icône avec effet de verre */}
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 shadow-2xl">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            
            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              Bienvenue à l'Hôtel Manager
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              Gérez votre hôtel avec efficacité et style
            </p>
            
            {/* Badge de statut */}
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Système opérationnel</span>
            </div>
          </div>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-4 right-4">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-white text-xs font-medium">24/7</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <div className="w-12 h-12 rounded-full bg-hotel-500/80 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-white text-xs font-medium">★</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bed className="h-6 w-6 text-hotel-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total des chambres
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rooms.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chambres occupées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rooms.filter(room => room.status === 'occupied').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Réservations actives
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {reservations.filter(res => res.status === 'confirmed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux d'occupation
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rooms.length > 0 ? Math.round((rooms.filter(room => room.status === 'occupied').length / rooms.length) * 100) : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/rooms/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-hotel-100 flex items-center justify-center">
                <Plus className="h-5 w-5 text-hotel-600" />
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Nouvelle chambre</h4>
              <p className="text-sm text-gray-500">Ajouter une chambre</p>
            </div>
          </Link>
          
          <Link
            to="/reservations/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Nouvelle réservation</h4>
              <p className="text-sm text-gray-500">Créer une réservation</p>
            </div>
          </Link>
          
          <Link
            to="/rooms"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bed className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Gérer les chambres</h4>
              <p className="text-sm text-gray-500">Voir toutes les chambres</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Chambres récentes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Chambres récentes
            </h3>
            <Link
              to="/rooms"
              className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
            >
              Voir toutes
            </Link>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chambre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rooms.map((room) => (
                        <tr key={room.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={room.imageUrl}
                                  alt={`Chambre ${room.number}`}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  Chambre {room.number}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Étage {room.floor}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {room.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {room.capacity} personne{room.capacity > 1 ? 's' : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                              {getStatusText(room.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {room.price.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/rooms/${room.id}`}
                              className="text-hotel-600 hover:text-hotel-900 inline-flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
