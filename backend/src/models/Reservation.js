import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'L\'ID de la chambre est requis']
  },
  guestName: {
    type: String,
    required: [true, 'Le nom du client est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  guestEmail: {
    type: String,
    required: [true, 'L\'email du client est requis'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  guestPhone: {
    type: String,
    required: [true, 'Le téléphone du client est requis'],
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{8,20}$/, 'Veuillez entrer un numéro de téléphone valide']
  },
  checkIn: {
    type: Date,
    required: [true, 'La date d\'arrivée est requise'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'La date d\'arrivée doit être dans le futur'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'La date de départ est requise'],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: 'La date de départ doit être après la date d\'arrivée'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Le prix total est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  status: {
    type: String,
    required: [true, 'Le statut est requis'],
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  },
  numberOfGuests: {
    adults: {
      type: Number,
      required: [true, 'Le nombre d\'adultes est requis'],
      min: [1, 'Il doit y avoir au moins 1 adulte'],
      max: [4, 'Le nombre d\'adultes ne peut pas dépasser 4']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre d\'enfants ne peut pas être négatif'],
      max: [4, 'Le nombre d\'enfants ne peut pas dépasser 4']
    }
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Les demandes spéciales ne peuvent pas dépasser 500 caractères']
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'],
      default: 'credit_card'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
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
reservationSchema.index({ roomId: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ checkIn: 1 });
reservationSchema.index({ checkOut: 1 });
reservationSchema.index({ guestEmail: 1 });
reservationSchema.index({ 'payment.status': 1 });

// Virtual pour la durée du séjour
reservationSchema.virtual('duration').get(function() {
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual pour le statut en français
reservationSchema.virtual('statusFrench').get(function() {
  const statusMap = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'checked_in': 'Enregistrée',
    'checked_out': 'Départ',
    'cancelled': 'Annulée'
  };
  return statusMap[this.status] || this.status;
});

// Virtual pour le statut du paiement en français
reservationSchema.virtual('paymentStatusFrench').get(function() {
  const statusMap = {
    'pending': 'En attente',
    'completed': 'Complété',
    'failed': 'Échoué',
    'refunded': 'Remboursé'
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Méthode statique pour vérifier la disponibilité d'une chambre
reservationSchema.statics.checkRoomAvailability = async function(roomId, checkIn, checkOut, excludeReservationId = null) {
  const query = {
    roomId,
    status: { $in: ['confirmed', 'checked_in'] },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  };

  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const conflictingReservations = await this.find(query);
  return conflictingReservations.length === 0;
};

// Méthode statique pour obtenir les réservations actives
reservationSchema.statics.getActiveReservations = function() {
  return this.find({
    status: { $in: ['confirmed', 'checked_in'] },
    isActive: true
  }).populate('roomId');
};

// Méthode statique pour obtenir les réservations par période
reservationSchema.statics.getReservationsByPeriod = function(startDate, endDate) {
  return this.find({
    checkIn: { $gte: startDate },
    checkOut: { $lte: endDate },
    isActive: true
  }).populate('roomId');
};

// Méthode statique pour obtenir les statistiques des réservations
reservationSchema.statics.getReservationStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalReservations: { $sum: 1 },
        pendingReservations: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        confirmedReservations: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        activeReservations: {
          $sum: { $cond: [{ $in: ['$status', ['confirmed', 'checked_in']] }, 1, 0] }
        },
        totalRevenue: { $sum: '$totalPrice' },
        averageReservationValue: { $avg: '$totalPrice' }
      }
    }
  ]);
};

// Middleware pour valider les dates
reservationSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut && this.checkIn >= this.checkOut) {
    return next(new Error('La date de départ doit être après la date d\'arrivée'));
  }
  next();
});

// Middleware pour calculer le prix total si non fourni
reservationSchema.pre('save', async function(next) {
  if (!this.totalPrice && this.roomId) {
    try {
      const Room = mongoose.model('Room');
      const room = await Room.findById(this.roomId);
      if (room) {
        const duration = this.duration || 1;
        this.totalPrice = room.price * duration;
      }
    } catch (error) {
      // Ignorer l'erreur si la chambre n'existe pas encore
    }
  }
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
