/**
 * Middleware d'authentification par clé API
 * Vérifie le header x-api-key sur toutes les routes protégées
 * 
 * @module middleware/apiKeyAuth
 */

const apiKeyAuth = (req, res, next) => {
  // Bypass optionnel en développement
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
