import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { type CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

// Guard UX uniquement (EDB 8) : la vraie protection des données vient des
// règles de sécurité Firestore/Storage, pas de ce guard de navigation.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/admin/connexion']))),
  );
};
