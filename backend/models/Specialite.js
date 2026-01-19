/**
 * Modèle Spécialité
 * Métier précis d'un artisan (ex: Menuisier, Boulanger)
 * Relations : appartient à une Catégorie (N:1), possède des Artisans (1:N)
 * 
 * @module models/Specialite
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialite = sequelize.define('Specialite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom de la spécialité est obligatoire'
      },
      len: {
        args: [2, 100],
        msg: 'Le nom doit contenir entre 2 et 100 caractères'
      }
    }
  },
  categorie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'specialites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Specialite;
