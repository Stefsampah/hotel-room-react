import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  User,
  Phone,
  Mail,
  Users,
  Bed,
  CreditCard
} from 'lucide-react';

interface NewReservationForm {
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: {
    adults: number;
    children: number;
  };
  specialRequests: string;
  paymentMethod: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: string;
}

const NewReservation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewReservationForm>({
    roomId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    numberOfGuests: {
      adults: 1,
      children: 0
    },
    specialRequests: '',
    paymentMethod: 'card'
  });

  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  // Données simulées pour les chambres disponibles
  useEffect(() => {
    const mockRooms: Room[] = [
      { id: '1', number: '101', type: 'Simple', price: 89.99, status: 'available' },
      { id: '2', number: '102', type: 'Double', price: 129.99, status: 'available' },
      { id: '3', number: '201', type: 'Suite', price: 249.99, status: 'available' },
      { id: '4', number: '202', type: 'De Luxe', price: 189.99, status: 'available' },
      { id: '5', number: '301', type: 'Familiale', price: 169.99, status: 'available' }
    ];
    setAvailableRooms(mockRooms);
  }, []);

  const paymentMethods = [
    { value: 'card', label: 'Carte bancaire' },
    { value: 'cash', label: 'Espèces' },
    { value: 'transfer', label: 'Virement' },
    { value: 'check', label: 'Chèque' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestsChange = (type: 'adults' | 'children', value: number) => {
    setFormData(prev => ({
      ...prev,
      numberOfGuests: {
        ...prev.numberOfGuests,
        [type]: value
      }
    }));
  };

  const calculateTotalPrice = () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) return 0;
    
    const room = availableRooms.find(r => r.id === formData.roomId);
    if (!room) return 0;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return room.price * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, ici on appellerait l'API pour créer la réservation
      console.log('Nouvelle réservation créée:', formData);
      
      // Redirection vers la liste des réservations
      navigate('/reservations');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = availableRooms.find(r => r.id === formData.roomId);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/reservations')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nouvelle réservation
              </h1>
              <p className="text-gray-600 mt-1">
                Créer une nouvelle réservation pour un client
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sélection de la chambre */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Bed className="h-5 w-5 mr-2 text-hotel-600" />
            Sélection de la chambre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                Chambre *
              </label>
              <select
                id="roomId"
                name="roomId"
                value={formData.roomId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              >
                <option value="">Sélectionner une chambre</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Chambre {room.number} - {room.type} ({room.price}€/nuit)
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Chambre sélectionnée</h3>
                <p className="text-sm text-gray-600">
                  Chambre {selectedRoom.number} - {selectedRoom.type}
                </p>
                <p className="text-sm text-gray-600">
                  Prix: {selectedRoom.price}€ par nuit
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Informations du client */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-hotel-600" />
            Informations du client
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                placeholder="ex: Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="guestEmail"
                  name="guestEmail"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                  placeholder="ex: jean.dupont@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="guestPhone"
                  name="guestPhone"
                  value={formData.guestPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                  placeholder="ex: +33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dates et nombre de personnes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-hotel-600" />
            Dates et séjour
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                Date d'arrivée *
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              />
            </div>

            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                Date de départ *
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                required
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de personnes
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Adultes</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.numberOfGuests.adults}
                    onChange={(e) => handleGuestsChange('adults', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Enfants</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.numberOfGuests.children}
                    onChange={(e) => handleGuestsChange('children', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demandes spéciales et paiement */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-hotel-600" />
            Détails supplémentaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                Demandes spéciales
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
                placeholder="ex: Arrivée tardive, vue sur la ville, lit d'appoint..."
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hotel-500 focus:border-hotel-500"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Résumé et prix */}
        {selectedRoom && formData.checkIn && formData.checkOut && (
          <div className="bg-hotel-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la réservation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Chambre:</span>
                <p className="font-medium">Chambre {selectedRoom.number} - {selectedRoom.type}</p>
              </div>
              <div>
                <span className="text-gray-600">Séjour:</span>
                <p className="font-medium">
                  {new Date(formData.checkIn).toLocaleDateString('fr-FR')} - {new Date(formData.checkOut).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Prix total:</span>
                <p className="text-xl font-bold text-hotel-600">{totalPrice.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/reservations')}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hotel-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !formData.roomId || !formData.checkIn || !formData.checkOut}
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
                Créer la réservation
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReservation;
