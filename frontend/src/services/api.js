/**
 * Service API - Communication avec le backend
 * Centralise toutes les requêtes HTTP vers l'API REST
 * 
 * @module services/api
 */

import axios from 'axios';

// Instance Axios préconfigurée avec l'URL de base et l'authentification
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_API_KEY || ''
  }
});

// Intercepteur de réponse pour la gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      if (error.response) {
        console.error('Erreur API:', error.response.data.message || error.response.statusText);
      } else if (error.request) {
        console.error('Erreur réseau: Le serveur ne répond pas');
      } else {
        console.error('Erreur:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

/* === CATÉGORIES === */

/**
 * Récupère toutes les catégories
 * @returns {Promise} Liste des catégories
 */
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Récupère une catégorie par son slug
 * @param {string} slug - Slug de la catégorie
 * @returns {Promise} Détails de la catégorie
 */
export const getCategorieBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

/**
 * Récupère les artisans d'une catégorie
 * @param {string} slug - Slug de la catégorie
 * @returns {Promise} Liste des artisans de la catégorie
 */
export const getArtisansByCategorie = async (slug) => {
  const response = await api.get(`/categories/${slug}/artisans`);
  return response.data;
};

// ===== SERVICES ARTISANS =====

/**
 * Récupère tous les artisans avec pagination et filtres
 * @param {Object} params - Paramètres de requête
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre d'éléments par page
 * @param {string} params.categorie - Slug de la catégorie
 * @param {string} params.search - Recherche par nom
 * @returns {Promise} Liste paginée des artisans
 */
export const getArtisans = async (params = {}) => {
  const response = await api.get('/artisans', { params });
  return response.data;
};

/** Récupère un artisan par son ID */
export const getArtisanById = async (id) => {
  const response = await api.get(`/artisans/${id}`);
  return response.data;
};

/** Récupère les 3 artisans mis en avant sur la page d'accueil */
export const getTopArtisans = async () => {
  const response = await api.get('/artisans/top');
  return response.data;
};

/** Recherche des artisans par nom (min. 2 caractères) */
export const searchArtisans = async (query) => {
  const response = await api.get('/artisans/search', { params: { q: query } });
  return response.data;
};

/* === CONTACT === */

/**
 * Envoie un email de contact à un artisan
 * @param {Object} data - {artisan_id, nom, email, objet, message}
 */
export const sendContactEmail = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export default api;
