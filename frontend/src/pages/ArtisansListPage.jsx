/**
 * Page de liste des artisans
 * Affiche les artisans filtrés par catégorie ou recherche
 * @module pages/ArtisansListPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';

// Composants
import { ArtisanCard, Loader } from '../components/common';

// Services
import { getArtisans, getArtisansByCategorie, searchArtisans, getCategories } from '../services/api';

// Styles
import './ArtisansListPage.scss';

/**
 * Page de liste des artisans
 * @returns {JSX.Element} La page de liste
 */
function ArtisansListPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Recherche
  const searchQuery = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  /**
   * Charge les artisans selon les filtres
   */
  const fetchArtisans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchQuery) {
        // Recherche par nom
        response = await searchArtisans(searchQuery);
        setCurrentCategorie(null);
      } else if (slug) {
        // Filtre par catégorie
        response = await getArtisansByCategorie(slug);
        setCurrentCategorie(response.categorie);
      } else {
        // Tous les artisans
        response = await getArtisans({ page: currentPage, limit: 12 });
        setCurrentCategorie(null);
        setTotalPages(response.totalPages || 1);
      }
      
      setArtisans(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des artisans:', err);
      setError('Impossible de charger les artisans. Veuillez réessayer.');
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  }, [slug, searchQuery, currentPage]);

  /**
   * Charge les catégories pour le filtre
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Chargement des artisans quand les filtres changent
  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  // Reset de la recherche locale quand la catégorie change
  useEffect(() => {
    if (slug) {
      setLocalSearch('');
    }
  }, [slug]);

  /**
   * Gère la soumission de la recherche
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim().length >= 2) {
      setSearchParams({ q: localSearch.trim() });
      setCurrentPage(1);
    }
  };

  /**
   * Génère le titre de la page
   */
  const getPageTitle = () => {
    if (searchQuery) {
      return `Recherche : "${searchQuery}"`;
    }
    if (currentCategorie) {
      return currentCategorie.nom;
    }
    return 'Tous les artisans';
  };

  /**
   * Génère le sous-titre de la page
   */
  const getPageSubtitle = () => {
    const count = artisans.length;
    if (count === 0) {
      return 'Aucun artisan trouvé';
    }
    return `${count} artisan${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} - Trouve ton artisan</title>
        <meta 
          name="description" 
          content={`Découvrez ${artisans.length} artisans ${currentCategorie ? `dans la catégorie ${currentCategorie.nom}` : 'en région Auvergne-Rhône-Alpes'}.`} 
        />
      </Helmet>

      <div className="artisans-list">
        {/* Header */}
        <header className="artisans-list__header">
          <div className="container">
            <h1 className="artisans-list__title">{getPageTitle()}</h1>
            <p className="artisans-list__subtitle">{getPageSubtitle()}</p>
          </div>
        </header>

        <div className="container">
          {/* Filtres */}
          <div className="artisans-list__filters" role="search">
            {/* Recherche */}
            <div className="artisans-list__filter-search">
              <label htmlFor="search" className="artisans-list__filter-label">
                Rechercher par nom
              </label>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="search"
                  id="search"
                  className="form-control"
                  placeholder="Nom de l'artisan..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  aria-describedby="search-help"
                />
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  aria-label="Rechercher"
                >
                  <FiSearch aria-hidden="true" />
                </button>
              </form>
              <span id="search-help" className="visually-hidden">
                Entrez au moins 2 caractères
              </span>
            </div>

            {/* Filtre par catégorie */}
            <div className="artisans-list__filter-group">
              <label htmlFor="category-filter" className="artisans-list__filter-label">
                Catégorie
              </label>
              <select
                id="category-filter"
                className="artisans-list__filter-select"
                value={slug || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/categorie/${e.target.value}`;
                  } else {
                    window.location.href = '/recherche';
                  }
                }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des artisans */}
          {loading ? (
            <Loader message="Chargement des artisans..." />
          ) : error ? (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          ) : (
            <div className="artisans-list__grid">
              {artisans.length > 0 ? (
                artisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))
              ) : (
                <div className="artisans-list__empty">
                  <FiSearch className="artisans-list__empty-icon" aria-hidden="true" />
                  <h2 className="artisans-list__empty-title">Aucun artisan trouvé</h2>
                  <p className="artisans-list__empty-text">
                    Essayez avec d'autres critères de recherche ou explorez nos catégories.
                  </p>
                  <Link to="/" className="artisans-list__empty-link">
                    Retour à l'accueil
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !searchQuery && !slug && totalPages > 1 && (
            <nav className="artisans-list__pagination" aria-label="Pagination">
              <button
                className="artisans-list__pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Page précédente"
              >
                ←
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`artisans-list__pagination-btn ${
                    currentPage === index + 1 ? 'artisans-list__pagination-btn--active' : ''
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                  aria-label={`Page ${index + 1}`}
                  aria-current={currentPage === index + 1 ? 'page' : undefined}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className="artisans-list__pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

export default ArtisansListPage;
