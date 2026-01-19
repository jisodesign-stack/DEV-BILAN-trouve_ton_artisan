/**
 * Serveur Express principal - API Trouve ton artisan
 * @module server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection, sequelize } = require('./config/database');

// Import des routes
const categorieRoutes = require('./routes/categorieRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Import des middlewares
const apiKeyAuth = require('./middleware/apiKeyAuth');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES DE SÉCURITÉ =====

// Helmet - Protection des headers HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuration CORS - Limité au frontend autorisé
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - Protection contre les attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Rate limiting spécifique pour le formulaire de contact
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // 5 emails par heure
  message: {
    success: false,
    message: 'Limite d\'envoi de messages atteinte. Veuillez réessayer plus tard.'
  }
});

// ===== MIDDLEWARES DE PARSING =====

// Parser JSON avec limite de taille
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ===== ROUTES =====

// Route de santé (sans authentification)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Trouve ton artisan opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Routes protégées par clé API
app.use('/api/categories', apiKeyAuth, categorieRoutes);
app.use('/api/artisans', apiKeyAuth, artisanRoutes);
app.use('/api/contact', apiKeyAuth, contactLimiter, contactRoutes);

// Servir les fichiers statiques (images des artisans)
app.use('/uploads', express.static('uploads'));

// ===== GESTION DES ERREURS =====

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Une erreur est survenue sur le serveur'
  });
});

// ===== DÉMARRAGE DU SERVEUR =====

const startServer = async () => {
  try {
    // Test de la connexion à la base de données
    await testConnection();
    
    // Synchronisation des modèles (en développement uniquement)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('📦 Modèles synchronisés avec la base de données');
    }
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
