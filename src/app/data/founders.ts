export interface Founder {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// EDB section 2 : tableau des fondateurs.
export const FOUNDERS: Founder[] = [
  {
    name: 'Chadi Baraia',
    role: 'Fondateur, boxeur professionnel',
    bio: 'Boxeur professionnel invaincu, boxe depuis l’âge de 5 ans.',
    image: 'assets/images/chadi-cut-2.webp',
  },
  {
    name: 'Rami Baraia',
    role: 'Cofondateur, arbitre professionnel et manager',
    bio: 'Ancien boxeur.',
    // En attendant la vraie photo de Rami (EDB 11), image de substitution sombre.
    image: 'assets/placeholders/rami-placeholder.png',
  },
];
