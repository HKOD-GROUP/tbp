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
import { productConverter } from '../../firestore/converters';
import { deleteImage } from '../../util/image-upload';
import type { Product } from '../../models/product.model';
import { generateSlug } from '../../util/slug';

export type ProductDraft = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable({ providedIn: 'root' })
export class AdminProductsService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  private readonly _all = signal<Product[] | null>(null);

  readonly loading = computed(() => this._all() === null);
  readonly all = computed(() => (this._all() ?? []).slice().sort((a, b) => a.order - b.order));

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const snapshot = await getDocs(
      collection(this.firestore, 'products').withConverter(productConverter),
    );
    this._all.set(snapshot.docs.map((d) => d.data()));
  }

  uniqueSlug(name: string, excludeId?: string): string {
    const base = generateSlug(name);
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

  async create(data: ProductDraft): Promise<string> {
    const now = new Date();
    const ref = await addDoc(
      collection(this.firestore, 'products').withConverter(productConverter),
      { ...data, id: '', createdAt: now, updatedAt: now },
    );
    await this.refresh();
    return ref.id;
  }

  async update(id: string, data: ProductDraft): Promise<void> {
    await updateDoc(doc(this.firestore, 'products', id), { ...data, updatedAt: new Date() });
    await this.refresh();
  }

  async delete(id: string): Promise<void> {
    const product = this.all().find((p) => p.id === id);
    await deleteDoc(doc(this.firestore, 'products', id));
    if (product) await Promise.all(product.images.map((url) => deleteImage(this.storage, url)));
    await this.refresh();
  }
}
