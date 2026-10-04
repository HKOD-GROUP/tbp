import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import type { ContactMessage, ContactSubject } from '../../../../../core/models/contact-message.model';
import { AdminMessagesService } from '../../../../../core/services/admin/admin-messages.service';
import { TbpBadgeComponent } from '../../../../../shared/ui/tbp-badge/tbp-badge.component';
import { TbpButtonComponent } from '../../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpConfirmDialogComponent } from '../../../../../shared/ui/tbp-confirm-dialog/tbp-confirm-dialog.component';
import { TbpIconButtonComponent } from '../../../../../shared/ui/tbp-icon-button/tbp-icon-button.component';
import { TbpTabsComponent } from '../../../../../shared/ui/tbp-tabs/tbp-tabs.component';
import { TbpToastService } from '../../../../../shared/ui/tbp-toast/tbp-toast.service';

type SourceFilter = 'contact' | 'newsletter';

const SUBJECT_LABELS: Record<ContactSubject, string> = {
  partenariat: 'Partenariat / sponsoring',
  presse: 'Presse / médias',
  boxeur: 'Je suis boxeur',
  billetterie: 'Billetterie',
  autre: 'Autre',
};

@Component({
  selector: 'tbp-admin-messages-pane',
  standalone: true,
  imports: [
    DatePipe,
    TbpBadgeComponent,
    TbpButtonComponent,
    TbpConfirmDialogComponent,
    TbpIconButtonComponent,
    TbpTabsComponent,
  ],
  templateUrl: './admin-messages-pane.component.html',
})
export class AdminMessagesPaneComponent {
  protected readonly messagesService = inject(AdminMessagesService);
  private readonly toast = inject(TbpToastService);

  protected readonly sourceTabs = [
    { id: 'contact', label: 'Contact' },
    { id: 'newsletter', label: 'Newsletter' },
  ];
  protected readonly source = signal<SourceFilter>('contact');

  protected readonly deleteTarget = signal<{ id: string; name: string } | null>(null);

  protected subjectLabel(subject: ContactSubject): string {
    return SUBJECT_LABELS[subject];
  }

  protected openMessage(message: ContactMessage): void {
    if (!message.read) this.messagesService.markAsRead(message.id);
  }

  protected askDelete(message: ContactMessage): void {
    this.deleteTarget.set({ id: message.id, name: message.name });
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;
    await this.messagesService.deleteMessage(target.id);
    this.deleteTarget.set(null);
    this.toast.show('Message supprimé.');
  }

  protected exportCsv(): void {
    const csv = this.messagesService.exportNewsletterCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
