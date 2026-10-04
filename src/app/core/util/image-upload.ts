import { type Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_WIDTH = 2000;
const WEBP_QUALITY = 0.85;

export class ImageTooLargeError extends Error {
  constructor() {
    super('Le fichier dépasse 5 Mo.');
  }
}

// Redimensionne (largeur max 2000 px, sans agrandir) et convertit en WebP
// côté navigateur avant l'envoi (EDB 5), pour limiter le poids des images
// uploadées par le client sans dépendre d'un traitement serveur.
export async function resizeAndConvertToWebp(file: File): Promise<Blob> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageTooLargeError();
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D du canevas.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
  );
  if (!blob) throw new Error("Échec de la conversion en WebP.");
  if (blob.size > MAX_UPLOAD_BYTES) throw new ImageTooLargeError();
  return blob;
}

export function uploadImage(
  storage: Storage,
  path: string,
  blob: Blob,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/webp' });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve, reject),
    );
  });
}

export function deleteImage(storage: Storage, url: string): Promise<void> {
  try {
    return deleteObject(ref(storage, url));
  } catch {
    return Promise.resolve();
  }
}
