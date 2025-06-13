# MyApp – Calculateur d’émissions CO₂

Une application Vue 3 (Vite) pour :
- **S’authentifier** via Google ou Microsoft
- **Estimer** les émissions CO₂ de ressources cloud (CPU, RAM, stockage, énergie)
- **Calculer** les émissions de vols (origine, destination, passagers, classe)
- **Consulter** un historique de ses consommations (Google uniquement)

---

## Installation

1. **Cloner le dépôt**
  ```bash
   git clone https://…/myapp.git
   cd myapp

   npm install
   npm run dev
  ```



## Structure du projet

```bash
src/
├─ api/
├─ components/      # AuthButtons, BaseButton, Dashboard…
├─ composables/
├─ firebase.js      # init Firebase Auth + Firestore
├─ msal.js          # config MSAL (Azure AD)
├─ stores/          # Pinia store utilisateur (uid, provider…)
├─ views/           # Home, CloudPage, FlightsPage…
└─ router/          # Vue-Router
```

## Fonctionnalités clés

### Authentification

- Google via Firebase Auth (popup)
- Microsoft via MSAL → signInWithCredential


### Estimations cloud

### Appels API Climatiq

### Visualisation instantanée et sauvegarde dans Firestore

### Estimations vols
- Sélection d’aéroports sur carte
- Paramètres passagers & classe
- Sauvegarde dans Firestore sous type: "flight"

### Historique


