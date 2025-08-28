import express from 'express';
import { body, param, query } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getActiveReservations,
  getReservationsByPeriod,
  getReservationStats,
  checkRoomAvailability
} from '../controllers/reservationController.js';

const router = express.Router();

// Middleware de protection pour toutes les routes
router.use(protect);

// Validation pour la création de réservation
const createReservationValidation = [
  body('roomId')
    .isMongoId()
    .withMessage('ID de chambre invalide'),
  body('guestName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom du client doit contenir entre 2 et 100 caractères')
    .trim(),
  body('guestEmail')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('guestPhone')
    .matches(/^[\+]?[0-9\s\-\(\)]{8,20}$/)
    .withMessage('Veuillez fournir un numéro de téléphone valide'),
  body('checkIn')
    .isISO8601()
    .withMessage('Date d\'arrivée invalide')
    .custom((value) => {
      const checkInDate = new Date(value);
      const now = new Date();
      if (checkInDate <= now) {
        throw new Error('La date d\'arrivée doit être dans le futur');
      }
      return true;
    }),
  body('checkOut')
    .isISO8601()
    .withMessage('Date de départ invalide')
    .custom((value, { req }) => {
      const checkOutDate = new Date(value);
      const checkInDate = new Date(req.body.checkIn);
      if (checkOutDate <= checkInDate) {
        throw new Error('La date de départ doit être après la date d\'arrivée');
      }
      return true;
    }),
  body('totalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix total doit être un nombre positif'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])
    .withMessage('Statut invalide'),
  body('numberOfGuests.adults')
    .isInt({ min: 1, max: 4 })
    .withMessage('Le nombre d\'adultes doit être entre 1 et 4'),
  body('numberOfGuests.children')
    .optional()
    .isInt({ min: 0, max: 4 })
    .withMessage('Le nombre d\'enfants doit être entre 0 et 4'),
  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Les demandes spéciales ne peuvent pas dépasser 500 caractères'),
  body('payment.method')
    .optional()
    .isIn(['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'])
    .withMessage('Méthode de paiement invalide'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Les notes ne peuvent pas dépasser 1000 caractères')
];

// Validation pour la mise à jour de réservation
const updateReservationValidation = [
  body('roomId')
    .optional()
    .isMongoId()
    .withMessage('ID de chambre invalide'),
  body('guestName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom du client doit contenir entre 2 et 100 caractères')
    .trim(),
  body('guestEmail')
    .optional()
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('guestPhone')
    .optional()
    .matches(/^[\+]?[0-9\s\-\(\)]{8,20}$/)
    .withMessage('Veuillez fournir un numéro de téléphone valide'),
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Date d\'arrivée invalide'),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Date de départ invalide'),
  body('totalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix total doit être un nombre positif'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])
    .withMessage('Statut invalide'),
  body('numberOfGuests.adults')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Le nombre d\'adultes doit être entre 1 et 4'),
  body('numberOfGuests.children')
    .optional()
    .isInt({ min: 0, max: 4 })
    .withMessage('Le nombre d\'enfants doit être entre 0 et 4'),
  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Les demandes spéciales ne peuvent pas dépasser 500 caractères'),
  body('payment.method')
    .optional()
    .isIn(['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'])
    .withMessage('Méthode de paiement invalide'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Les notes ne peuvent pas dépasser 1000 caractères')
];

// Validation pour la mise à jour du statut
const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])
    .withMessage('Statut invalide')
];

// Validation pour la vérification de disponibilité
const checkAvailabilityValidation = [
  body('roomId')
    .isMongoId()
    .withMessage('ID de chambre invalide'),
  body('checkIn')
    .isISO8601()
    .withMessage('Date d\'arrivée invalide'),
  body('checkOut')
    .isISO8601()
    .withMessage('Date de départ invalide')
];

// Validation des paramètres
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de réservation invalide')
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
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'all'])
    .withMessage('Statut invalide'),
  query('roomId')
    .optional()
    .isMongoId()
    .withMessage('ID de chambre invalide'),
  query('guestEmail')
    .optional()
    .isEmail()
    .withMessage('Email invalide'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 1 et 100 caractères'),
  query('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Date d\'arrivée invalide'),
  query('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Date de départ invalide')
];

// Validation des paramètres de période
const periodValidation = [
  query('startDate')
    .isISO8601()
    .withMessage('Date de début invalide'),
  query('endDate')
    .isISO8601()
    .withMessage('Date de fin invalide')
];

// Routes principales
router.get('/', queryValidation, getReservations);
router.get('/active', getActiveReservations);
router.get('/period', periodValidation, getReservationsByPeriod);
router.get('/stats/overview', getReservationStats);
router.get('/:id', idValidation, getReservation);

// Routes protégées par rôle
router.post('/', createReservationValidation, createReservation);
router.post('/check-availability', checkAvailabilityValidation, checkRoomAvailability);
router.put('/:id', idValidation, updateReservationValidation, updateReservation);
router.delete('/:id', authorize('admin', 'manager'), idValidation, deleteReservation);
router.patch('/:id/status', authorize('admin', 'manager', 'staff'), idValidation, updateStatusValidation, updateReservationStatus);

export default router;
