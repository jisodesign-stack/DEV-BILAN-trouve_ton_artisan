/**
 * Serveur Express principal - API Trouve ton artisan
 * Point d'entrée de l'API REST pour la gestion des artisans,
 * catégories et formulaires de contact
 * 
 * @module server
 * @author Développeur Web
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection, sequelize } = require('./config/database');

const categorieRoutes = require('./routes/categorieRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const contactRoutes = require('./routes/contactRoutes');
const apiKeyAuth = require('./middleware/apiKeyAuth');

const app = express();
const PORT = process.env.PORT || 5000;

/* === MIDDLEWARES DE SÉCURITÉ === */

// Protection des headers HTTP (XSS, clickjacking, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Autorise le frontend (ports 3000 et 3001 en développement)
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting global - plus permissif en développement
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== 'production'
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

/* === MIDDLEWARES DE PARSING === */

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/* === ROUTES API === */

// Health check (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Trouve ton artisan opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Routes protégées par clé API (x-api-key header)
app.use('/api/categories', apiKeyAuth, categorieRoutes);
app.use('/api/artisans', apiKeyAuth, artisanRoutes);
app.use('/api/contact', apiKeyAuth, contactLimiter, contactRoutes);

// Fichiers statiques
app.use('/uploads', express.static('uploads'));

/* === GESTION DES ERREURS === */

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
