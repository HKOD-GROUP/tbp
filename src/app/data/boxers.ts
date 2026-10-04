export interface BoxerRecord {
  wins: number;
  losses: number;
  draws: number;
}

export interface BoxerTimelineEntry {
  period: string;
  description: string;
}

export interface Boxer {
  slug: string;
  firstName: string;
  fullName: string;
  nickname: string;
  category: string;
  record: BoxerRecord;
  /** Âge en années ; EDB : à calculer depuis la date de naissance si elle est fournie un jour. */
  age: number;
  heightMeters: number;
  club: string;
  achievements: string[];
  instagramHandle: string;
  instagramUrl: string;
  timeline: BoxerTimelineEntry[];
  images: {
    /** Détouré (fond transparent) : section « Notre combattant » de l'accueil. */
    cutout1: string;
    /** Détouré (fond transparent) : fiche boxeur, carte du roster, fondateurs. */
    cutout2: string;
    /** Chadi touche son adversaire : section « Fight night », bande « En action ». */
    action: string;
    /** Victoire, bras levé par l'arbitre : mosaïques « Dans le ring », news. */
    victory: string;
    /** Chadi dans le ring : galerie, news. */
    ring: string;
  };
}

// Roster des boxeurs (EDB 6) : fichier de données, pas l'admin. Un seul boxeur pour l'instant.
export const BOXERS: Boxer[] = [
  {
    slug: 'chadi-baraia',
    firstName: 'Chadi',
    fullName: 'Chadi Baraia',
    nickname: 'The Little Pharaoh',
    category: 'Super-welters',
    record: { wins: 7, losses: 0, draws: 1 },
    age: 24,
    heightMeters: 1.9,
    club: 'Noble Art Boxing Association',
    achievements: [
      'Double champion de France de boxe amateur',
      "Membre de l'équipe de France de 2017 à 2025",
    ],
    instagramHandle: '@chadi_baraia',
    instagramUrl: 'https://www.instagram.com/chadi_baraia',
    timeline: [
      { period: 'Enfance', description: "Premiers gants à l'âge de 5 ans." },
      { period: 'Amateur', description: 'Double champion de France de boxe amateur.' },
      { period: '2017 – 2025', description: "Membre de l'équipe de France." },
      {
        period: "Aujourd'hui",
        description: 'Professionnel invaincu : 7 victoires, 1 nul.',
      },
    ],
    images: {
      cutout1: 'assets/images/chadi-cut-1.webp',
      cutout2: 'assets/images/chadi-cut-2.webp',
      action: 'assets/images/chadi-jab.webp',
      victory: 'assets/images/chadi-victoire.webp',
      ring: 'assets/images/chadi-ring.webp',
    },
  },
];

export function findBoxerBySlug(slug: string): Boxer | undefined {
  return BOXERS.find((boxer) => boxer.slug === slug);
}
