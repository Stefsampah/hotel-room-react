import express from 'express';
import { body, param, query } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
  getAvailableRooms,
  getRoomsByType,
  getRoomsByFloor,
  updateRoomStatus
} from '../controllers/roomController.js';

const router = express.Router();

// Middleware de protection pour toutes les routes
router.use(protect);

// Validation pour la création de chambre
const createRoomValidation = [
  body('number')
    .isLength({ min: 3, max: 4 })
    .withMessage('Le numéro de chambre doit contenir 3 ou 4 chiffres')
    .matches(/^\d{3,4}$/)
    .withMessage('Le numéro de chambre ne peut contenir que des chiffres'),
  body('type')
    .isIn(['single', 'double', 'suite', 'deluxe', 'family'])
    .withMessage('Type de chambre invalide'),
  body('capacity')
    .isInt({ min: 1, max: 6 })
    .withMessage('La capacité doit être entre 1 et 6 personnes'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('floor')
    .isInt({ min: 1, max: 50 })
    .withMessage('L\'étage doit être entre 1 et 50'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Les équipements doivent être un tableau'),
  body('amenities.*')
    .optional()
    .isIn([
      'wifi', 'tv', 'coffee', 'balcony', 'jacuzzi', 'city-view',
      'family-friendly', 'air-conditioning', 'minibar', 'safe',
      'room-service', 'parking', 'gym-access', 'pool-access'
    ])
    .withMessage('Équipement invalide'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('L\'URL de l\'image doit être valide')
];

// Validation pour la mise à jour de chambre
const updateRoomValidation = [
  body('number')
    .optional()
    .isLength({ min: 3, max: 4 })
    .withMessage('Le numéro de chambre doit contenir 3 ou 4 chiffres')
    .matches(/^\d{3,4}$/)
    .withMessage('Le numéro de chambre ne peut contenir que des chiffres'),
  body('type')
    .optional()
    .isIn(['single', 'double', 'suite', 'deluxe', 'family'])
    .withMessage('Type de chambre invalide'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage('La capacité doit être entre 1 et 6 personnes'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('floor')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('L\'étage doit être entre 1 et 50'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'maintenance', 'reserved', 'cleaning'])
    .withMessage('Statut invalide'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Les équipements doivent être un tableau'),
  body('amenities.*')
    .optional()
    .isIn([
      'wifi', 'tv', 'coffee', 'balcony', 'jacuzzi', 'city-view',
      'family-friendly', 'air-conditioning', 'minibar', 'safe',
      'room-service', 'parking', 'gym-access', 'pool-access'
    ])
    .withMessage('Équipement invalide'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('L\'URL de l\'image doit être valide')
];

// Validation pour la mise à jour du statut
const updateStatusValidation = [
  body('status')
    .isIn(['available', 'occupied', 'maintenance', 'reserved', 'cleaning'])
    .withMessage('Statut invalide')
];

// Validation des paramètres
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de chambre invalide')
];

const typeValidation = [
  param('type')
    .isIn(['single', 'double', 'suite', 'deluxe', 'family'])
    .withMessage('Type de chambre invalide')
];

const floorValidation = [
  param('floor')
    .isInt({ min: 1, max: 50 })
    .withMessage('L\'étage doit être entre 1 et 50')
];

// Validation des query parameters
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  query('type')
    .optional()
    .isIn(['single', 'double', 'suite', 'deluxe', 'family', 'all'])
    .withMessage('Type de chambre invalide'),
  query('status')
    .optional()
    .isIn(['available', 'occupied', 'maintenance', 'reserved', 'cleaning', 'all'])
    .withMessage('Statut invalide'),
  query('floor')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('L\'étage doit être entre 1 et 50'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix minimum doit être un nombre positif'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix maximum doit être un nombre positif'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 1 et 100 caractères')
];

// Routes principales
router.get('/', queryValidation, getRooms);
router.get('/stats/overview', getRoomStats);
router.get('/available', getAvailableRooms);
router.get('/type/:type', typeValidation, getRoomsByType);
router.get('/floor/:floor', floorValidation, getRoomsByFloor);
router.get('/:id', idValidation, getRoom);

// Routes protégées par rôle
router.post('/', authorize('admin', 'manager'), createRoomValidation, createRoom);
router.put('/:id', authorize('admin', 'manager'), idValidation, updateRoomValidation, updateRoom);
router.delete('/:id', authorize('admin'), idValidation, deleteRoom);
router.patch('/:id/status', authorize('admin', 'manager', 'staff'), idValidation, updateStatusValidation, updateRoomStatus);

export default router;
