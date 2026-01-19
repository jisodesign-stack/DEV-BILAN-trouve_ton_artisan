/**
 * Page légale (mentions, données, accessibilité, cookies)
 * @module pages/LegalPage
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTool } from 'react-icons/fi';
import PropTypes from 'prop-types';

// Styles
import './LegalPage.scss';

/**
 * Titres des pages légales
 */
const pageTitles = {
  mentions: 'Mentions légales',
  donnees: 'Données personnelles',
  accessibilite: 'Accessibilité',
  cookies: 'Gestion des cookies'
};

/**
 * Page légale (placeholder - à compléter par un cabinet spécialisé)
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type de page légale
 * @returns {JSX.Element} La page légale
 */
function LegalPage({ type }) {
  const title = pageTitles[type] || 'Informations légales';

  return (
    <>
      <Helmet>
        <title>{title} - Trouve ton artisan</title>
        <meta 
          name="description" 
          content={`${title} du site Trouve ton artisan - Région Auvergne-Rhône-Alpes.`} 
        />
      </Helmet>

      <div className="legal-page">
        {/* Header */}
        <header className="legal-page__header">
          <div className="container">
            <h1 className="legal-page__title">{title}</h1>
          </div>
        </header>

        {/* Contenu */}
        <div className="container">
          <article className="legal-page__content">
            <div className="legal-page__construction">
              <FiTool className="legal-page__construction-icon" aria-hidden="true" />
              <h2 className="legal-page__construction-title">Page en construction</h2>
              <p className="legal-page__construction-text">
                Cette page sera remplie ultérieurement par un cabinet spécialisé.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

LegalPage.propTypes = {
  type: PropTypes.oneOf(['mentions', 'donnees', 'accessibilite', 'cookies']).isRequired
};

export default LegalPage;
