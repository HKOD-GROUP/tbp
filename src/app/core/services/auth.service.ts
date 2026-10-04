import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, type User, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  // null = pas encore déterminé (SSR / premier rendu), undefined n'existe pas ici :
  // on distingue "chargement" de "déconnecté" avec un signal à trois états.
  readonly user = toSignal(authState(this.auth), { initialValue: undefined });

  // Accès admin simplifié : un seul mot de passe (environment.adminPassword),
  // comparé ici puis utilisé pour établir une vraie session Firebase Auth en
  // coulisses — les règles de sécurité Firestore/Storage continuent de
  // vérifier un compte authentifié réel, seule l'UI de connexion est simplifiée.
  signInAsAdmin(password: string): Promise<User> {
    if (password !== environment.adminPassword) {
      return Promise.reject(new Error('wrong-password'));
    }
    return signInWithEmailAndPassword(this.auth, environment.adminEmail, password).then(
      (cred) => cred.user,
    );
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
