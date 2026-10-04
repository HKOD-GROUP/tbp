import { ExperimentalPendingTasks, Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore/lite';
import type { Observable } from 'rxjs';
import { productConverter } from '../firestore/converters';
import type { Product } from '../models/product.model';
import { trackFirstEmission } from '../util/track-first-emission';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly firestore = inject(Firestore);
  private readonly pendingTasks = inject(ExperimentalPendingTasks);

  private readonly rawProducts = toSignal(
    trackFirstEmission(
      collectionData(
        query(
          collection(this.firestore, 'products').withConverter(productConverter),
          where('visible', '==', true),
          orderBy('order', 'asc'),
        ),
      ) as unknown as Observable<Product[]>,
      this.pendingTasks,
    ),
    { initialValue: null },
  );

  readonly loading = computed(() => this.rawProducts() === null);
  readonly visible = computed(() => this.rawProducts() ?? []);
  readonly isOpen = computed(() => this.visible().length > 0);

  bySlug(slug: string) {
    return computed(() => this.visible().find((product) => product.slug === slug));
  }
}
