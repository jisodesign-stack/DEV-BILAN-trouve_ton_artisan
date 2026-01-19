/**
 * Contrôleur pour la gestion des contacts (envoi d'emails)
 * @module controllers/contactController
 */

const nodemailer = require('nodemailer');
const { Artisan } = require('../models');
const xss = require('xss');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Envoie un email de contact à un artisan
 * @route POST /api/contact
 */
exports.sendContactEmail = async (req, res) => {
  try {
    // Récupération et nettoyage des données
    const artisanId = parseInt(req.body.artisan_id);
    const nom = xss(req.body.nom?.trim() || '');
    const email = xss(req.body.email?.trim() || '');
    const objet = xss(req.body.objet?.trim() || '');
    const message = xss(req.body.message?.trim() || '');

    // Validation des champs obligatoires
    if (!nom || !email || !objet || !message || isNaN(artisanId)) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'L\'adresse email n\'est pas valide'
      });
    }

    // Vérifier que l'artisan existe
    const artisan = await Artisan.findByPk(artisanId);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan non trouvé'
      });
    }

    // Configuration de l'email
    const mailOptions = {
      from: `"Trouve ton artisan" <${process.env.EMAIL_FROM}>`,
      to: artisan.email,
      replyTo: email,
      subject: `[Trouve ton artisan] ${objet}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0074c7;">Nouveau message via Trouve ton artisan</h2>
          <hr style="border: 1px solid #e0e0e0;">
          <p><strong>De :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Objet :</strong> ${objet}</p>
          <hr style="border: 1px solid #e0e0e0;">
          <h3>Message :</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <hr style="border: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px;">
            Ce message a été envoyé via la plateforme Trouve ton artisan - Région Auvergne-Rhône-Alpes
          </p>
        </div>
      `
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Votre message a été envoyé avec succès. L\'artisan vous répondra sous 48h.'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.'
    });
  }
};
