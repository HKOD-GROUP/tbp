import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@angular/fire/storage';
import type { News } from '../../../../../core/models/news.model';
import { AdminEventsService } from '../../../../../core/services/admin/admin-events.service';
import {
  AdminNewsService,
  type NewsDraft,
} from '../../../../../core/services/admin/admin-news.service';
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
import { TbpSelectComponent } from '../../../../../shared/ui/tbp-select/tbp-select.component';
import { TbpSwitchComponent } from '../../../../../shared/ui/tbp-switch/tbp-switch.component';
import { TbpTabsComponent } from '../../../../../shared/ui/tbp-tabs/tbp-tabs.component';
import { TbpTextareaComponent } from '../../../../../shared/ui/tbp-textarea/tbp-textarea.component';
import { TbpToastService } from '../../../../../shared/ui/tbp-toast/tbp-toast.service';

type StatusFilter = 'all' | 'published' | 'draft';

@Component({
  selector: 'tbp-admin-news-pane',
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
    TbpSelectComponent,
    TbpSwitchComponent,
    TbpTabsComponent,
    TbpTextareaComponent,
  ],
  templateUrl: './admin-news-pane.component.html',
})
export class AdminNewsPaneComponent {
  protected readonly newsService = inject(AdminNewsService);
  private readonly eventsService = inject(AdminEventsService);
  private readonly storage = inject(Storage);
  private readonly toast = inject(TbpToastService);

  protected readonly statusTabs = [
    { id: 'all', label: 'Tous' },
    { id: 'published', label: 'Publiés' },
    { id: 'draft', label: 'Brouillons' },
  ];

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');

  protected readonly eventOptions = computed(() => [
    { value: '', label: 'Aucun' },
    ...this.eventsService.all().map((e) => ({ value: e.id, label: e.title })),
  ]);

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.newsService
      .all()
      .filter(
        (item) =>
          (this.statusFilter() === 'all' ||
            (this.statusFilter() === 'published') === item.published) &&
          (!q || item.title.toLowerCase().includes(q)),
      );
  });

  protected readonly sheetOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly titleCtrl = signal('');
  protected readonly excerptCtrl = signal('');
  protected readonly contentCtrl = signal('');
  protected readonly eventIdCtrl = signal('');
  protected readonly publishedAtCtrl = signal('');
  protected readonly publishedCtrl = signal(true);
  protected readonly coverUrl = signal('');
  protected readonly coverUploading = signal(false);

  protected readonly coverPreviews = computed<TbpDropzonePreview[]>(() =>
    this.coverUrl() ? [{ url: this.coverUrl(), name: 'Couverture' }] : [],
  );

  protected readonly deleteTarget = signal<{ id: string; title: string } | null>(null);

  openCreate(): void {
    this.editingId.set(null);
    this.titleCtrl.set('');
    this.excerptCtrl.set('');
    this.contentCtrl.set('');
    this.eventIdCtrl.set('');
    const now = new Date();
    this.publishedAtCtrl.set(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    );
    this.publishedCtrl.set(true);
    this.coverUrl.set('');
    this.sheetOpen.set(true);
  }

  protected openEdit(item: News): void {
    this.editingId.set(item.id);
    this.titleCtrl.set(item.title);
    this.excerptCtrl.set(item.excerpt);
    this.contentCtrl.set(item.content);
    this.eventIdCtrl.set(item.eventId ?? '');
    const d = item.publishedAt;
    this.publishedAtCtrl.set(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
    this.publishedCtrl.set(item.published);
    this.coverUrl.set(item.coverUrl);
    this.sheetOpen.set(true);
  }

  protected closeSheet(): void {
    this.sheetOpen.set(false);
  }

  protected async onCoverAdded(files: FileList): Promise<void> {
    const file = files[0];
    if (!file) return;
    this.coverUploading.set(true);
    try {
      const blob = await resizeAndConvertToWebp(file);
      const path = `news/${Date.now()}-${crypto.randomUUID()}.webp`;
      this.coverUrl.set(await uploadImage(this.storage, path, blob));
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : "Échec de l'envoi de l'image.");
    } finally {
      this.coverUploading.set(false);
    }
  }

  protected removeCover(): void {
    this.coverUrl.set('');
  }

  protected async save(): Promise<void> {
    if (!this.titleCtrl().trim() || !this.excerptCtrl().trim() || !this.contentCtrl().trim()) {
      this.toast.show('Titre, extrait et contenu sont obligatoires.');
      return;
    }
    if (!this.coverUrl()) {
      this.toast.show("L'image de couverture est obligatoire.");
      return;
    }

    this.saving.set(true);
    const [year, month, day] = this.publishedAtCtrl().split('-').map(Number);

    const draft: NewsDraft = {
      title: this.titleCtrl().trim(),
      slug: this.newsService.uniqueSlug(this.titleCtrl().trim(), this.editingId() ?? undefined),
      coverUrl: this.coverUrl(),
      excerpt: this.excerptCtrl().trim().slice(0, 160),
      content: this.contentCtrl(),
      publishedAt: new Date(year, month - 1, day),
      eventId: this.eventIdCtrl() || undefined,
      published: this.publishedCtrl(),
    };

    try {
      const id = this.editingId();
      if (id) {
        await this.newsService.update(id, draft);
      } else {
        await this.newsService.create(draft);
      }
      this.toast.show('Modifications enregistrées.');
      this.sheetOpen.set(false);
    } catch {
      this.toast.show("Échec de l'enregistrement.");
    } finally {
      this.saving.set(false);
    }
  }

  protected askDelete(item: News): void {
    this.deleteTarget.set({ id: item.id, title: item.title });
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;
    await this.newsService.delete(target.id);
    this.deleteTarget.set(null);
    this.toast.show('Article supprimé.');
  }
}
