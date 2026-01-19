/**
 * Page de détail d'un artisan
 * Affiche les informations complètes et le formulaire de contact
 * @module pages/ArtisanDetailPage
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiExternalLink, FiCheck, FiUser } from 'react-icons/fi';

// Composants
import { StarRating, Loader } from '../components/common';

// Services
import { getArtisanById, sendContactEmail } from '../services/api';

// Styles
import './ArtisanDetailPage.scss';

/**
 * Page de détail d'un artisan
 * @returns {JSX.Element} La page de détail
 */
function ArtisanDetailPage() {
  const { id } = useParams();
  
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    objet: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Chargement de l'artisan
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getArtisanById(id);
        setArtisan(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'artisan:', err);
        setError('Impossible de charger les informations de l\'artisan.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  /**
   * Gère les changements dans le formulaire
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Valide le formulaire
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nom.trim() || formData.nom.trim().length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }
    
    if (!formData.objet.trim() || formData.objet.trim().length < 3) {
      errors.objet = 'L\'objet doit contenir au moins 3 caractères';
    }
    
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      await sendContactEmail({
        artisan_id: artisan.id,
        ...formData
      });
      
      setSubmitSuccess(true);
      setFormData({ nom: '', email: '', objet: '', message: '' });
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setSubmitError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="artisan-detail__loading">
        <Loader message="Chargement de la fiche artisan..." />
      </div>
    );
  }

  // État d'erreur
  if (error || !artisan) {
    return (
      <div className="container">
        <div className="artisan-detail__error">
          <div className="alert alert--error" role="alert">
            {error || 'Artisan non trouvé'}
          </div>
          <Link to="/" className="btn btn--primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Informations de la spécialité et catégorie
  const specialiteName = artisan.specialite?.nom || 'Artisan';
  const categorieName = artisan.specialite?.categorie?.nom || '';
  const categorieSlug = artisan.specialite?.categorie?.slug || '';

  return (
    <>
      <Helmet>
        <title>{artisan.nom} - {specialiteName} - Trouve ton artisan</title>
        <meta 
          name="description" 
          content={`${artisan.nom}, ${specialiteName} à ${artisan.localisation}. ${artisan.a_propos?.substring(0, 150) || 'Contactez cet artisan qualifié en région Auvergne-Rhône-Alpes.'}`} 
        />
      </Helmet>

      <div className="artisan-detail">
        {/* Fil d'Ariane */}
        <nav className="artisan-detail__breadcrumb" aria-label="Fil d'Ariane">
          <div className="container">
            <ol className="artisan-detail__breadcrumb-list">
              <li className="artisan-detail__breadcrumb-item">
                <Link to="/" className="artisan-detail__breadcrumb-link">
                  Accueil
                </Link>
              </li>
              {categorieName && (
                <li className="artisan-detail__breadcrumb-item">
                  <Link 
                    to={`/categorie/${categorieSlug}`} 
                    className="artisan-detail__breadcrumb-link"
                  >
                    {categorieName}
                  </Link>
                </li>
              )}
              <li className="artisan-detail__breadcrumb-item">
                <span className="artisan-detail__breadcrumb-current">
                  {artisan.nom}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <div className="container">
          <div className="artisan-detail__content">
            {/* Section principale */}
            <article className="artisan-detail__main">
              {/* Header */}
              <header className="artisan-detail__header">
                <div className="artisan-detail__image-wrapper">
                  <div className="artisan-detail__placeholder">
                    <FiUser className="artisan-detail__placeholder-icon" aria-hidden="true" />
                    <span className="artisan-detail__placeholder-text">Photo à venir</span>
                  </div>
                </div>
                
                <div className="artisan-detail__info">
                  <h1 className="artisan-detail__name">{artisan.nom}</h1>
                  <p className="artisan-detail__specialty">{specialiteName}</p>
                  
                  <div className="artisan-detail__meta">
                    <div className="artisan-detail__rating">
                      <StarRating rating={parseFloat(artisan.note)} size="lg" />
                      <span className="artisan-detail__rating-score">
                        {parseFloat(artisan.note).toFixed(1)}/5
                      </span>
                    </div>
                    
                    <div className="artisan-detail__location">
                      <FiMapPin aria-hidden="true" />
                      <span>{artisan.localisation}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* À propos */}
              {artisan.a_propos && (
                <section className="artisan-detail__about">
                  <h2 className="artisan-detail__about-title">À propos</h2>
                  <p className="artisan-detail__about-text">{artisan.a_propos}</p>
                </section>
              )}

              {/* Site web */}
              {artisan.site_web && (
                <a
                  href={artisan.site_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artisan-detail__website"
                  aria-label={`Visiter le site web de ${artisan.nom} (nouvelle fenêtre)`}
                >
                  <FiExternalLink aria-hidden="true" />
                  Visiter le site web
                </a>
              )}
            </article>

            {/* Sidebar - Formulaire de contact */}
            <aside className="artisan-detail__sidebar">
              <h2 className="artisan-detail__contact-title">Contacter cet artisan</h2>
              
              {submitSuccess ? (
                <div className="artisan-detail__success" role="status">
                  <FiCheck className="artisan-detail__success-icon" aria-hidden="true" />
                  <h3 className="artisan-detail__success-title">Message envoyé !</h3>
                  <p className="artisan-detail__success-text">
                    L'artisan vous répondra sous 48h.
                  </p>
                </div>
              ) : (
                <form 
                  className="artisan-detail__form" 
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {submitError && (
                    <div className="alert alert--error" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div className="artisan-detail__form-group">
                    <label 
                      htmlFor="nom" 
                      className="artisan-detail__form-label"
                    >
                      Nom <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      className="artisan-detail__form-input"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!!formErrors.nom}
                      aria-describedby={formErrors.nom ? 'nom-error' : undefined}
                    />
                    {formErrors.nom && (
                      <span id="nom-error" className="artisan-detail__form-error" role="alert">
                        {formErrors.nom}
                      </span>
                    )}
                  </div>

                  <div className="artisan-detail__form-group">
                    <label 
                      htmlFor="email" 
                      className="artisan-detail__form-label"
                    >
                      Email <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="artisan-detail__form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!!formErrors.email}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                    />
                    {formErrors.email && (
                      <span id="email-error" className="artisan-detail__form-error" role="alert">
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div className="artisan-detail__form-group">
                    <label 
                      htmlFor="objet" 
                      className="artisan-detail__form-label"
                    >
                      Objet <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="objet"
                      name="objet"
                      className="artisan-detail__form-input"
                      value={formData.objet}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!!formErrors.objet}
                      aria-describedby={formErrors.objet ? 'objet-error' : undefined}
                    />
                    {formErrors.objet && (
                      <span id="objet-error" className="artisan-detail__form-error" role="alert">
                        {formErrors.objet}
                      </span>
                    )}
                  </div>

                  <div className="artisan-detail__form-group">
                    <label 
                      htmlFor="message" 
                      className="artisan-detail__form-label"
                    >
                      Message <span className="required" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="artisan-detail__form-textarea"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      aria-invalid={!!formErrors.message}
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                    />
                    {formErrors.message && (
                      <span id="message-error" className="artisan-detail__form-error" role="alert">
                        {formErrors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="artisan-detail__form-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtisanDetailPage;
