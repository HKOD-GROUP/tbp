import type { ExperimentalPendingTasks } from '@angular/core';
import { type Observable, catchError, of, tap, timeout } from 'rxjs';

// Firestore ne passe pas par HttpClient : Angular ne sait pas que la requête
// est en cours et peut sérialiser le HTML du SSR/prérendu avant qu'elle
// n'aboutisse (page statique sans contenu dynamique). On bloque manuellement
// la stabilité de l'application jusqu'à la première émission (ou erreur), avec
// un délai de sécurité pour ne jamais bloquer indéfiniment le rendu serveur
// (projet Firebase injoignable, règles refusant la lecture, etc.).
export function trackFirstEmission<T>(
  source: Observable<T[]>,
  pendingTasks: ExperimentalPendingTasks,
): Observable<T[]> {
  const done = pendingTasks.add();
  let settled = false;
  const finish = () => {
    if (!settled) {
      settled = true;
      done();
    }
  };
  return source.pipe(
    timeout({ first: 8000 }),
    catchError(() => of([] as T[])),
    tap({ next: finish, error: finish }),
  );
}
