import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore/lite';
import { Storage } from '@angular/fire/storage';
import { eventConverter } from '../../firestore/converters';
import { deleteImage } from '../../util/image-upload';
import type { TbpEvent } from '../../models/event.model';
import { generateSlug } from '../../util/slug';

export type EventDraft = Omit<TbpEvent, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable({ providedIn: 'root' })
export class AdminEventsService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  // Firestore "lite" n'a pas de listener temps réel : on refait une lecture
  // complète après chaque écriture pour que l'admin voie ses changements
  // immédiatement (contrairement aux pages publiques, où une seule lecture à
  // l'ouverture suffit).
  private readonly _all = signal<TbpEvent[] | null>(null);

  readonly loading = computed(() => this._all() === null);
  readonly all = computed(() =>
    (this._all() ?? []).slice().sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const snapshot = await getDocs(
      collection(this.firestore, 'events').withConverter(eventConverter),
    );
    this._all.set(snapshot.docs.map((d) => d.data()));
  }

  uniqueSlug(title: string, excludeId?: string): string {
    const base = generateSlug(title);
    const taken = new Set(
      this.all()
        .filter((event) => event.id !== excludeId)
        .map((event) => event.slug),
    );
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}-${n}`)) n++;
    return `${base}-${n}`;
  }

  async create(data: EventDraft): Promise<string> {
    const now = new Date();
    const ref = await addDoc(collection(this.firestore, 'events').withConverter(eventConverter), {
      ...data,
      id: '',
      createdAt: now,
      updatedAt: now,
    });
    await this.refresh();
    return ref.id;
  }

  async update(id: string, data: EventDraft): Promise<void> {
    await updateDoc(doc(this.firestore, 'events', id), { ...data, updatedAt: new Date() });
    await this.refresh();
  }

  async delete(id: string): Promise<void> {
    const event = this.all().find((e) => e.id === id);
    await deleteDoc(doc(this.firestore, 'events', id));
    if (event) {
      await Promise.all([
        deleteImage(this.storage, event.posterUrl),
        ...(event.gallery ?? []).map((url) => deleteImage(this.storage, url)),
      ]);
    }
    await this.refresh();
  }
}
