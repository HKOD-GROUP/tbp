import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  type Firestore,
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  provideFirestore,
} from '@angular/fire/firestore/lite';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { provideQuillConfig } from 'ngx-quill/config';

import { environment } from '../environments/environment';
import { connectEmulatorOnce } from './core/firebase/emulator';
import { routes } from './app.routes';

// Lecture publique en Firestore "lite" (fetch ponctuel, sans moteur temps réel
// ni cache hors-ligne) : les données (galas, news, boutique) ne changent jamais
// pendant qu'un visiteur a la page ouverte, un live listener n'apporte donc
// aucune valeur, et ça réduit le bundle initial (616 Ko contre 1.11 Mo avec le
// SDK complet). Auth et Storage servent uniquement à l'espace admin (phase 8),
// mais doivent rester globaux : des providers scopés à la sous-arborescence
// /admin ne sont pas résolus correctement par le prérendu statique d'Angular
// (NullInjectorError), qui ne reconstitue pas entièrement la hiérarchie
// d'injecteurs par route du routeur à l'exécution.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(),
    provideQuillConfig({
      modules: {
        syntax: false,
      },
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const app = inject(FirebaseApp);
      // ignoreUndefinedProperties : les formulaires admin envoient `undefined`
      // pour les champs optionnels vides (adresse, billetterie…), que
      // Firestore refuse par défaut (addDoc()/updateDoc() lèvent une erreur).
      // initializeFirestore() ne peut être appelé qu'une fois par app ; au
      // prérendu, plusieurs routes peuvent partager le même worker Node et
      // donc la même instance Firebase déjà initialisée par une route
      // précédente — on retombe alors sur l'instance existante.
      let firestore: Firestore;
      try {
        firestore = initializeFirestore(app, { ignoreUndefinedProperties: true });
      } catch {
        firestore = getFirestore(app);
      }
      if (environment.useEmulators) {
        connectEmulatorOnce(() =>
          connectFirestoreEmulator(firestore, 'localhost', environment.emulators.firestorePort),
        );
      }
      return firestore;
    }),
    provideAuth(() => {
      const app = inject(FirebaseApp);
      const auth = getAuth(app);
      if (environment.useEmulators) {
        connectEmulatorOnce(() =>
          connectAuthEmulator(auth, `http://localhost:${environment.emulators.authPort}`, {
            disableWarnings: true,
          }),
        );
      }
      return auth;
    }),
    provideStorage(() => {
      const app = inject(FirebaseApp);
      const storage = getStorage(app);
      if (environment.useEmulators) {
        connectEmulatorOnce(() =>
          connectStorageEmulator(storage, 'localhost', environment.emulators.storagePort),
        );
      }
      return storage;
    }),
  ],
};
