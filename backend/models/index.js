/**
 * Point d'entrée des modèles Sequelize
 * Définit les associations : Catégorie -> Spécialité -> Artisan
 * 
 * @module models/index
 */

const { sequelize } = require('../config/database');
const Categorie = require('./Categorie');
const Specialite = require('./Specialite');
const Artisan = require('./Artisan');

/* === ASSOCIATIONS === */

// Catégorie (1) --- (N) Spécialité
Categorie.hasMany(Specialite, {
  foreignKey: 'categorie_id',
  as: 'specialites',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Specialite.belongsTo(Categorie, {
  foreignKey: 'categorie_id',
  as: 'categorie'
});

// Spécialité (1) --- (N) Artisan
Specialite.hasMany(Artisan, {
  foreignKey: 'specialite_id',
  as: 'artisans',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Artisan.belongsTo(Specialite, {
  foreignKey: 'specialite_id',
  as: 'specialite'
});

module.exports = {
  sequelize,
  Categorie,
  Specialite,
  Artisan
};
