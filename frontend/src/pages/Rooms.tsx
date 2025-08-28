import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Bed, 
  Users, 
  Star,
  Edit,
  Trash2,
  Eye,
  Wifi,
  Car,
  Coffee,
  Tv,
  Snowflake
} from 'lucide-react';
import { RoomType, RoomStatus } from '../types/room.js';

// Données simulées pour les chambres avec des images réalistes
const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: RoomType.SINGLE,
    capacity: 1,
    price: 89.99,
    amenities: ['wifi', 'tv', 'coffee'],
    status: RoomStatus.AVAILABLE,
    floor: 1,
    description: 'Chambre confortable avec vue sur la ville',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    number: '102',
    type: RoomType.DOUBLE,
    capacity: 2,
    price: 129.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony'],
    status: RoomStatus.OCCUPIED,
    floor: 1,
    description: 'Chambre spacieuse avec balcon privé',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    number: '201',
    type: RoomType.SUITE,
    capacity: 3,
    price: 249.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'jacuzzi'],
    status: RoomStatus.RESERVED,
    floor: 2,
    description: 'Suite de luxe avec jacuzzi privé',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    number: '202',
    type: RoomType.DELUXE,
    capacity: 2,
    price: 189.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'city-view'],
    status: RoomStatus.MAINTENANCE,
    floor: 2,
    description: 'Chambre de luxe avec vue panoramique',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    number: '301',
    type: RoomType.FAMILY,
    capacity: 4,
    price: 169.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'family-friendly'],
    status: RoomStatus.AVAILABLE,
    floor: 3,
    description: 'Chambre familiale spacieuse',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    number: '302',
    type: RoomType.SINGLE,
    capacity: 1,
    price: 79.99,
    amenities: ['wifi', 'tv'],
    status: RoomStatus.CLEANING,
    floor: 3,
    description: 'Chambre simple et confortable',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  }
];

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case RoomStatus.OCCUPIED:
        return 'bg-blue-100 text-blue-800';
      case RoomStatus.MAINTENANCE:
        return 'bg-red-100 text-red-800';
      case RoomStatus.RESERVED:
        return 'bg-yellow-100 text-yellow-800';
      case RoomStatus.CLEANING:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'Disponible';
      case RoomStatus.OCCUPIED:
        return 'Occupée';
      case RoomStatus.MAINTENANCE:
        return 'Maintenance';
      case RoomStatus.RESERVED:
        return 'Réservée';
      case RoomStatus.CLEANING:
        return 'Nettoyage';
      default:
        return status;
    }
  };

  const getTypeText = (type: RoomType) => {
    switch (type) {
      case RoomType.SINGLE:
        return 'Simple';
      case RoomType.DOUBLE:
        return 'Double';
      case RoomType.SUITE:
        return 'Suite';
      case RoomType.DELUXE:
        return 'De Luxe';
      case RoomType.FAMILY:
        return 'Familiale';
      default:
        return type;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4 text-blue-600" />;
      case 'tv':
        return <Tv className="h-4 w-4 text-purple-600" />;
      case 'coffee':
        return <Coffee className="h-4 w-4 text-orange-600" />;
      case 'balcony':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'jacuzzi':
        return <Snowflake className="h-4 w-4 text-cyan-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || room.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des chambres</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez toutes les chambres de votre hôtel
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/rooms/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hotel-600 hover:bg-hotel-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle chambre
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Numéro ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md focus:ring-hotel-500 focus:border-hotel-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full border-gray-300 rounded-md focus:ring-hotel-500 focus:border-hotel-500 sm:text-sm"
            >
              <option value="all">Tous les types</option>
              <option value={RoomType.SINGLE}>Simple</option>
              <option value={RoomType.DOUBLE}>Double</option>
              <option value={RoomType.SUITE}>Suite</option>
              <option value={RoomType.DELUXE}>De Luxe</option>
              <option value={RoomType.FAMILY}>Familiale</option>
            </select>
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
              <option value={RoomStatus.AVAILABLE}>Disponible</option>
              <option value={RoomStatus.OCCUPIED}>Occupée</option>
              <option value={RoomStatus.RESERVED}>Réservée</option>
              <option value={RoomStatus.MAINTENANCE}>Maintenance</option>
              <option value={RoomStatus.CLEANING}>Nettoyage</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Grille des chambres */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Image de la chambre */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={room.imageUrl}
                alt={`Chambre ${room.number}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                  {getStatusText(room.status)}
                </span>
              </div>
            </div>
            
            {/* Informations de la chambre */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chambre {room.number}
                </h3>
                <span className="text-lg font-bold text-hotel-600">
                  {room.price.toFixed(2)} €
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {room.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Bed className="h-4 w-4 mr-1" />
                  {getTypeText(room.type)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {room.capacity} personne{room.capacity > 1 ? 's' : ''}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 mr-1" />
                  Étage {room.floor}
                </div>
              </div>
              
              {/* Équipements */}
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center text-xs text-gray-600">
                    {getAmenityIcon(amenity)}
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/rooms/${room.id}`}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-hotel-700 bg-hotel-100 hover:bg-hotel-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Link>
                <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
