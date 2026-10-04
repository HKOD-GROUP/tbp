import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@angular/fire/storage';
import type { TbpEvent, EventFight } from '../../../../../core/models/event.model';
import {
  AdminEventsService,
  type EventDraft,
} from '../../../../../core/services/admin/admin-events.service';
import { getEventStatus } from '../../../../../core/util/event-status';
import { resizeAndConvertToWebp, uploadImage } from '../../../../../core/util/image-upload';
import { TbpBadgeComponent } from '../../../../../shared/ui/tbp-badge/tbp-badge.component';
import { TbpButtonComponent } from '../../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpConfirmDialogComponent } from '../../../../../shared/ui/tbp-confirm-dialog/tbp-confirm-dialog.component';
import {
  TbpDropzoneComponent,
  type TbpDropzonePreview,
} from '../../../../../shared/ui/tbp-dropzone/tbp-dropzone.component';
import { TbpFieldComponent } from '../../../../../shared/ui/tbp-field/tbp-field.component';
import { TbpIconButtonComponent } from '../../../../../shared/ui/tbp-icon-button/tbp-icon-button.component';
import { TbpRichTextComponent } from '../../../../../shared/ui/tbp-rich-text/tbp-rich-text.component';
import { TbpSwitchComponent } from '../../../../../shared/ui/tbp-switch/tbp-switch.component';
import { TbpTabsComponent } from '../../../../../shared/ui/tbp-tabs/tbp-tabs.component';
import { TbpToastService } from '../../../../../shared/ui/tbp-toast/tbp-toast.service';

type StatusFilter = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'tbp-admin-events-pane',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    TbpBadgeComponent,
    TbpButtonComponent,
    TbpConfirmDialogComponent,
    TbpDropzoneComponent,
    TbpFieldComponent,
    TbpIconButtonComponent,
    TbpRichTextComponent,
    TbpSwitchComponent,
    TbpTabsComponent,
  ],
  templateUrl: './admin-events-pane.component.html',
})
export class AdminEventsPaneComponent {
  protected readonly eventsService = inject(AdminEventsService);
  private readonly storage = inject(Storage);
  private readonly toast = inject(TbpToastService);

  protected readonly statusTabs = [
    { id: 'all', label: 'Tous' },
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passés' },
  ];

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');

  protected readonly withStatus = computed(() =>
    this.eventsService.all().map((event) => ({ event, status: getEventStatus(event.date) })),
  );

