import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/** Bloque l'accès en production (ex. `/_styleguide`, outil de développement uniquement). */
export const devOnlyGuard: CanActivateFn = () => {
  if (!environment.production) return true;
  return inject(Router).createUrlTree(['/']);
};
