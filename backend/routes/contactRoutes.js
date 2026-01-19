/**
 * Routes pour le formulaire de contact
 * @module routes/contactRoutes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const validateRequest = require('../middleware/validateRequest');

/**
 * Règles de validation pour le formulaire de contact
 */
const contactValidation = [
  body('artisan_id')
    .isInt({ min: 1 })
    .withMessage('L\'ID de l\'artisan est invalide'),
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('L\'email doit être valide')
    .normalizeEmail(),
  body('objet')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('L\'objet doit contenir entre 3 et 200 caractères')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Le message doit contenir entre 10 et 2000 caractères')
    .escape()
];

/**
 * @route   POST /api/contact
 * @desc    Envoie un email de contact à un artisan
 * @access  Public
 */
router.post('/', contactValidation, validateRequest, contactController.sendContactEmail);

module.exports = router;
