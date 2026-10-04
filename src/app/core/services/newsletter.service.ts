import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore/lite';
import { newsletterConverter } from '../firestore/converters';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly firestore = inject(Firestore);

  // L'e-mail (normalisé) sert d'identifiant de document : une seconde
  // inscription avec la même adresse retombe sur le même document, que les
  // règles Firestore n'autorisent qu'en création (pas de mise à jour) — les
  // doublons sont donc structurellement impossibles (EDB 9), sans lecture
  // préalable (impossible pour un visiteur anonyme selon les règles).
  async subscribe(email: string): Promise<void> {
    const id = email.trim().toLowerCase();
    try {
      await setDoc(doc(this.firestore, 'newsletter', id).withConverter(newsletterConverter), {
        id,
        email: email.trim(),
        date: new Date(),
      });
    } catch {
      // Déjà inscrit (l'écriture répétée est refusée par les règles) : rien à faire,
      // le visiteur voit un succès dans les deux cas (EDB 8, ne rien révéler).
    }
  }
}
