/**
 * Modèle Artisan
 * Représente un artisan de la région Auvergne-Rhône-Alpes
 * Relation : appartient à une Spécialité (N:1)
 * 
 * @module models/Artisan
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artisan = sequelize.define('Artisan', {
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
        msg: 'Le nom de l\'artisan est obligatoire'
      },
      len: {
        args: [2, 100],
        msg: 'Le nom doit contenir entre 2 et 100 caractères'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'L\'email doit être valide'
      }
    }
  },
  note: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'La note minimale est 0'
      },
      max: {
        args: [5],
        msg: 'La note maximale est 5'
      }
    }
  },
  localisation: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La localisation est obligatoire'
      }
    }
  },
  a_propos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  site_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'L\'URL du site web doit être valide'
      }
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'default-artisan.jpg'
  },
  top_artisan: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  specialite_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'specialites',
      key: 'id'
    }
  }
}, {
  tableName: 'artisans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Artisan;
