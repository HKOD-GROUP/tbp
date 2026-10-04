import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore/lite';
import { contactMessageConverter, newsletterConverter } from '../../firestore/converters';
import type { ContactMessage, NewsletterEntry } from '../../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class AdminMessagesService {
  private readonly firestore = inject(Firestore);

  private readonly _messages = signal<ContactMessage[] | null>(null);
  private readonly _newsletter = signal<NewsletterEntry[] | null>(null);

  readonly loading = computed(() => this._messages() === null);
  readonly messages = computed(() =>
    (this._messages() ?? []).slice().sort((a, b) => b.date.getTime() - a.date.getTime()),
  );
  readonly newUnreadCount = computed(() => this.messages().filter((m) => !m.read).length);

  readonly newsletter = computed(() =>
    (this._newsletter() ?? []).slice().sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const [messagesSnapshot, newsletterSnapshot] = await Promise.all([
      getDocs(collection(this.firestore, 'contactMessages').withConverter(contactMessageConverter)),
      getDocs(collection(this.firestore, 'newsletter').withConverter(newsletterConverter)),
    ]);
    this._messages.set(messagesSnapshot.docs.map((d) => d.data()));
    this._newsletter.set(newsletterSnapshot.docs.map((d) => d.data()));
  }

  async markAsRead(id: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'contactMessages', id), { read: true });
    await this.refresh();
  }

  async deleteMessage(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'contactMessages', id));
    await this.refresh();
  }

  exportNewsletterCsv(): string {
    const header = 'email,date';
    const rows = this.newsletter().map(
      (entry) => `${entry.email},${entry.date.toISOString().slice(0, 10)}`,
    );
    return [header, ...rows].join('\n');
  }
}
