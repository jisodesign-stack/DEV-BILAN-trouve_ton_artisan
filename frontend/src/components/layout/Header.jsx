/**
 * Header du site avec navigation dynamique et recherche
 * Menu responsive avec support mobile et accessibilité WCAG
 * 
 * @module components/layout/Header
 */

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';
import './Header.scss';

function Header({ categories = [], loading = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  /** Soumet la recherche (min. 2 caractères) */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Retour à l'accueil">
          <img 
            src="/images/logo.png" 
            alt="" 
            className="header__logo-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="header__logo-text">
            <span className="header__logo-text-title">Trouve ton artisan !</span>
            <span className="header__logo-text-subtitle">Avec la région Auvergne-Rhône-Alpes</span>
          </div>
        </Link>

        <nav className="header__nav" aria-label="Navigation principale">
          <ul className="header__nav-list">
            {loading ? (
              <li className="header__nav-item">
                <span className="header__nav-link">Chargement...</span>
              </li>
            ) : (
              categories.map((category) => (
                <li key={category.id} className="header__nav-item">
                  <NavLink
                    to={`/categorie/${category.slug}`}
                    className={({ isActive }) =>
                      `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                    }
                  >
                    {category.nom}
                  </NavLink>
                </li>
              ))
            )}
          </ul>
        </nav>

        <div className="header__search">
          <form 
            className="header__search-form" 
            onSubmit={handleSearch}
            role="search"
            aria-label="Rechercher un artisan"
          >
            <label htmlFor="search-input" className="visually-hidden">
              Rechercher un artisan par nom
            </label>
            <input
              id="search-input"
              type="search"
              className="header__search-input"
              placeholder="Rechercher un artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="search-help"
            />
            <span id="search-help" className="visually-hidden">
              Entrez au moins 2 caractères pour lancer la recherche
            </span>
            <button
              type="submit"
              className="header__search-button"
              aria-label="Lancer la recherche"
            >
              <FiSearch aria-hidden="true" />
            </button>
          </form>
        </div>

        <button
          className="header__mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? (
            <FiX aria-hidden="true" />
          ) : (
            <FiMenu aria-hidden="true" />
          )}
        </button>

        <nav
          id="mobile-nav"
          className={`header__mobile-nav ${mobileMenuOpen ? 'header__mobile-nav--open' : ''}`}
          aria-label="Navigation mobile"
        >
          <ul className="header__mobile-nav-list">
            {categories.map((category) => (
              <li key={category.id}>
                <NavLink
                  to={`/categorie/${category.slug}`}
                  className={({ isActive }) =>
                    `header__mobile-nav-link ${isActive ? 'header__mobile-nav-link--active' : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  {category.nom}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    })
  ),
  loading: PropTypes.bool
};

export default Header;
