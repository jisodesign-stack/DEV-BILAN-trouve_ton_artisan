/**
 * Composant principal de l'application
 * Gère le routage et la structure globale
 * @module App
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

// Composants de layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ArtisansListPage from './pages/ArtisansListPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

// Services
import { getCategories } from './services/api';

/**
 * Composant principal de l'application
 * @returns {JSX.Element} L'application complète
 */
function App() {
  // État pour stocker les catégories (menu dynamique)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        // Gestion silencieuse - les catégories seront vides
        if (process.env.NODE_ENV === 'development') {
          console.error('Erreur lors du chargement des catégories:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Header avec menu dynamique */}
      <Header categories={categories} loading={loading} />

      {/* Contenu principal */}
      <main id="main-content" role="main">
        {useMemo(() => (
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<HomePage />} />

            {/* Liste des artisans par catégorie */}
            <Route path="/categorie/:slug" element={<ArtisansListPage />} />

            {/* Recherche d'artisans */}
            <Route path="/recherche" element={<ArtisansListPage />} />

            {/* Fiche artisan */}
            <Route path="/artisan/:id" element={<ArtisanDetailPage />} />

            {/* Pages légales */}
            <Route path="/mentions-legales" element={<LegalPage type="mentions" />} />
            <Route path="/donnees-personnelles" element={<LegalPage type="donnees" />} />
            <Route path="/accessibilite" element={<LegalPage type="accessibilite" />} />
            <Route path="/cookies" element={<LegalPage type="cookies" />} />

            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        ), [])}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
