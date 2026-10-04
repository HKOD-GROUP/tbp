// Tests des règles Storage (EDB 8), exécutés contre l'émulateur avec
// @firebase/rules-unit-testing. À lancer via `npm run test:rules`.
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { ref, uploadBytes, getBytes } from 'firebase/storage';

const ADMIN_UID = 'A_REMPLACER_UID_ADMIN';

const SMALL_FILE = new Uint8Array(1024); // 1 Ko
const BIG_FILE = new Uint8Array(6 * 1024 * 1024); // 6 Mo, dépasse la limite de 5 Mo

test('règles Storage', async (t) => {
  const testEnv = await initializeTestEnvironment({
    projectId: 'tbp-rules-test',
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
      host: '127.0.0.1',
      port: 9199,
    },
  });

  const visitor = testEnv.unauthenticatedContext().storage();
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  const otherUser = testEnv.authenticatedContext('some-other-uid').storage();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await uploadBytes(ref(context.storage(), 'events/seed.webp'), SMALL_FILE);
  });

  await t.test('un visiteur peut lire un fichier', async () => {
    await assertSucceeds(getBytes(ref(visitor, 'events/seed.webp')));
  });

  await t.test('un visiteur ne peut pas téléverser de fichier', async () => {
    await assertFails(uploadBytes(ref(visitor, 'events/visitor.webp'), SMALL_FILE));
  });

  await t.test('un utilisateur connecté non admin ne peut pas téléverser', async () => {
    await assertFails(uploadBytes(ref(otherUser, 'events/other.webp'), SMALL_FILE));
  });

  await t.test("l'admin peut téléverser un fichier de moins de 5 Mo", async () => {
    await assertSucceeds(uploadBytes(ref(admin, 'events/admin.webp'), SMALL_FILE));
  });

  await t.test("l'admin ne peut pas téléverser un fichier de plus de 5 Mo", async () => {
    await assertFails(uploadBytes(ref(admin, 'events/too-big.webp'), BIG_FILE));
  });

  await testEnv.cleanup();
});
