/**
 * Middleware de vérification de la clé API
 * Sécurise l'accès à l'API en vérifiant la présence d'une clé valide
 * @module middleware/apiKeyAuth
 */

/**
 * Vérifie que la clé API est présente et valide
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const apiKeyAuth = (req, res, next) => {
  // En mode développement, on peut désactiver la vérification
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_API_KEY === 'true') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Clé API manquante. Accès non autorisé.'
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Clé API invalide. Accès refusé.'
    });
  }

  next();
};

module.exports = apiKeyAuth;