  protected readonly kpis = computed(() => {
    const all = this.withStatus();
    return {
      upcoming: all.filter((e) => e.status === 'upcoming').length,
      past: all.filter((e) => e.status === 'past').length,
    };
  });

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.withStatus().filter(
      ({ event, status }) =>
        (this.statusFilter() === 'all' || this.statusFilter() === status) &&
        (!q || event.title.toLowerCase().includes(q)),
    );
  });

  protected readonly sheetOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly titleCtrl = signal('');
  protected readonly dateCtrl = signal('');
  protected readonly timeCtrl = signal('19:00');
  protected readonly venueCtrl = signal('');
  protected readonly cityCtrl = signal('');
  protected readonly addressCtrl = signal('');
  protected readonly ticketUrlCtrl = signal('');
  protected readonly descriptionCtrl = signal('');
  protected readonly publishedCtrl = signal(true);
  protected readonly posterUrl = signal('');
  protected readonly posterUploading = signal(false);
  protected readonly gallery = signal<string[]>([]);
  protected readonly galleryUploading = signal(false);
  protected readonly fightCard = signal<EventFight[]>([]);

  protected readonly posterPreviews = computed<TbpDropzonePreview[]>(() =>
    this.posterUrl() ? [{ url: this.posterUrl(), name: 'Affiche' }] : [],
  );
  protected readonly galleryPreviews = computed<TbpDropzonePreview[]>(() =>
    this.gallery().map((url, i) => ({ url, name: `Photo ${i + 1}` })),
  );

  protected readonly deleteTarget = signal<{ id: string; title: string } | null>(null);

  openCreate(): void {
    this.editingId.set(null);
    this.titleCtrl.set('');
    this.dateCtrl.set('');
    this.timeCtrl.set('19:00');
    this.venueCtrl.set('');
    this.cityCtrl.set('');
    this.addressCtrl.set('');
    this.ticketUrlCtrl.set('');
    this.descriptionCtrl.set('');
    this.publishedCtrl.set(true);
    this.posterUrl.set('');
    this.gallery.set([]);
    this.fightCard.set([]);
    this.sheetOpen.set(true);
  }

  protected openEdit(event: TbpEvent): void {
    this.editingId.set(event.id);
    this.titleCtrl.set(event.title);
    const d = event.date;
    this.dateCtrl.set(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
    this.timeCtrl.set(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    this.venueCtrl.set(event.venue);
    this.cityCtrl.set(event.city);
    this.addressCtrl.set(event.address ?? '');
    this.ticketUrlCtrl.set(event.ticketUrl ?? '');
    this.descriptionCtrl.set(event.description ?? '');
    this.publishedCtrl.set(event.published);
    this.posterUrl.set(event.posterUrl);
    this.gallery.set(event.gallery ?? []);
    this.fightCard.set(event.fightCard ? event.fightCard.map((f) => ({ ...f })) : []);
    this.sheetOpen.set(true);
  }

  protected closeSheet(): void {
    this.sheetOpen.set(false);
  }

  protected async onPosterAdded(files: FileList): Promise<void> {
    const file = files[0];
    if (!file) return;
    this.posterUploading.set(true);
    try {
      const blob = await resizeAndConvertToWebp(file);
      const path = `events/${Date.now()}-${crypto.randomUUID()}.webp`;
      this.posterUrl.set(await uploadImage(this.storage, path, blob));
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : "Échec de l'envoi de l'image.");
    } finally {
      this.posterUploading.set(false);
    }
  }

  protected removePoster(): void {
    this.posterUrl.set('');
  }

  protected async onGalleryAdded(files: FileList): Promise<void> {
    this.galleryUploading.set(true);
    try {
      for (const file of Array.from(files)) {
        const blob = await resizeAndConvertToWebp(file);
        const path = `events/gallery/${Date.now()}-${crypto.randomUUID()}.webp`;
        const url = await uploadImage(this.storage, path, blob);
        this.gallery.update((list) => [...list, url]);
      }
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : "Échec de l'envoi d'une image.");
    } finally {
      this.galleryUploading.set(false);
    }
  }

  protected removeGalleryPhoto(index: number): void {
    this.gallery.update((list) => list.filter((_, i) => i !== index));
  }

  protected addFight(): void {
    this.fightCard.update((rows) => [...rows, { red: '', blue: '', category: '' }]);
  }

  protected removeFight(index: number): void {
    this.fightCard.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected updateFight(index: number, field: keyof EventFight, value: string): void {
    this.fightCard.update((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  protected async save(): Promise<void> {
    if (!this.titleCtrl().trim() || !this.dateCtrl() || !this.venueCtrl().trim() || !this.cityCtrl().trim()) {
      this.toast.show('Titre, date, lieu et ville sont obligatoires.');
      return;
    }
    if (!this.posterUrl()) {
      this.toast.show("L'affiche est obligatoire.");
      return;
    }

    this.saving.set(true);
    const [year, month, day] = this.dateCtrl().split('-').map(Number);
    const [hour, minute] = this.timeCtrl().split(':').map(Number);
    const date = new Date(year, month - 1, day, hour, minute);

    const draft: EventDraft = {
      title: this.titleCtrl().trim(),
      slug: this.eventsService.uniqueSlug(this.titleCtrl().trim(), this.editingId() ?? undefined),
      date,
      venue: this.venueCtrl().trim(),
      city: this.cityCtrl().trim(),
      address: this.addressCtrl().trim() || undefined,
      posterUrl: this.posterUrl(),
      description: this.descriptionCtrl() || undefined,
      ticketUrl: this.ticketUrlCtrl().trim() || undefined,
      fightCard: this.fightCard().length ? this.fightCard() : undefined,
      gallery: this.gallery().length ? this.gallery() : undefined,
      published: this.publishedCtrl(),
    };

    try {
      const id = this.editingId();
      if (id) {
        await this.eventsService.update(id, draft);
      } else {
        await this.eventsService.create(draft);
      }
      this.toast.show('Modifications enregistrées.');
      this.sheetOpen.set(false);
    } catch {
      this.toast.show("Échec de l'enregistrement.");
    } finally {
      this.saving.set(false);
    }
  }

  protected askDelete(event: TbpEvent): void {
    this.deleteTarget.set({ id: event.id, title: event.title });
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;
    await this.eventsService.delete(target.id);
    this.deleteTarget.set(null);
    this.toast.show('Gala supprimé.');
  }
}
