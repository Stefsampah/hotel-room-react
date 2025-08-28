import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Room from '../src/models/Room.js';
import Reservation from '../src/models/Reservation.js';

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté pour le seeding');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Données de test pour les utilisateurs
const users = [
  {
    username: 'admin',
    email: 'admin@hotel.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'Hotel',
    role: 'admin'
  },
  {
    username: 'manager',
    email: 'manager@hotel.com',
    password: 'password123',
    firstName: 'Manager',
    lastName: 'Hotel',
    role: 'manager'
  },
  {
    username: 'staff',
    email: 'staff@hotel.com',
    password: 'password123',
    firstName: 'Staff',
    lastName: 'Hotel',
    role: 'staff'
  }
];

// Données de test pour les chambres
const rooms = [
  {
    number: '101',
    type: 'single',
    capacity: 1,
    price: 89.99,
    amenities: ['wifi', 'tv', 'coffee'],
    status: 'available',
    floor: 1,
    description: 'Chambre confortable avec vue sur la ville',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    number: '102',
    type: 'double',
    capacity: 2,
    price: 129.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony'],
    status: 'occupied',
    floor: 1,
    description: 'Chambre spacieuse avec balcon privé',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  },
  {
    number: '201',
    type: 'suite',
    capacity: 3,
    price: 249.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'jacuzzi'],
    status: 'reserved',
    floor: 2,
    description: 'Suite de luxe avec jacuzzi privé',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
  },
  {
    number: '202',
    type: 'deluxe',
    capacity: 2,
    price: 189.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'city-view'],
    status: 'maintenance',
    floor: 2,
    description: 'Chambre de luxe avec vue panoramique',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop'
  },
  {
    number: '301',
    type: 'family',
    capacity: 4,
    price: 169.99,
    amenities: ['wifi', 'tv', 'coffee', 'balcony', 'family-friendly'],
    status: 'available',
    floor: 3,
    description: 'Chambre familiale spacieuse',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
  }
];

// Fonction principale de seeding
const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Room.deleteMany({});
    await Reservation.deleteMany({});
    console.log('🧹 Base de données nettoyée');

    // Créer les utilisateurs
    const createdUsers = await User.create(users);
    console.log(`👥 ${createdUsers.length} utilisateurs créés`);

    // Créer les chambres
    const createdRooms = await Room.create(rooms);
    console.log(`🏨 ${createdRooms.length} chambres créées`);

    // Créer quelques réservations de test
    const reservations = [
      {
        roomId: createdRooms[0]._id,
        guestName: 'Marie Dupont',
        guestEmail: 'marie.dupont@email.com',
        guestPhone: '+33 6 12 34 56 78',
        checkIn: new Date('2024-01-15'),
        checkOut: new Date('2024-01-17'),
        totalPrice: 179.98,
        status: 'confirmed',
        numberOfGuests: { adults: 1, children: 0 },
        specialRequests: 'Vue sur la ville si possible'
      },
      {
        roomId: createdRooms[2]._id,
        guestName: 'Jean Martin',
        guestEmail: 'jean.martin@email.com',
        guestPhone: '+33 6 98 76 54 32',
        checkIn: new Date('2024-01-16'),
        checkOut: new Date('2024-01-19'),
        totalPrice: 749.97,
        status: 'checked_in',
        numberOfGuests: { adults: 2, children: 1 },
        specialRequests: 'Arrivée tardive (22h)'
      }
    ];

    const createdReservations = await Reservation.create(reservations);
    console.log(`📅 ${createdReservations.length} réservations créées`);

    console.log('✅ Seeding terminé avec succès !');
    console.log('\n📋 Données de test créées :');
    console.log(`   - Utilisateurs: ${createdUsers.length}`);
    console.log(`   - Chambres: ${createdRooms.length}`);
    console.log(`   - Réservations: ${createdReservations.length}`);
    console.log('\n🔑 Identifiants de connexion :');
    console.log('   - admin@hotel.com / password123 (Admin)');
    console.log('   - manager@hotel.com / password123 (Manager)');
    console.log('   - staff@hotel.com / password123 (Staff)');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
};

// Exécuter le seeding
connectDB().then(seedDatabase);
