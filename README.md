# Team Baraia Promotion (TBP)

Site vitrine Angular de Team Baraia Promotion. Voir `expression-de-besoin.md` pour le besoin
complet et `CHECKLIST.md` pour le plan de travail.

## Installation

```bash
npm install
```

## Lancer en développement

Dans deux terminaux séparés :

```bash
npm run emulators   # émulateurs Firebase (Auth, Firestore, Storage) sur http://127.0.0.1:4001
npm start           # serveur de développement Angular sur http://localhost:4200
```

## Vérifications

```bash
npm run check   # lint + build + tests
npm run lint
npm test
npm run build
```

## Build et exécution SSR

```bash
npm run build
node dist/tbp/server/server.mjs
```
