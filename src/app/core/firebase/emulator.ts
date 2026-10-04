// Au prérendu, plusieurs routes peuvent partager le même worker Node et donc
// le même registre Firebase interne : la 2e route qui tente de se connecter à
// l'émulateur sur une instance déjà utilisée par la 1re route échoue avec
// « has already been started »/« already configured ». Sans effet pratique
// (l'instance réutilisée pointe déjà vers l'émulateur), on avale l'erreur.
export function connectEmulatorOnce(connect: () => void): void {
  try {
    connect();
  } catch {
    // Émulateur déjà connecté sur cette instance réutilisée — rien à faire.
  }
}
