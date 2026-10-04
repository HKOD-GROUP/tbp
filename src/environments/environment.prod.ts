export const environment = {
  production: true,
  siteUrl: 'https://tbp.fr',
  // TODO: e-mail et mot de passe du compte admin unique, créé à la main dans la
  // console Firebase Authentication (même valeurs des deux côtés).
  adminEmail: 'teambaraia.publishing@gmail.com',
  adminPassword: 'admin1234',
  useEmulators: false,
  emulators: {
    authPort: 9099,
    firestorePort: 8085,
    storagePort: 9199,
  },
  firebase: {
    // TODO: configuration du projet Firebase de production, depuis la console Firebase.
    apiKey: 'A_REMPLACER',
    authDomain: 'A_REMPLACER.firebaseapp.com',
    projectId: 'A_REMPLACER',
    storageBucket: 'A_REMPLACER.appspot.com',
    messagingSenderId: 'A_REMPLACER',
    appId: 'A_REMPLACER',
  },
};
