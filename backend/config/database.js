/**
 * Configuration Sequelize pour MySQL
 * Gère la connexion et les paramètres de pool de connexions
 * 
 * @module config/database
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // UTF-8 avec support des emojis et caractères spéciaux
    dialectOptions: {
      charset: 'utf8mb4'
    },
    // Pool de connexions pour optimiser les performances
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Options par défaut pour tous les modèles
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

/**
 * Teste la connexion à la base de données
 * @returns {Promise<boolean>} True si la connexion est établie
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
