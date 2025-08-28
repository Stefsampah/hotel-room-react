import Room from '../models/Room.js';

// @desc    Obtenir toutes les chambres avec pagination et filtres
// @route   GET /api/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const filters = { isActive: true };
    
    if (req.query.type && req.query.type !== 'all') {
      filters.type = req.query.type;
    }
    
    if (req.query.status && req.query.status !== 'all') {
      filters.status = req.query.status;
    }
    
    if (req.query.floor) {
      filters.floor = parseInt(req.query.floor);
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Recherche par texte
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filters.$or = [
        { number: searchRegex },
        { description: searchRegex }
      ];
    }

    // Compter le total des résultats
    const total = await Room.countDocuments(filters);
    
    // Obtenir les chambres avec pagination
    const rooms = await Room.find(filters)
      .sort({ number: 1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        rooms,
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
    console.error('Erreur lors de la récupération des chambres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir une chambre par ID
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée.'
      });
    }

    res.status(200).json({
      success: true,
      data: { room }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la chambre:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de chambre invalide.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Créer une nouvelle chambre
// @route   POST /api/rooms
// @access  Private (Admin/Manager)
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Chambre créée avec succès.',
      data: { room }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la chambre:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Une chambre avec ce numéro existe déjà.'
      });
    }

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

// @desc    Mettre à jour une chambre
// @route   PUT /api/rooms/:id
// @access  Private (Admin/Manager)
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chambre mise à jour avec succès.',
      data: { room }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la chambre:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Une chambre avec ce numéro existe déjà.'
      });
    }

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

// @desc    Supprimer une chambre (soft delete)
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée.'
      });
    }

    // Vérifier si la chambre a des réservations actives
    const Reservation = (await import('../models/Reservation.js')).default;
    const activeReservations = await Reservation.find({
      roomId: room._id,
      status: { $in: ['confirmed', 'checked_in'] }
    });

    if (activeReservations.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une chambre avec des réservations actives.'
      });
    }

    // Soft delete
    room.isActive = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Chambre supprimée avec succès.'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la chambre:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de chambre invalide.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les statistiques des chambres
// @route   GET /api/rooms/stats/overview
// @access  Private
export const getRoomStats = async (req, res) => {
  try {
    const stats = await Room.getRoomStats();

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

// @desc    Obtenir les chambres disponibles
// @route   GET /api/rooms/available
// @access  Private
export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.getAvailableRooms();

    res.status(200).json({
      success: true,
      data: { rooms }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des chambres disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les chambres par type
// @route   GET /api/rooms/type/:type
// @access  Private
export const getRoomsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const rooms = await Room.getRoomsByType(type);

    res.status(200).json({
      success: true,
      data: { rooms }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des chambres par type:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Obtenir les chambres par étage
// @route   GET /api/rooms/floor/:floor
// @access  Private
export const getRoomsByFloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const rooms = await Room.getRoomsByFloor(parseInt(floor));

    res.status(200).json({
      success: true,
      data: { rooms }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des chambres par étage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.'
    });
  }
};

// @desc    Mettre à jour le statut d'une chambre
// @route   PATCH /api/rooms/:id/status
// @access  Private (Admin/Manager/Staff)
export const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est requis.'
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la chambre mis à jour avec succès.',
      data: { room }
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
