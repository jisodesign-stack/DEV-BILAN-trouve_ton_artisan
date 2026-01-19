# 🔧 Trouve ton artisan - Auvergne-Rhône-Alpes

Plateforme web permettant aux particuliers de trouver et contacter des artisans qualifiés en région Auvergne-Rhône-Alpes.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Sécurité](#-sécurité)
- [API Documentation](#-api-documentation)
- [Déploiement](#-déploiement)

## 🎯 Présentation

Ce projet a été développé pour la région Auvergne-Rhône-Alpes dans le cadre d'une mission de création d'une plateforme dédiée aux artisans de la région.

**Objectifs :**
- Permettre aux particuliers de rechercher un artisan par catégorie ou par nom
- Consulter une fiche artisan détaillée avec note, spécialité et localisation
- Contacter l'artisan via un formulaire sécurisé

## ✨ Fonctionnalités

### Frontend
- ✅ Page d'accueil avec présentation du service
- ✅ Section "Comment trouver mon artisan ?" (4 étapes)
- ✅ Affichage des 3 artisans du mois
- ✅ Navigation par catégories (Bâtiment, Services, Fabrication, Alimentation)
- ✅ Recherche d'artisans par nom
- ✅ Fiches artisans détaillées avec notation par étoiles
- ✅ Formulaire de contact fonctionnel
- ✅ Page 404 personnalisée
- ✅ Design responsive (Mobile First)
- ✅ Accessibilité WCAG 2.1

### Backend
- ✅ API REST sécurisée
- ✅ Gestion des artisans, catégories et spécialités
- ✅ Envoi d'emails via Nodemailer
- ✅ Validation des entrées
- ✅ Protection contre les attaques (XSS, injections SQL, CORS)

## 🛠 Technologies

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React.js | 18.2 | Bibliothèque JavaScript UI |
| React Router | 6.x | Routage côté client |
| Bootstrap | 5.3 | Framework CSS |
| Sass | 1.69 | Préprocesseur CSS |
| Axios | 1.6 | Client HTTP |
| React Helmet Async | 2.0 | Gestion SEO |

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18 | Framework web |
| Sequelize | 6.35 | ORM pour MySQL |
| MySQL | 8.0 | Base de données |
| Nodemailer | 6.9 | Envoi d'emails |
| Helmet | 7.1 | Sécurité HTTP headers |

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** (inclus avec Node.js) ou **yarn**
- **MySQL** (version 8.0) ou **MariaDB** (version 10.6+) - [Télécharger MySQL](https://dev.mysql.com/downloads/)
- **Git** - [Télécharger](https://git-scm.com/)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/trouve-ton-artisan.git
cd trouve-ton-artisan
```

### 2. Installer les dépendances du backend

```bash
cd backend
npm install
```

### 3. Installer les dépendances du frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend

1. Copier le fichier d'exemple de configuration :

```bash
cd backend
cp .env.example .env
```

2. Modifier le fichier `.env` avec vos paramètres :

```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration de la base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=trouve_ton_artisan
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

# Configuration CORS
FRONTEND_URL=http://localhost:3000

# Configuration Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app
EMAIL_FROM=noreply@trouve-ton-artisan.fr

# Clé API
API_KEY=votre_cle_api_secrete
```

### Frontend

1. Copier le fichier d'exemple :

```bash
cd frontend
cp .env.example .env
```

2. Modifier le fichier `.env` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_KEY=votre_cle_api_secrete
REACT_APP_SITE_NAME=Trouve ton artisan
REACT_APP_REGION=Auvergne-Rhône-Alpes
```

### Base de données

1. Créer la base de données MySQL :

```bash
cd backend
npm run db:create
```

Ou manuellement avec les scripts SQL :

```bash
mysql -u root -p < scripts/sql/create_database.sql
mysql -u root -p < scripts/sql/seed_database.sql
```

2. Remplir la base avec les données de test :

```bash
npm run db:seed
```

## ▶️ Lancement

### Mode développement

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```
L'API sera accessible sur `http://localhost:5000`

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```
L'application sera accessible sur `http://localhost:3000`

### Mode production

**Backend :**
```bash
cd backend
npm start
```

**Frontend :**
```bash
cd frontend
npm run build
```
Le dossier `build/` contient les fichiers statiques à déployer.

## 📁 Structure du projet

```
trouve-ton-artisan/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration Sequelize
│   ├── controllers/
│   │   ├── artisanController.js
│   │   ├── categorieController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── apiKeyAuth.js        # Authentification API
│   │   └── validateRequest.js   # Validation des entrées
│   ├── models/
│   │   ├── Artisan.js
│   │   ├── Categorie.js
│   │   ├── Specialite.js
│   │   └── index.js             # Associations
│   ├── routes/
│   │   ├── artisanRoutes.js
│   │   ├── categorieRoutes.js
│   │   └── contactRoutes.js
│   ├── scripts/
│   │   ├── sql/
│   │   │   ├── create_database.sql
│   │   │   └── seed_database.sql
│   │   ├── createDatabase.js
│   │   └── seedDatabase.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Point d'entrée
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Composants réutilisables
│   │   │   │   ├── ArtisanCard.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── StarRating.jsx
│   │   │   └── layout/          # Header, Footer
│   │   │       ├── Header.jsx
│   │   │       └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ArtisansListPage.jsx
│   │   │   ├── ArtisanDetailPage.jsx
│   │   │   ├── LegalPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Client API Axios
│   │   ├── styles/
│   │   │   ├── _variables.scss  # Variables SCSS
│   │   │   ├── _mixins.scss     # Mixins SCSS
│   │   │   └── global.scss      # Styles globaux
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🗄 Base de données

### Modèle Conceptuel de Données (MCD)

```
CATEGORIE ||--o{ SPECIALITE : contient
SPECIALITE ||--o{ ARTISAN : emploie

CATEGORIE (id, nom, slug)
SPECIALITE (id, nom, #categorie_id)
ARTISAN (id, nom, email, note, localisation, a_propos, site_web, image, top_artisan, #specialite_id)
```

### Contraintes métier
- Un artisan appartient à **une seule** spécialité
- Une spécialité appartient à **une seule** catégorie
- La note est comprise entre 0 et 5

## 🔐 Sécurité

### Mesures implémentées

| Mesure | Implémentation | Intérêt |
|--------|----------------|---------|
| **Validation des entrées** | express-validator | Prévient les injections et données malformées |
| **Protection XSS** | Bibliothèque xss + Helmet | Empêche l'exécution de scripts malveillants |
| **Protection SQL Injection** | Sequelize (requêtes paramétrées) | Empêche la manipulation de la BDD |
| **CORS** | Configuration stricte | Limite les origines autorisées |
| **Rate Limiting** | express-rate-limit | Protège contre les attaques DDoS |
| **Headers HTTP** | Helmet | Sécurise les en-têtes HTTP |
| **Clé API** | Middleware personnalisé | Restreint l'accès à l'API |
| **Variables d'environnement** | dotenv | Protège les informations sensibles |

## 📡 API Documentation

### Endpoints

#### Catégories

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste toutes les catégories |
| GET | `/api/categories/:slug` | Détail d'une catégorie |
| GET | `/api/categories/:slug/artisans` | Artisans d'une catégorie |

#### Artisans

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/artisans` | Liste paginée des artisans |
| GET | `/api/artisans/:id` | Détail d'un artisan |
| GET | `/api/artisans/top` | Top 3 artisans du mois |
| GET | `/api/artisans/search?q=` | Recherche par nom |

#### Contact

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/contact` | Envoyer un email à un artisan |

### Authentification

Toutes les requêtes API nécessitent l'en-tête :
```
x-api-key: votre_cle_api
```

## 🌐 Déploiement

### Frontend (Netlify, Vercel, etc.)

1. Build de production :
```bash
cd frontend
npm run build
```

2. Déployer le dossier `build/`

### Backend (Heroku, Railway, etc.)

1. Configurer les variables d'environnement
2. Déployer le dossier `backend/`
3. Exécuter les migrations de base de données

## 👨‍💻 Auteur

Développé dans le cadre du titre professionnel Développeur Web.

## 📄 Licence

Ce projet est sous licence ISC.

---

**Région Auvergne-Rhône-Alpes** © 2024 - Tous droits réservés
