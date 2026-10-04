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
import { newsConverter } from '../../firestore/converters';
import { deleteImage } from '../../util/image-upload';
import type { News } from '../../models/news.model';
import { generateSlug } from '../../util/slug';

export type NewsDraft = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable({ providedIn: 'root' })
export class AdminNewsService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  private readonly _all = signal<News[] | null>(null);

  readonly loading = computed(() => this._all() === null);
  readonly all = computed(() =>
    (this._all() ?? []).slice().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
  );

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const snapshot = await getDocs(
      collection(this.firestore, 'news').withConverter(newsConverter),
    );
    this._all.set(snapshot.docs.map((d) => d.data()));
  }

  uniqueSlug(title: string, excludeId?: string): string {
    const base = generateSlug(title);
    const taken = new Set(
      this.all()
        .filter((item) => item.id !== excludeId)
        .map((item) => item.slug),
    );
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}-${n}`)) n++;
    return `${base}-${n}`;
  }

  async create(data: NewsDraft): Promise<string> {
    const now = new Date();
    const ref = await addDoc(collection(this.firestore, 'news').withConverter(newsConverter), {
      ...data,
      id: '',
      createdAt: now,
      updatedAt: now,
    });
    await this.refresh();
    return ref.id;
  }

  async update(id: string, data: NewsDraft): Promise<void> {
    await updateDoc(doc(this.firestore, 'news', id), { ...data, updatedAt: new Date() });
    await this.refresh();
  }

  async delete(id: string): Promise<void> {
    const item = this.all().find((n) => n.id === id);
    await deleteDoc(doc(this.firestore, 'news', id));
    if (item) await deleteImage(this.storage, item.coverUrl);
    await this.refresh();
  }
}
