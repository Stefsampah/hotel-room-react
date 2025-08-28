import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X,
  Bed,
  Users,
  Building2,
  Star,
  Wifi,
  Tv,
  Coffee,
  Snowflake
} from 'lucide-react';

interface NewRoomForm {
  number: string;
  type: string;
  capacity: number;
  price: number;
  floor: number;
  description: string;
  amenities: string[];
  imageUrl: string;
}

const NewRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewRoomForm>({
    number: '',
    type: 'single',
    capacity: 1,
    price: 0,
    floor: 1,
    description: '',
    amenities: [],
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);

  const roomTypes = [
    { value: 'single', label: 'Simple' },
    { value: 'double', label: 'Double' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'De Luxe' },
    { value: 'family', label: 'Familiale' }
  ];

  const availableAmenities = [
    { value: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { value: 'tv', label: 'TV', icon: Tv },
    { value: 'coffee', label: 'Machine à café', icon: Coffee },
    { value: 'balcony', label: 'Balcon', icon: Building2 },
    { value: 'jacuzzi', label: 'Jacuzzi', icon: Star },
    { value: 'city-view', label: 'Vue sur la ville', icon: Building2 },
    { value: 'family-friendly', label: 'Familiale', icon: Users },
    { value: 'air-conditioning', label: 'Climatisation', icon: Snowflake }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' || name === 'floor' ? Number(value) : value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, ici on appellerait l'API pour créer la chambre
      console.log('Nouvelle chambre créée:', formData);
      
      // Redirection vers la liste des chambres
      navigate('/rooms');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityData = availableAmenities.find(a => a.value === amenity);
    if (amenityData) {
      const Icon = amenityData.icon;
      return <Icon className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Nouvelle chambre
              </h1>
              <p className="text-gray-600 mt-1">
                Ajouter une nouvelle chambre à votre hôtel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Numéro de chambre */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de chambre *
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                placeholder="ex: 101"
              />
            </div>

            {/* Type de chambre */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de chambre *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacité */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacité (personnes) *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              />
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Prix par nuit (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                placeholder="89.99"
              />
            </div>

            {/* Étage */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
                Étage *
              </label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              />
            </div>

            {/* URL de l'image */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              placeholder="Décrivez la chambre, ses caractéristiques, sa vue..."
            />
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Équipements disponibles</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableAmenities.map(amenity => (
              <label key={amenity.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity.value)}
                  onChange={() => handleAmenityToggle(amenity.value)}
                  className="h-4 w-4 text-hotel-600 focus:ring-hotel-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  {getAmenityIcon(amenity.value)}
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hotel-600 hover:bg-hotel-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Créer la chambre
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRoom;
