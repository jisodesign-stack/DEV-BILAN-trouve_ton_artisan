/**
 * Composant principal de l'application
 * Gère le routage, la structure globale et le chargement des catégories
 * 
 * @module App
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ArtisansListPage from './pages/ArtisansListPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import { getCategories } from './services/api';

function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement initial des catégories pour le menu de navigation
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
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
      {/* Skip link pour navigation clavier (accessibilité WCAG) */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <Header categories={categories} loading={loading} />

      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorie/:slug" element={<ArtisansListPage />} />
          <Route path="/recherche" element={<ArtisansListPage />} />
          <Route path="/artisan/:id" element={<ArtisanDetailPage />} />
          <Route path="/mentions-legales" element={<LegalPage type="mentions" />} />
          <Route path="/donnees-personnelles" element={<LegalPage type="donnees" />} />
          <Route path="/accessibilite" element={<LegalPage type="accessibilite" />} />
          <Route path="/cookies" element={<LegalPage type="cookies" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
