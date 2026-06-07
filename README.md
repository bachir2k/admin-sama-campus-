# SamaCampus — React App

Implémentation React + TypeScript + Vite du prototype SamaCampus.

## Démarrage rapide

```bash
cd sama-campus-app
npm install
npm run dev
```

Puis ouvrez http://localhost:5173

## Structure du projet

```
src/
├── theme/
│   └── palette.ts          # Design tokens (couleurs, polices) — light & dark
├── data/
│   └── mockData.ts         # Données simulées (transactions, étudiants, alertes…)
├── components/
│   ├── ui/
│   │   ├── Icon.tsx         # Icônes SVG inline (50+ icônes)
│   │   ├── Money.tsx        # Formateur monétaire FCFA
│   │   ├── Toggle.tsx       # Switch on/off
│   │   └── QRCode.tsx       # QR code déterministe
│   ├── mobile/
│   │   ├── MobileApp.tsx    # Shell principal (tabs + routing)
│   │   ├── MiniCard.tsx     # Carte étudiante virtuelle
│   │   ├── TxnRow.tsx       # Ligne de transaction
│   │   └── screens/
│   │       ├── HomeScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       ├── PayScreen.tsx
│   │       ├── AccessScreen.tsx
│   │       ├── PresencesScreen.tsx
│   │       └── ProfileScreen.tsx
│   └── admin/
│       ├── AdminDashboard.tsx   # Shell (sidebar + header)
│       ├── shared.tsx           # Panel, FeedRow, Bars, Donut, StatusPill…
│       └── views/
│           ├── Overview.tsx     # KPIs + graphiques
│           ├── Fraud.tsx        # Alertes fraude IA
│           ├── Students.tsx     # Gestion étudiants
│           ├── Transactions.tsx # Flux de transactions
│           ├── AccessView.tsx   # Occupation des zones
│           └── Stats.tsx        # Statistiques 6 semaines
└── App.tsx                  # Entrée — nav entre les 3 vues
```

## Surfaces disponibles

| Vue | Description |
|-----|-------------|
| App Crème | App mobile — thème clair (6 écrans navigables) |
| App Nuit  | App mobile — thème sombre/or (6 écrans navigables) |
| Dashboard admin | Dashboard web avec sidebar (6 sections) |

## Prochaines étapes suggérées

- Ajouter React Router pour des URLs dédiées par vue
- Brancher une vraie API (remplacer mockData.ts)
- Ajouter le Terminal (3ème surface du prototype)
- Déployer sur Vercel ou Netlify (npm run build)
