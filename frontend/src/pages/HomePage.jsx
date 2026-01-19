/**
 * Page d'accueil
 * Présentation du service et des artisans du mois
 * @module pages/HomePage
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiSettings, FiBox, FiShoppingBag } from 'react-icons/fi';

// Composants
import { ArtisanCard, Loader } from '../components/common';

// Services
import { getTopArtisans, getCategories } from '../services/api';

// Styles
import './HomePage.scss';

/**
 * Icônes des catégories
 */
const categoryIcons = {
  batiment: FiHome,
  services: FiSettings,
  fabrication: FiBox,
  alimentation: FiShoppingBag
};

/**
 * Étapes pour trouver un artisan
 */
const steps = [
  {
    number: 1,
    title: 'Choisir une catégorie',
    description: 'Sélectionnez une catégorie d\'artisanat dans le menu.'
  },
  {
    number: 2,
    title: 'Choisir un artisan',
    description: 'Parcourez la liste et trouvez l\'artisan qui vous convient.'
  },
  {
    number: 3,
    title: 'Le contacter',
    description: 'Utilisez le formulaire de contact pour envoyer votre demande.'
  },
  {
    number: 4,
    title: 'Recevoir une réponse',
    description: 'L\'artisan vous répondra sous 48h.'
  }
];

/**
 * Page d'accueil du site
 * @returns {JSX.Element} La page d'accueil
 */
function HomePage() {
  const [topArtisans, setTopArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artisansResponse, categoriesResponse] = await Promise.all([
          getTopArtisans(),
          getCategories()
        ]);
        setTopArtisans(artisansResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Trouve ton artisan - Auvergne-Rhône-Alpes</title>
        <meta 
          name="description" 
          content="Trouvez facilement un artisan qualifié en région Auvergne-Rhône-Alpes. Bâtiment, services, fabrication, alimentation : des professionnels près de chez vous." 
        />
      </Helmet>

      <div className="home">
        {/* Hero Section */}
        <section className="home__hero" aria-labelledby="hero-title">
          <div className="container">
            <h1 id="hero-title" className="home__hero-title">
              Trouve ton artisan !
            </h1>
            <p className="home__hero-subtitle">
              Trouvez facilement un artisan qualifié en région Auvergne-Rhône-Alpes. 
              Bâtiment, services, fabrication, alimentation : des professionnels près de chez vous.
            </p>
          </div>
        </section>

        {/* Section Comment ça marche */}
        <section className="home__steps" aria-labelledby="steps-title">
          <div className="container">
            <h2 id="steps-title" className="home__steps-title">
              Comment trouver mon artisan ?
            </h2>
            <div className="home__steps-grid">
              {steps.map((step) => (
                <div key={step.number} className="home__step">
                  <div className="home__step-number" aria-hidden="true">
                    {step.number}
                  </div>
                  <h3 className="home__step-title">{step.title}</h3>
                  <p className="home__step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Top Artisans du mois */}
        <section className="home__top-artisans" aria-labelledby="top-artisans-title">
          <div className="container">
            <h2 id="top-artisans-title" className="home__top-artisans-title">
              Les 3 artisans du mois
            </h2>
            
            {loading ? (
              <Loader message="Chargement des artisans du mois..." />
            ) : error ? (
              <div className="alert alert--error" role="alert">
                {error}
              </div>
            ) : topArtisans.length > 0 ? (
              <div className="home__top-artisans-grid">
                {topArtisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>
            ) : (
              <p className="home__top-artisans-empty">
                Aucun artisan du mois pour le moment.
              </p>
            )}
          </div>
        </section>

        {/* Section Catégories */}
        <section className="home__categories" aria-labelledby="categories-title">
          <div className="container">
            <h2 id="categories-title" className="home__categories-title">
              Nos catégories
            </h2>
            
            {loading ? (
              <Loader message="Chargement des catégories..." />
            ) : (
              <div className="home__categories-grid">
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.slug] || FiBox;
                  const artisansCount = category.specialites?.reduce(
                    (acc, spec) => acc + (spec.artisans?.length || 0), 
                    0
                  ) || 0;

                  return (
                    <Link
                      key={category.id}
                      to={`/categorie/${category.slug}`}
                      className="home__category-card"
                      aria-label={`Voir les artisans de la catégorie ${category.nom}`}
                    >
                      <IconComponent className="home__category-icon" aria-hidden="true" />
                      <h3 className="home__category-name">{category.nom}</h3>
                      {artisansCount > 0 && (
                        <span className="home__category-count">
                          {artisansCount} artisan{artisansCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
