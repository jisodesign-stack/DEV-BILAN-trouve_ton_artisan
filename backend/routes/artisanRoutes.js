/**
 * Routes pour les artisans
 * @module routes/artisanRoutes
 */

const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisanController');

/**
 * @route   GET /api/artisans/top
 * @desc    Récupère les 3 artisans du mois
 * @access  Public
 */
router.get('/top', artisanController.getTopArtisans);

/**
 * @route   GET /api/artisans/search
 * @desc    Recherche des artisans par nom
 * @access  Public
 */
router.get('/search', artisanController.searchArtisans);

/**
 * @route   GET /api/artisans
 * @desc    Récupère tous les artisans avec pagination et filtres
 * @access  Public
 */
router.get('/', artisanController.getAllArtisans);

/**
 * @route   GET /api/artisans/:id
 * @desc    Récupère un artisan par son ID
 * @access  Public
 */
router.get('/:id', artisanController.getArtisanById);

module.exports = router;
