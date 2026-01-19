/**
 * Middleware de validation des requêtes avec express-validator
 * @module middleware/validateRequest
 */

const { validationResult } = require('express-validator');

/**
 * Vérifie les résultats de validation et retourne les erreurs si présentes
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données de validation invalides',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = validateRequest;
