export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  // TODO: e-mail et mot de passe du compte admin unique, créé à la main dans la
  // console Firebase Authentication (même valeurs des deux côtés). Accès
  // simplifié à la demande du client : un seul mot de passe, codé en dur, sans
  // champ e-mail ni « mot de passe oublié » (voir CHECKLIST.md, phase 8).
  adminEmail: 'teambaraia.publishing@gmail.com',
  adminPassword: 'admin1234',
  useEmulators: true,
  emulators: {
    authPort: 9099,
    firestorePort: 8085,
    storagePort: 9199,
  },
  firebase: {
    // TODO: configuration du projet Firebase fournie par le client (ou créé pour lui).
    // Les valeurs ci-dessous suffisent pour les émulateurs ; projectId doit correspondre
    // à celui déclaré dans .firebaserc.
    apiKey: 'demo-api-key',
    authDomain: 'tbp-demo.firebaseapp.com',
    projectId: 'tbp-demo',
    storageBucket: 'tbp-demo.appspot.com',
    messagingSenderId: '0',
    appId: '0:0:web:0',
  },
};
