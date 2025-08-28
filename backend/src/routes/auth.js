import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  login,
  register,
  getMe,
  logout,
  changePassword,
  refreshToken
} from '../controllers/authController.js';

const router = express.Router();

// Validation des données de connexion
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validation des données d'inscription
const registerValidation = [
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

// Validation du changement de mot de passe
const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('L\'ancien mot de passe doit contenir au moins 6 caractères'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
      }
      return true;
    })
];

// Routes publiques
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

// Routes protégées
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePasswordValidation, changePassword);
router.post('/refresh', protect, refreshToken);

export default router;
