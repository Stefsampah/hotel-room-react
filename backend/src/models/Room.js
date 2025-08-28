import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Le numéro de chambre est requis'],
    unique: true,
    trim: true,
    match: [/^\d{3,4}$/, 'Le numéro de chambre doit contenir 3 ou 4 chiffres']
  },
  type: {
    type: String,
    required: [true, 'Le type de chambre est requis'],
    enum: ['single', 'double', 'suite', 'deluxe', 'family'],
    default: 'single'
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité doit être d\'au moins 1 personne'],
    max: [6, 'La capacité ne peut pas dépasser 6 personnes']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'tv', 'coffee', 'balcony', 'jacuzzi', 'city-view', 
      'family-friendly', 'air-conditioning', 'minibar', 'safe',
      'room-service', 'parking', 'gym-access', 'pool-access'
    ]
  }],
  status: {
    type: String,
    required: [true, 'Le statut est requis'],
    enum: ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'],
    default: 'available'
  },
  floor: {
    type: Number,
    required: [true, 'L\'étage est requis'],
    min: [1, 'L\'étage doit être au moins 1'],
    max: [50, 'L\'étage ne peut pas dépasser 50']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  features: {
    hasBalcony: {
      type: Boolean,
      default: false
    },
    hasCityView: {
      type: Boolean,
      default: false
    },
    hasJacuzzi: {
      type: Boolean,
      default: false
    },
    isAccessible: {
      type: Boolean,
      default: false
    },
    isSmoking: {
      type: Boolean,
      default: false
    }
  },
  maintenance: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    notes: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
roomSchema.index({ number: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ floor: 1 });
roomSchema.index({ price: 1 });

// Virtual pour le nom complet de la chambre
roomSchema.virtual('fullName').get(function() {
  return `Chambre ${this.number}`;
});

// Virtual pour le statut en français
roomSchema.virtual('statusFrench').get(function() {
  const statusMap = {
    'available': 'Disponible',
    'occupied': 'Occupée',
    'maintenance': 'Maintenance',
    'reserved': 'Réservée',
    'cleaning': 'Nettoyage'
  };
  return statusMap[this.status] || this.status;
});

// Virtual pour le type en français
roomSchema.virtual('typeFrench').get(function() {
  const typeMap = {
    'single': 'Simple',
    'double': 'Double',
    'suite': 'Suite',
    'deluxe': 'De Luxe',
    'family': 'Familiale'
  };
  return typeMap[this.type] || this.type;
});

// Méthode statique pour obtenir les chambres disponibles
roomSchema.statics.getAvailableRooms = function() {
  return this.find({ status: 'available', isActive: true });
};

// Méthode statique pour obtenir les chambres par type
roomSchema.statics.getRoomsByType = function(type) {
  return this.find({ type, isActive: true });
};

// Méthode statique pour obtenir les chambres par étage
roomSchema.statics.getRoomsByFloor = function(floor) {
  return this.find({ floor, isActive: true });
};

// Méthode statique pour obtenir les statistiques des chambres
roomSchema.statics.getRoomStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalRooms: { $sum: 1 },
        availableRooms: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        occupiedRooms: {
          $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
        },
        maintenanceRooms: {
          $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
        },
        averagePrice: { $avg: '$price' }
      }
    }
  ]);
};

// Middleware pour valider le numéro de chambre unique
roomSchema.pre('save', async function(next) {
  if (this.isModified('number')) {
    const existingRoom = await this.constructor.findOne({ 
      number: this.number, 
      _id: { $ne: this._id } 
    });
    
    if (existingRoom) {
      return next(new Error('Une chambre avec ce numéro existe déjà'));
    }
  }
  next();
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
