/**
 * Routes pour les catégories
 * @module routes/categorieRoutes
 */

const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

/**
 * @route   GET /api/categories
 * @desc    Récupère toutes les catégories
 * @access  Public
 */
router.get('/', categorieController.getAllCategories);

/**
 * @route   GET /api/categories/:slug
 * @desc    Récupère une catégorie par son slug
 * @access  Public
 */
router.get('/:slug', categorieController.getCategorieBySlug);

/**
 * @route   GET /api/categories/:slug/artisans
 * @desc    Récupère les artisans d'une catégorie
 * @access  Public
 */
router.get('/:slug/artisans', categorieController.getArtisansByCategorie);

module.exports = router;
