# 🏨 Backend Hotel Manager

Backend API complet pour l'application de gestion d'hôtel avec Node.js, Express et MongoDB.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration de l'environnement
Créez un fichier `.env` à la racine du dossier backend :
```env
# Configuration du serveur
PORT=3001
NODE_ENV=development

# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/hotel-manager

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Configuration de sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration CORS
CORS_ORIGIN=http://localhost:5173

# Configuration des logs
LOG_LEVEL=debug
```

### 3. Démarrer MongoDB
Assurez-vous que MongoDB est en cours d'exécution sur votre machine :
```bash
# Sur macOS avec Homebrew
brew services start mongodb-community

# Sur Windows
net start MongoDB

# Sur Linux
sudo systemctl start mongod
```

### 4. Peupler la base de données avec des données de test
```bash
npm run seed
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3001`

## 📋 Fonctionnalités implémentées

### 🔐 Authentification
- ✅ Connexion/Inscription utilisateurs
- ✅ JWT tokens avec expiration
- ✅ Gestion des rôles (admin, manager, staff)
- ✅ Changement de mot de passe
- ✅ Middleware de protection des routes

### 🏨 Gestion des chambres
- ✅ CRUD complet des chambres
- ✅ Types de chambres (simple, double, suite, deluxe, family)
- ✅ Statuts (disponible, occupée, maintenance, réservée, nettoyage)
- ✅ Équipements et fonctionnalités
- ✅ Images des chambres
- ✅ Validation des données

### 📅 Gestion des réservations
- ✅ CRUD complet des réservations
- ✅ Vérification de disponibilité des chambres
- ✅ Gestion des dates d'arrivée/départ
- ✅ Statuts des réservations
- ✅ Informations des clients
- ✅ Demandes spéciales

### 👥 Gestion des utilisateurs
- ✅ CRUD complet des utilisateurs
- ✅ Système de rôles et permissions
- ✅ Profils utilisateurs détaillés
- ✅ Gestion de l'activité des comptes

## 🛠️ Technologies utilisées

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JWT + bcryptjs
- **Sécurité**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Compression**: Compression middleware

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Contrôleur d'authentification
│   │   ├── roomController.js    # Contrôleur des chambres
│   │   ├── reservationController.js # Contrôleur des réservations
│   │   └── userController.js    # Contrôleur des utilisateurs
│   ├── middleware/
│   │   ├── auth.js              # Middleware d'authentification
│   │   └── validation.js        # Middleware de validation
│   ├── models/
│   │   ├── User.js              # Modèle utilisateur
│   │   ├── Room.js              # Modèle chambre
│   │   └── Reservation.js       # Modèle réservation
│   ├── routes/
│   │   ├── auth.js              # Routes d'authentification
│   │   ├── rooms.js             # Routes des chambres
│   │   ├── reservations.js      # Routes des réservations
│   │   └── users.js             # Routes des utilisateurs
│   └── server.js                # Serveur principal
├── scripts/
│   └── seed.js                  # Script de peuplement de la DB
├── package.json
└── README.md
```

## 🔑 Identifiants de test

Après avoir exécuté le script de seeding, vous pouvez vous connecter avec :

- **Admin**: `admin@hotel.com` / `password123`
- **Manager**: `manager@hotel.com` / `password123`
- **Staff**: `staff@hotel.com` / `password123`

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion
- `PUT /api/auth/change-password` - Changer le mot de passe

### Chambres
- `GET /api/rooms` - Liste des chambres
- `GET /api/rooms/:id` - Détails d'une chambre
- `POST /api/rooms` - Créer une chambre
- `PUT /api/rooms/:id` - Modifier une chambre
- `DELETE /api/rooms/:id` - Supprimer une chambre

### Réservations
- `GET /api/reservations` - Liste des réservations
- `GET /api/reservations/:id` - Détails d'une réservation
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Supprimer une réservation

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 🚀 Scripts disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement avec nodemon
npm run seed       # Peupler la base de données
```

## 🔧 Configuration avancée

### Variables d'environnement
- `PORT`: Port du serveur (défaut: 3001)
- `NODE_ENV`: Environnement (development/production)
- `MONGODB_URI`: URI de connexion MongoDB
- `JWT_SECRET`: Clé secrète pour JWT
- `JWT_EXPIRES_IN`: Expiration des tokens JWT
- `BCRYPT_ROUNDS`: Nombre de rounds pour le hachage des mots de passe
- `RATE_LIMIT_WINDOW_MS`: Fenêtre de limitation des requêtes
- `RATE_LIMIT_MAX_REQUESTS`: Nombre maximum de requêtes par fenêtre
- `CORS_ORIGIN`: Origine autorisée pour CORS

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI de connexion dans le fichier `.env`
- Vérifiez que le port 27017 est accessible

### Erreur de port déjà utilisé
- Changez le port dans le fichier `.env`
- Ou arrêtez le processus qui utilise le port 3001

### Erreur de validation
- Vérifiez que tous les champs requis sont fournis
- Vérifiez le format des données (email, téléphone, etc.)

## 📝 Prochaines étapes

- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Implémenter la gestion des images (upload/stockage)
- [ ] Ajouter des notifications en temps réel
- [ ] Implémenter un système de logs avancé
- [ ] Ajouter la documentation API avec Swagger
- [ ] Implémenter la gestion des paiements
- [ ] Ajouter des rapports et statistiques avancés

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
