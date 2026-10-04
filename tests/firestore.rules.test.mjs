// Tests des règles Firestore (EDB 8), exécutés contre l'émulateur avec
// @firebase/rules-unit-testing. À lancer via `npm run test:rules`
// (démarre l'émulateur Firestore, exécute ce script, puis l'arrête).
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

// Doit correspondre exactement à l'UID codé en dur dans firestore.rules.
const ADMIN_UID = 'A_REMPLACER_UID_ADMIN';

let testEnv;

async function setup() {
  testEnv = await initializeTestEnvironment({
    projectId: 'tbp-rules-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8085,
    },
  });
}

async function teardown() {
  await testEnv.cleanup();
}

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'events', 'published-event'), {
      title: 'Gala',
      slug: 'gala',
      published: true,
    });
    await setDoc(doc(db, 'events', 'draft-event'), {
      title: 'Brouillon',
      slug: 'brouillon',
      published: false,
    });
    await setDoc(doc(db, 'news', 'published-news'), {
      title: 'News',
      published: true,
    });
    await setDoc(doc(db, 'news', 'draft-news'), {
      title: 'Brouillon',
      published: false,
    });
    await setDoc(doc(db, 'products', 'visible-product'), {
      name: 'T-shirt',
      visible: true,
    });
    await setDoc(doc(db, 'products', 'hidden-product'), {
      name: 'Hoodie',
      visible: false,
    });
    await setDoc(doc(db, 'contactMessages', 'existing-message'), {
      name: 'Jean',
      email: 'jean@example.com',
      subject: 'autre',
      message: 'Bonjour',
      read: false,
    });
  });
}

test('règles Firestore', async (t) => {
  await setup();
  await seed();

  const visitor = testEnv.unauthenticatedContext().firestore();
  const admin = testEnv.authenticatedContext(ADMIN_UID).firestore();
  const otherUser = testEnv.authenticatedContext('some-other-uid').firestore();

  await t.test('un visiteur peut lire les événements publiés', async () => {
    await assertSucceeds(getDoc(doc(visitor, 'events', 'published-event')));
  });

  await t.test('un visiteur ne peut pas lire un événement brouillon', async () => {
    await assertFails(getDoc(doc(visitor, 'events', 'draft-event')));
  });

  await t.test('un visiteur ne peut pas écrire dans events', async () => {
    await assertFails(setDoc(doc(visitor, 'events', 'hacked'), { title: 'x', published: true }));
  });

  await t.test('un visiteur peut lire la news publiée mais pas le brouillon', async () => {
    await assertSucceeds(getDoc(doc(visitor, 'news', 'published-news')));
    await assertFails(getDoc(doc(visitor, 'news', 'draft-news')));
  });

  await t.test('un visiteur peut lire un produit visible mais pas un produit masqué', async () => {
    await assertSucceeds(getDoc(doc(visitor, 'products', 'visible-product')));
    await assertFails(getDoc(doc(visitor, 'products', 'hidden-product')));
  });

  await t.test("l'admin peut tout lire, y compris les brouillons", async () => {
    await assertSucceeds(getDoc(doc(admin, 'events', 'draft-event')));
    await assertSucceeds(getDoc(doc(admin, 'news', 'draft-news')));
    await assertSucceeds(getDoc(doc(admin, 'products', 'hidden-product')));
  });

  await t.test("l'admin peut écrire dans events, news et products", async () => {
    await assertSucceeds(
      setDoc(doc(admin, 'events', 'new-event'), { title: 'Nouveau', published: false }),
    );
    await assertSucceeds(updateDoc(doc(admin, 'news', 'published-news'), { title: 'Modifié' }));
  });

  await t.test('un utilisateur connecté non admin ne peut pas écrire dans events', async () => {
    await assertFails(
      setDoc(doc(otherUser, 'events', 'hacked-2'), { title: 'x', published: true }),
    );
  });

  await t.test('un visiteur peut créer un message de contact valide', async () => {
    await assertSucceeds(
      addDoc(collection(visitor, 'contactMessages'), {
        name: 'Marie',
        email: 'marie@example.com',
        subject: 'presse',
        message: 'Bonjour, je suis journaliste.',
        read: false,
      }),
    );
  });

  await t.test('un visiteur ne peut pas créer un message avec un objet invalide', async () => {
    await assertFails(
      addDoc(collection(visitor, 'contactMessages'), {
        name: 'Marie',
        email: 'marie@example.com',
        subject: 'pas-une-option-valide',
        message: 'Bonjour',
        read: false,
      }),
    );
  });

  await t.test('un visiteur ne peut pas créer un message avec un e-mail invalide', async () => {
    await assertFails(
      addDoc(collection(visitor, 'contactMessages'), {
        name: 'Marie',
        email: 'pas-un-email',
        subject: 'autre',
        message: 'Bonjour',
        read: false,
      }),
    );
  });

  await t.test('un visiteur ne peut pas lire les messages de contact', async () => {
    await assertFails(getDoc(doc(visitor, 'contactMessages', 'existing-message')));
    await assertFails(getDocs(collection(visitor, 'contactMessages')));
  });

  await t.test("seul l'admin lit et supprime les messages de contact", async () => {
    await assertSucceeds(getDoc(doc(admin, 'contactMessages', 'existing-message')));
    await assertSucceeds(deleteDoc(doc(admin, 'contactMessages', 'existing-message')));
  });

  await t.test("un visiteur peut s'inscrire à la newsletter avec un e-mail valide", async () => {
    await assertSucceeds(addDoc(collection(visitor, 'newsletter'), { email: 'fan@example.com' }));
  });

  await t.test('un visiteur ne peut pas lire la liste des inscrits à la newsletter', async () => {
    await assertFails(getDocs(collection(visitor, 'newsletter')));
  });

  await teardown();
});
