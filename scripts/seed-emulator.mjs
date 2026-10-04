// Données de démonstration pour l'émulateur Firebase (EDB 6, phase 6).
// Lancer d'abord `npm run emulators` dans un terminal, puis `npm run seed`
// dans un autre. Écrit directement dans l'émulateur Firestore, en
// contournant les règles de sécurité (usage local de développement uniquement).
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

const testEnv = await initializeTestEnvironment({
  projectId: 'tbp-demo',
  firestore: { host: '127.0.0.1', port: 8085 },
});

const now = Date.now();
const DAY = 1000 * 60 * 60 * 24;

await testEnv.withSecurityRulesDisabled(async (context) => {
  const db = context.firestore();

  // Deux événements : un à venir, un passé.
  await setDoc(doc(db, 'events', 'gala-du-peuple-viii'), {
    title: 'Gala du Peuple VIII',
    slug: 'gala-du-peuple-viii',
    date: Timestamp.fromMillis(now + 30 * DAY),
    venue: 'Gymnase municipal',
    city: 'Vigneux-sur-Seine',
    address: '24 rue Maxime Petit, 91270 Vigneux-sur-Seine',
    posterUrl: 'assets/images/ring-face.webp',
    description: '<p>Le Gala du Peuple revient pour sa huitième édition.</p>',
    ticketUrl: '',
    fightCard: [{ red: 'Chadi Baraia', blue: 'À annoncer', category: 'Super-welters' }],
    gallery: [],
    published: true,
    createdAt: Timestamp.fromMillis(now),
    updatedAt: Timestamp.fromMillis(now),
  });

  await setDoc(doc(db, 'events', 'gala-du-peuple-vii'), {
    title: 'Gala du Peuple VII',
    slug: 'gala-du-peuple-vii',
    date: Timestamp.fromMillis(now - 60 * DAY),
    venue: 'Gymnase municipal',
    city: 'Vigneux-sur-Seine',
    address: '24 rue Maxime Petit, 91270 Vigneux-sur-Seine',
    posterUrl: 'assets/images/ring-angle.webp',
    description: '<p>Une soirée mémorable pour les Galas du Peuple.</p>',
    ticketUrl: '',
    fightCard: [{ red: 'Chadi Baraia', blue: 'Adversaire du soir', category: 'Super-welters' }],
    gallery: ['assets/images/ring-coin.webp', 'assets/images/chadi-ring.webp'],
    published: true,
    createdAt: Timestamp.fromMillis(now - 90 * DAY),
    updatedAt: Timestamp.fromMillis(now - 90 * DAY),
  });

  // Trois news, dont un brouillon.
  await setDoc(doc(db, 'news', 'annonce-gala-du-peuple-viii'), {
    title: 'Annonce du Gala du Peuple VIII',
    slug: 'annonce-gala-du-peuple-viii',
    coverUrl: 'assets/images/combat.webp',
    excerpt: 'Le prochain gala aura lieu dans un mois à Vigneux-sur-Seine.',
    content: '<p>Le prochain gala aura lieu dans un mois à Vigneux-sur-Seine.</p>',
    publishedAt: Timestamp.fromMillis(now - 2 * DAY),
    eventId: 'gala-du-peuple-viii',
    published: true,
    createdAt: Timestamp.fromMillis(now - 2 * DAY),
    updatedAt: Timestamp.fromMillis(now - 2 * DAY),
  });

  await setDoc(doc(db, 'news', 'retour-sur-le-gala-du-peuple-vii'), {
    title: 'Retour sur le Gala du Peuple VII',
    slug: 'retour-sur-le-gala-du-peuple-vii',
    coverUrl: 'assets/images/ring-coin.webp',
    excerpt: 'Une soirée mémorable pour les Galas du Peuple.',
    content: '<p>Une soirée mémorable pour les Galas du Peuple, entre émotion et spectacle.</p>',
    publishedAt: Timestamp.fromMillis(now - 58 * DAY),
    eventId: 'gala-du-peuple-vii',
    published: true,
    createdAt: Timestamp.fromMillis(now - 58 * DAY),
    updatedAt: Timestamp.fromMillis(now - 58 * DAY),
  });

  await setDoc(doc(db, 'news', 'brouillon-prochaine-annonce'), {
    title: 'Brouillon : prochaine annonce',
    slug: 'brouillon-prochaine-annonce',
    coverUrl: 'assets/images/chadi-victoire.webp',
    excerpt: 'Article en cours de rédaction, non publié.',
    content: '<p>Contenu en cours de rédaction.</p>',
    publishedAt: Timestamp.fromMillis(now + 5 * DAY),
    published: false,
    createdAt: Timestamp.fromMillis(now),
    updatedAt: Timestamp.fromMillis(now),
  });

  // Un produit masqué (boutique pas encore ouverte).
  await setDoc(doc(db, 'products', 'tshirt-tbp'), {
    name: 'T-shirt TBP',
    slug: 'tshirt-tbp',
    price: 30,
    description: 'T-shirt officiel Team Baraia Promotion.',
    images: ['assets/images/produit-tshirt.webp'],
    colors: ['Noir'],
    sizes: [
      { label: 'S', paypalUrl: 'https://www.paypal.com/ncp/payment/DEMO1', available: true },
      { label: 'M', paypalUrl: 'https://www.paypal.com/ncp/payment/DEMO2', available: true },
      { label: 'L', paypalUrl: 'https://www.paypal.com/ncp/payment/DEMO3', available: false },
    ],
    order: 1,
    visible: false,
    createdAt: Timestamp.fromMillis(now),
    updatedAt: Timestamp.fromMillis(now),
  });
});

await testEnv.cleanup();
console.log("Données de démonstration chargées dans l'émulateur Firestore.");
