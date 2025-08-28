import express from 'express';
import { body, param, query } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus,
  getUserStats,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';

const router = express.Router();

// Middleware de protection pour toutes les routes
router.use(protect);

// Validation pour la création d'utilisateur
const createUserValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  body('email')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .trim(),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom de famille doit contenir entre 2 et 50 caractères')
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Le rôle doit être admin, manager ou staff')
];

// Validation pour la mise à jour d'utilisateur
const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom de famille doit contenir entre 2 et 50 caractères')
    .trim()
];

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom de famille doit contenir entre 2 et 50 caractères')
    .trim()
];

// Validation pour la mise à jour du rôle
const updateRoleValidation = [
  body('role')
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Le rôle doit être admin, manager ou staff')
];

// Validation pour la mise à jour du statut
const updateStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('Le statut doit être un booléen')
];

// Validation des paramètres
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID d\'utilisateur invalide')
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
  query('role')
    .optional()
    .isIn(['admin', 'manager', 'staff', 'all'])
    .withMessage('Rôle invalide'),
  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être true ou false'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 1 et 100 caractères')
];

// Routes pour le profil de l'utilisateur connecté
router.get('/profile', getUserProfile);
router.put('/profile', updateProfileValidation, updateUserProfile);

// Routes principales (protégées par rôle)
router.get('/', authorize('admin', 'manager'), queryValidation, getUsers);
router.get('/stats/overview', authorize('admin'), getUserStats);
router.get('/:id', authorize('admin', 'manager'), idValidation, getUser);

// Routes protégées par rôle Admin
router.post('/', authorize('admin'), createUserValidation, createUser);
router.put('/:id', authorize('admin', 'manager'), idValidation, updateUserValidation, updateUser);
router.delete('/:id', authorize('admin'), idValidation, deleteUser);
router.patch('/:id/role', authorize('admin'), idValidation, updateRoleValidation, updateUserRole);
router.patch('/:id/status', authorize('admin'), idValidation, updateStatusValidation, updateUserStatus);

export default router;
