/**
 * Page 404 - Page non trouvée
 * @module pages/NotFoundPage
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

// Styles
import './NotFoundPage.scss';

/**
 * Page 404
 * @returns {JSX.Element} La page 404
 */
function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page non trouvée - Trouve ton artisan</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="not-found" role="main">
        <FiAlertCircle className="not-found__icon" aria-hidden="true" />
        
        <p className="not-found__code" aria-hidden="true">404</p>
        
        <h1 className="not-found__title">Page non trouvée</h1>
        
        <p className="not-found__text">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée. 
          Retournez à l'accueil pour trouver votre artisan.
        </p>
        
        <Link to="/" className="not-found__link">
          <FiHome aria-hidden="true" />
          Retour à l'accueil
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
