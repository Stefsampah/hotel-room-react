# 🏨 Hotel Manager - Application de Gestion Hôtelière

> **Application full-stack moderne** pour la gestion complète d'un hôtel avec interface immersive et fonctionnalités avancées.

![Hotel Manager](https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop&crop=center)

## ✨ Fonctionnalités

- 🏠 **Gestion des chambres** - CRUD complet avec images et statuts
- 📅 **Gestion des réservations** - Système de réservation avancé
- 👥 **Gestion des utilisateurs** - Authentification JWT avec rôles
- 📊 **Dashboard interactif** - Statistiques en temps réel
- 🎨 **Interface immersive** - Design moderne avec Tailwind CSS
- 📱 **Responsive design** - Optimisé mobile et desktop
- 🔐 **Sécurité** - Authentification et autorisation robustes

## 🚀 Technologies

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** + **Vite**
- **React Router** + **Context API**
- **Lucide React** (icônes)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt**
- **Validation** + **Middleware**

## 🎯 Démo

**Identifiants de test :**
- **Admin** : `admin@hotel.com` / `password123`
- **Manager** : `manager@hotel.com` / `password123`
- **Staff** : `staff@hotel.com` / `password123`

## 📱 Captures d'écran

<details>
<summary>🖼️ Voir les captures d'écran</summary>

### Dashboard Principal
![Dashboard](images/dashboard.jpg)

### Gestion des Chambres
![Gestion des Chambres](images/chambres.jpg)

### Interface de Réservation
![Interface de Réservation](images/reservations.jpg)

</details>

## 🛠️ Installation

### Prérequis
- Node.js 18+
- MongoDB Atlas (ou local)
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurez vos variables d'environnement
npm run seed          # Créez des données de test
npm run dev           # Lancez le serveur (port 3001)
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # Lancez l'application (port 5173)
```

## 📁 Structure du Projet

```
hotel-room-react/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React
│   │   ├── services/      # Services API
│   │   └── types/         # Types TypeScript
│   └── public/            # Assets statiques
├── backend/           # Serveur Node.js
│   ├── src/
│   │   ├── controllers/   # Contrôleurs API
│   │   ├── models/        # Modèles Mongoose
│   │   ├── routes/        # Routes API
│   │   └── middleware/    # Middleware Express
│   └── scripts/           # Scripts utilitaires
└── docs/              # Documentation
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/me` - Profil utilisateur actuel

### Chambres
- `GET /api/rooms` - Liste des chambres
- `POST /api/rooms` - Créer une chambre
- `PUT /api/rooms/:id` - Modifier une chambre
- `DELETE /api/rooms/:id` - Supprimer une chambre

### Réservations
- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Supprimer une réservation

## 🎨 Design System

- **Couleurs** : Palette personnalisée `hotel-*`
- **Typographie** : Inter (Google Fonts)
- **Composants** : Design system cohérent
- **Animations** : Transitions fluides et micro-interactions

## 🚀 Déploiement

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Railway/Heroku (Backend)
```bash
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Stephane Sampah**
- GitHub: [@Stefsampah](https://github.com/Stefsampah)
- Portfolio: [Votre portfolio]

## 🙏 Remerciements

- **Le Wagon** pour la formation
- **Unsplash** pour les images
- **Tailwind CSS** pour le framework CSS
- **MongoDB** pour la base de données

---

⭐ **Si ce projet vous plaît, n'oubliez pas de le star !**
