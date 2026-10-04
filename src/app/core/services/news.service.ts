import { ExperimentalPendingTasks, Injectable, computed, inject, signal } from '@angular/core';
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
import { newsConverter } from '../firestore/converters';
import type { News } from '../models/news.model';
import { trackFirstEmission } from '../util/track-first-emission';

const PAGE_SIZE = 9;

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly firestore = inject(Firestore);
  private readonly pendingTasks = inject(ExperimentalPendingTasks);
  private readonly pageCount = signal(1);

  private readonly rawNews = toSignal(
    trackFirstEmission(
      collectionData(
        query(
          collection(this.firestore, 'news').withConverter(newsConverter),
          where('published', '==', true),
          orderBy('publishedAt', 'desc'),
        ),
      ) as unknown as Observable<News[]>,
      this.pendingTasks,
    ),
    { initialValue: null },
  );

  readonly loading = computed(() => this.rawNews() === null);

  private readonly allPublished = computed(() => this.rawNews() ?? []);

  // Seuls les articles publiés dont la date de publication est passée sont affichés (EDB 4).
  private readonly publishedNews = computed(() =>
    this.allPublished()
      .filter((item) => item.publishedAt.getTime() <= Date.now())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
  );

  readonly featured = computed(() => this.publishedNews()[0]);
  readonly rest = computed(() => this.publishedNews().slice(1));
  readonly visible = computed(() => this.rest().slice(0, this.pageCount() * PAGE_SIZE));
  readonly hasMore = computed(() => this.visible().length < this.rest().length);
  readonly latestThree = computed(() => this.publishedNews().slice(0, 3));

  loadMore(): void {
    this.pageCount.update((count) => count + 1);
  }

  bySlug(slug: string) {
    return computed(() => this.allPublished().find((item) => item.slug === slug));
  }
}
