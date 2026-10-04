import { ExperimentalPendingTasks, Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore/lite';
import type { Observable } from 'rxjs';
import { eventConverter } from '../firestore/converters';
import type { TbpEvent } from '../models/event.model';
import { getEventStatus } from '../util/event-status';
import { trackFirstEmission } from '../util/track-first-emission';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly firestore = inject(Firestore);
  private readonly pendingTasks = inject(ExperimentalPendingTasks);

  private readonly rawEvents = toSignal(
    trackFirstEmission(
      collectionData(
        query(
          collection(this.firestore, 'events').withConverter(eventConverter),
          where('published', '==', true),
        ),
      ) as unknown as Observable<TbpEvent[]>,
      this.pendingTasks,
    ),
    { initialValue: null },
  );

  readonly loading = computed(() => this.rawEvents() === null);
  private readonly publishedEvents = computed(() => this.rawEvents() ?? []);

  readonly upcoming = computed(() =>
    this.publishedEvents()
      .filter((event) => getEventStatus(event.date) === 'upcoming')
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  );

  readonly past = computed(() =>
    this.publishedEvents()
      .filter((event) => getEventStatus(event.date) === 'past')
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  readonly nextEvent = computed(() => this.upcoming()[0]);

  bySlug(slug: string) {
    return computed(() => this.publishedEvents().find((event) => event.slug === slug));
  }

  byId(id: string) {
    return computed(() => this.publishedEvents().find((event) => event.id === id));
  }
}
