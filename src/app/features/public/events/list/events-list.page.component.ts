import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { TbpButtonComponent } from '../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpCountdownComponent } from '../../../../shared/ui/tbp-countdown/tbp-countdown.component';
import { TbpEventRowComponent } from '../../../../shared/ui/tbp-event-row/tbp-event-row.component';
import { TbpSpecsComponent } from '../../../../shared/ui/tbp-specs/tbp-specs.component';
import type { TbpTab } from '../../../../shared/ui/tbp-tabs/tbp-tabs.component';
import { TbpTabsComponent } from '../../../../shared/ui/tbp-tabs/tbp-tabs.component';

const TABS: TbpTab[] = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'past', label: 'Passés' },
];

@Component({
  selector: 'tbp-page-events-list',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    TbpTabsComponent,
    TbpButtonComponent,
    TbpCountdownComponent,
    TbpSpecsComponent,
    TbpEventRowComponent,
  ],
  templateUrl: './events-list.page.component.html',
  providers: [DatePipe],
})
export class EventsListPageComponent {
  private readonly datePipe = inject(DatePipe);

  protected readonly events = inject(EventsService);
  protected readonly tabs = TABS;
  protected readonly activeTab = signal<'upcoming' | 'past'>('upcoming');

  protected readonly nextEvent = computed(() => this.events.upcoming()[0]);

  protected readonly nextEventSpecs = computed(() => {
    const event = this.nextEvent();
    if (!event) return [];
    return [
      { label: 'Date', value: this.datePipe.transform(event.date, 'EEEE d MMMM yyyy') ?? '' },
      { label: 'Heure', value: this.datePipe.transform(event.date, 'HH:mm') ?? '' },
      { label: 'Lieu', value: `${event.venue}, ${event.city}` },
    ];
  });

  protected readonly pastEventRows = computed(() =>
    this.events.past().map((event) => ({
      ...event,
      formattedDate: this.datePipe.transform(event.date, 'dd.MM.yyyy') ?? '',
    })),
  );

  protected selectTab(id: string): void {
    this.activeTab.set(id === 'past' ? 'past' : 'upcoming');
  }
}
