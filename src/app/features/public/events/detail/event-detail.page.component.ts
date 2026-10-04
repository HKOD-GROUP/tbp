import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { downloadIcsFile } from '../../../../core/util/ics';
import { generateSlug } from '../../../../core/util/slug';
import { TbpButtonComponent } from '../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpCountdownComponent } from '../../../../shared/ui/tbp-countdown/tbp-countdown.component';
import { TbpFightCardComponent } from '../../../../shared/ui/tbp-fight-card/tbp-fight-card.component';
import type { TbpLightboxImage } from '../../../../shared/ui/tbp-lightbox/tbp-lightbox.component';
import { TbpLightboxComponent } from '../../../../shared/ui/tbp-lightbox/tbp-lightbox.component';
import type { TbpSpecRow } from '../../../../shared/ui/tbp-specs/tbp-specs.component';
import { TbpSpecsComponent } from '../../../../shared/ui/tbp-specs/tbp-specs.component';
import { TbpSubnavComponent } from '../../../../shared/ui/tbp-subnav/tbp-subnav.component';

@Component({
  selector: 'tbp-page-event-detail',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TbpSubnavComponent,
    TbpCountdownComponent,
    TbpButtonComponent,
    TbpFightCardComponent,
    TbpSpecsComponent,
    TbpLightboxComponent,
  ],
  providers: [DatePipe],
  templateUrl: './event-detail.page.component.html',
})
export class EventDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly datePipe = inject(DatePipe);
  private readonly eventsService = inject(EventsService);

  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly event = this.eventsService.bySlug(this.slug);

  protected readonly specs = computed<TbpSpecRow[]>(() => {
    const e = this.event();
    if (!e) return [];
    const rows: TbpSpecRow[] = [
      { label: 'Date', value: this.datePipe.transform(e.date, 'EEEE d MMMM yyyy') ?? '' },
      { label: 'Heure', value: this.datePipe.transform(e.date, 'HH:mm') ?? '' },
      { label: 'Lieu', value: e.venue },
    ];
    if (e.address) rows.push({ label: 'Adresse', value: e.address });
    return rows;
  });

  protected readonly galleryImages = computed<TbpLightboxImage[]>(() => {
    const e = this.event();
    if (!e?.gallery?.length) return [];
    return e.gallery.map((src, i) => ({ src, alt: `${e.title} — photo ${i + 1}` }));
  });

  protected readonly lightboxIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      // Ne redirige que lorsque les événements ont fini de charger ; le
      // slug reste introuvable car inconnu, pas parce que les données
      // Firestore ne sont pas encore arrivées.
      if (!this.eventsService.loading() && !this.event()) {
        this.router.navigateByUrl('/404', { skipLocationChange: true });
      }
    });
  }

  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  protected closeLightbox(): void {
    this.lightboxIndex.set(null);
  }

  protected addToCalendar(): void {
    const e = this.event();
    if (!e) return;
    downloadIcsFile(
      {
        title: e.title,
        location: `${e.venue}, ${e.city}`,
        start: e.date,
        description: e.description,
      },
      `${generateSlug(e.title)}.ics`,
    );
  }
}
