import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Bed, 
  Users, 
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Snowflake,
  Building2,
  MapPin
} from 'lucide-react';

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

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Données simulées - en production, cela viendrait de l'API
  useEffect(() => {
    const mockRoom: Room = {
      id: id || '1',
      number: '101',
      type: 'simple',
      capacity: 1,
      price: 89.99,
      amenities: ['wifi', 'tv', 'coffee'],
      status: 'available',
      floor: 1,
      description: 'Chambre confortable avec vue sur la ville. Idéale pour les voyageurs en solo, cette chambre dispose de tous les équipements essentiels pour un séjour agréable.',
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'
    };
    
    setRoom(mockRoom);
    setLoading(false);
  }, [id]);

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

  const getTypeText = (type: string) => {
    switch (type) {
      case 'single':
        return 'Simple';
      case 'double':
        return 'Double';
      case 'suite':
        return 'Suite';
      case 'deluxe':
        return 'De Luxe';
      case 'family':
        return 'Familiale';
      default:
        return type;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-5 w-5 text-blue-600" />;
      case 'tv':
        return <Tv className="h-5 w-5 text-purple-600" />;
      case 'coffee':
        return <Coffee className="h-5 w-5 text-orange-600" />;
      case 'balcony':
        return <Building2 className="h-5 w-5 text-green-600" />;
      case 'jacuzzi':
        return <Star className="h-5 w-5 text-pink-600" />;
      case 'city-view':
        return <MapPin className="h-5 w-5 text-indigo-600" />;
      case 'family-friendly':
        return <Users className="h-5 w-5 text-yellow-600" />;
      default:
        return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chambre non trouvée</h2>
          <Link to="/rooms" className="text-hotel-600 hover:text-hotel-700">
            Retour aux chambres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/rooms')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chambre {room.number}
              </h1>
              <p className="text-gray-600 mt-1">
                {getTypeText(room.type)} • Étage {room.floor}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image principale */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={room.imageUrl}
              alt={`Chambre ${room.number}`}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Informations de la chambre */}
        <div className="space-y-6">
          {/* Statut et prix */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                {getStatusText(room.status)}
              </span>
              <span className="text-3xl font-bold text-hotel-600">
                {room.price} €
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Par nuit
            </p>
          </div>

          {/* Détails de la chambre */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la chambre</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{getTypeText(room.type)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Capacité</span>
                <span className="font-medium">{room.capacity} personne{room.capacity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Étage</span>
                <span className="font-medium">{room.floor}</span>
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h3>
            <div className="grid grid-cols-2 gap-3">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  {getAmenityIcon(amenity)}
                  <span className="text-sm text-gray-700 capitalize">
                    {amenity.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {room.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
