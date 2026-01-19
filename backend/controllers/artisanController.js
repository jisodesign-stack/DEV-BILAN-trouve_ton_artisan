/**
 * Contrôleur pour la gestion des artisans
 * @module controllers/artisanController
 */

const { Artisan, Specialite, Categorie } = require('../models');
const { Op } = require('sequelize');
const xss = require('xss');

/**
 * Récupère tous les artisans avec pagination et filtres
 * @route GET /api/artisans
 */
exports.getAllArtisans = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Filtre par catégorie
    const categorieSlug = req.query.categorie ? xss(req.query.categorie) : null;
    
    // Recherche par nom
    const search = req.query.search ? xss(req.query.search) : null;

    // Construction des conditions de recherche
    let whereClause = {};
    let includeClause = [{
      model: Specialite,
      as: 'specialite',
      attributes: ['id', 'nom'],
      include: [{
        model: Categorie,
        as: 'categorie',
        attributes: ['id', 'nom', 'slug']
      }]
    }];

    // Filtre par nom
    if (search) {
      whereClause.nom = {
        [Op.like]: `%${search}%`
      };
    }

    // Filtre par catégorie
    if (categorieSlug) {
      includeClause[0].include[0].where = { slug: categorieSlug };
      includeClause[0].include[0].required = true;
      includeClause[0].required = true;
    }

    const { count, rows: artisans } = await Artisan.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['note', 'DESC'], ['nom', 'ASC']],
      limit,
      offset,
      distinct: true
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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

/**
 * Récupère un artisan par son ID
 * @route GET /api/artisans/:id
 */
exports.getArtisanById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide'
      });
    }

    const artisan = await Artisan.findByPk(id, {
      include: [{
        model: Specialite,
        as: 'specialite',
        attributes: ['id', 'nom'],
        include: [{
          model: Categorie,
          as: 'categorie',
          attributes: ['id', 'nom', 'slug']
        }]
      }]
    });

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: artisan
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artisan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'artisan'
    });
  }
};

/**
 * Récupère les 3 artisans du mois (top_artisan = true)
 * @route GET /api/artisans/top
 */
exports.getTopArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      where: { top_artisan: true },
      include: [{
        model: Specialite,
        as: 'specialite',
        attributes: ['id', 'nom'],
        include: [{
          model: Categorie,
          as: 'categorie',
          attributes: ['id', 'nom', 'slug']
        }]
      }],
      order: [['note', 'DESC']],
      limit: 3
    });

    res.status(200).json({
      success: true,
      count: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des top artisans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des top artisans'
    });
  }
};

/**
 * Recherche des artisans par nom
 * @route GET /api/artisans/search
 */
exports.searchArtisans = async (req, res) => {
  try {
    const query = req.query.q ? xss(req.query.q) : '';

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La recherche doit contenir au moins 2 caractères'
      });
    }

    const artisans = await Artisan.findAll({
      where: {
        nom: {
          [Op.like]: `%${query}%`
        }
      },
      include: [{
        model: Specialite,
        as: 'specialite',
        attributes: ['id', 'nom'],
        include: [{
          model: Categorie,
          as: 'categorie',
          attributes: ['id', 'nom', 'slug']
        }]
      }],
      order: [['note', 'DESC']],
      limit: 20
    });

    res.status(200).json({
      success: true,
      count: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des artisans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche des artisans'
    });
  }
};
