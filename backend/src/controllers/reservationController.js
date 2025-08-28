import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';

// @desc    Obtenir toutes les réservations avec pagination et filtres
// @route   GET /api/reservations
// @access  Private
export const getReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const filters = { isActive: true };
    
    if (req.query.status && req.query.status !== 'all') {
      filters.status = req.query.status;
    }
    
    if (req.query.roomId) {
      filters.roomId = req.query.roomId;
    }
    
    if (req.query.guestEmail) {
      filters.guestEmail = new RegExp(req.query.guestEmail, 'i');
    }

    // Recherche par texte
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filters.$or = [
        { guestName: searchRegex },
        { guestEmail: searchRegex }
      ];
    }

    // Filtres de date
    if (req.query.checkIn) {
      filters.checkIn = { $gte: new Date(req.query.checkIn) };
    }
    
    if (req.query.checkOut) {
      filters.checkOut = { $lte: new Date(req.query.checkOut) };
    }

    // Compter le total des résultats
    const total = await Reservation.countDocuments(filters);
    
    // Obtenir les réservations avec pagination et population
    const reservations = await Reservation.find(filters)
      .populate('roomId', 'number type floor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        reservations,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/reservations/:id
// @access  Private
export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('roomId', 'number type floor price amenities');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée.'
      });
    }

    res.status(200).json({
      success: true,
      data: { reservation }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de réservation invalide.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Créer une nouvelle réservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    // Vérifier si la chambre existe
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée.'
      });
    }

    // Vérifier si la chambre est disponible
    const isAvailable = await Reservation.checkRoomAvailability(roomId, new Date(checkIn), new Date(checkOut));
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'La chambre n\'est pas disponible pour ces dates.'
      });
    }

    // Créer la réservation
    const reservation = await Reservation.create(req.body);

    // Mettre à jour le statut de la chambre
    room.status = 'reserved';
    await room.save();

    // Populer les informations de la chambre
    await reservation.populate('roomId', 'number type floor price');

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès.',
      data: { reservation }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation.',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Mettre à jour une réservation
// @route   PUT /api/reservations/:id
// @access  Private
export const updateReservation = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const reservationId = req.params.id;

    // Vérifier si la réservation existe
    const existingReservation = await Reservation.findById(reservationId);
    if (!existingReservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée.'
      });
    }

    // Si la chambre ou les dates changent, vérifier la disponibilité
    if ((roomId && roomId !== existingReservation.roomId.toString()) ||
        (checkIn && new Date(checkIn).getTime() !== existingReservation.checkIn.getTime()) ||
        (checkOut && new Date(checkOut).getTime() !== existingReservation.checkOut.getTime())) {
      
      const newRoomId = roomId || existingReservation.roomId;
      const newCheckIn = checkIn ? new Date(checkIn) : existingReservation.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : existingReservation.checkOut;

      const isAvailable = await Reservation.checkRoomAvailability(
        newRoomId, 
        newCheckIn, 
        newCheckOut, 
        reservationId
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'La chambre n\'est pas disponible pour ces dates.'
        });
      }
    }

    // Mettre à jour la réservation
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('roomId', 'number type floor price');

    res.status(200).json({
      success: true,
      message: 'Réservation mise à jour avec succès.',
      data: { reservation }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation.',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Supprimer une réservation (soft delete)
// @route   DELETE /api/reservations/:id
// @access  Private (Admin/Manager)
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée.'
      });
    }

    // Vérifier si la réservation peut être supprimée
    if (reservation.status === 'checked_in') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une réservation en cours.'
      });
    }

    // Soft delete
    reservation.isActive = false;
    await reservation.save();

    // Si la chambre était réservée, la remettre disponible
    if (reservation.status === 'reserved') {
      await Room.findByIdAndUpdate(reservation.roomId, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès.'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de réservation invalide.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Mettre à jour le statut d'une réservation
// @route   PATCH /api/reservations/:id/status
// @access  Private (Admin/Manager/Staff)
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est requis.'
      });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée.'
      });
    }

    // Mettre à jour le statut de la réservation
    reservation.status = status;
    await reservation.save();

    // Mettre à jour le statut de la chambre
    let roomStatus = 'available';
    if (status === 'confirmed' || status === 'checked_in') {
      roomStatus = 'occupied';
    } else if (status === 'reserved') {
      roomStatus = 'reserved';
    }

    await Room.findByIdAndUpdate(reservation.roomId, { status: roomStatus });

    // Populer les informations de la chambre
    await reservation.populate('roomId', 'number type floor price');

    res.status(200).json({
      success: true,
      message: 'Statut de la réservation mis à jour avec succès.',
      data: { reservation }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation.',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les réservations actives
// @route   GET /api/reservations/active
// @access  Private
export const getActiveReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getActiveReservations();

    res.status(200).json({
      success: true,
      data: { reservations }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations actives:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les réservations par période
// @route   GET /api/reservations/period
// @access  Private
export const getReservationsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Les dates de début et de fin sont requises.'
      });
    }

    const reservations = await Reservation.getReservationsByPeriod(
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      data: { reservations }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations par période:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les statistiques des réservations
// @route   GET /api/reservations/stats/overview
// @access  Private
export const getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.getReservationStats();

    res.status(200).json({
      success: true,
      data: { stats: stats[0] || {} }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Vérifier la disponibilité d'une chambre
// @route   POST /api/reservations/check-availability
// @access  Private
export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de la chambre et les dates sont requis.'
      });
    }

    const isAvailable = await Reservation.checkRoomAvailability(
      roomId,
      new Date(checkIn),
      new Date(checkOut)
    );

    res.status(200).json({
      success: true,
      data: { isAvailable }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};
