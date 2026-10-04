import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { NewsService } from '../../../core/services/news.service';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { BOXERS } from '../../../data/boxers';
import { TbpButtonComponent } from '../../../shared/ui/tbp-button/tbp-button.component';
import { TbpCountdownComponent } from '../../../shared/ui/tbp-countdown/tbp-countdown.component';
import { TbpEventRowComponent } from '../../../shared/ui/tbp-event-row/tbp-event-row.component';
import { TbpFaceoffComponent } from '../../../shared/ui/tbp-faceoff/tbp-faceoff.component';
import { TbpLinkComponent } from '../../../shared/ui/tbp-link/tbp-link.component';
import { TbpMosaicComponent } from '../../../shared/ui/tbp-mosaic/tbp-mosaic.component';
import { TbpNewsCardComponent } from '../../../shared/ui/tbp-news-card/tbp-news-card.component';
import { TbpPosterComponent } from '../../../shared/ui/tbp-poster/tbp-poster.component';
import { TbpStripRedComponent } from '../../../shared/ui/tbp-strip-red/tbp-strip-red.component';
import { TbpSubscribeComponent } from '../../../shared/ui/tbp-subscribe/tbp-subscribe.component';
import { TbpToastService } from '../../../shared/ui/tbp-toast/tbp-toast.service';

@Component({
  selector: 'tbp-page-home',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
    TbpPosterComponent,
    TbpButtonComponent,
    TbpLinkComponent,
    TbpCountdownComponent,
    TbpStripRedComponent,
    TbpFaceoffComponent,
    TbpMosaicComponent,
    TbpEventRowComponent,
    TbpNewsCardComponent,
    TbpSubscribeComponent,
  ],
  providers: [DatePipe],
  templateUrl: './home.page.component.html',
})
export class HomePageComponent {
  private readonly datePipe = inject(DatePipe);
  private readonly newsletter = inject(NewsletterService);
  private readonly toast = inject(TbpToastService);

  protected readonly events = inject(EventsService);
  protected readonly news = inject(NewsService);
  protected readonly chadi = BOXERS[0];

  protected subscribe(email: string): void {
    this.newsletter.subscribe(email).then(() => {
      this.toast.show('Merci, tu es inscrit à la newsletter.');
    });
  }

  protected readonly pastEventRows = computed(() =>
    this.events
      .past()
      .slice(0, 5)
      .map((event) => ({
        ...event,
        formattedDate: this.datePipe.transform(event.date, 'dd.MM.yyyy') ?? '',
      })),
  );

  protected readonly latestNewsRows = computed(() =>
    this.news.latestThree().map((item) => ({
      ...item,
      formattedDate: this.datePipe.transform(item.publishedAt, 'dd.MM.yyyy') ?? '',
    })),
  );

  protected readonly mosaicImages = [
    { src: 'assets/images/chadi-jab.webp', alt: 'Chadi touche son adversaire' },
    { src: 'assets/images/chadi-victoire.webp', alt: 'Victoire' },
  ];
}
