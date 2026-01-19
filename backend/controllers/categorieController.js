/**
 * Contrôleur pour la gestion des catégories
 * @module controllers/categorieController
 */

const { Categorie, Specialite, Artisan } = require('../models');
const { Op } = require('sequelize');
const xss = require('xss');

/**
 * Récupère toutes les catégories
 * @route GET /api/categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      order: [['nom', 'ASC']],
      include: [{
        model: Specialite,
        as: 'specialites',
        attributes: ['id', 'nom']
      }]
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};

/**
 * Récupère une catégorie par son slug avec ses spécialités et artisans
 * @route GET /api/categories/:slug
 */
exports.getCategorieBySlug = async (req, res) => {
  try {
    const slug = xss(req.params.slug);

    const categorie = await Categorie.findOne({
      where: { slug },
      include: [{
        model: Specialite,
        as: 'specialites',
        include: [{
          model: Artisan,
          as: 'artisans',
          attributes: ['id', 'nom', 'note', 'localisation', 'image']
        }]
      }]
    });

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: categorie
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la catégorie'
    });
  }
};

/**
 * Récupère les artisans d'une catégorie par son slug
 * @route GET /api/categories/:slug/artisans
 */
exports.getArtisansByCategorie = async (req, res) => {
  try {
    const slug = xss(req.params.slug);

    const categorie = await Categorie.findOne({
      where: { slug },
      include: [{
        model: Specialite,
        as: 'specialites',
        include: [{
          model: Artisan,
          as: 'artisans',
          include: [{
            model: Specialite,
            as: 'specialite',
            attributes: ['id', 'nom']
          }]
        }]
      }]
    });

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Extraire tous les artisans des spécialités
    const artisans = categorie.specialites.reduce((acc, spec) => {
      return acc.concat(spec.artisans);
    }, []);

    res.status(200).json({
      success: true,
      categorie: {
        id: categorie.id,
        nom: categorie.nom,
        slug: categorie.slug
      },
      count: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des artisans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des artisans'
    });
  }
};
