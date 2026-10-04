import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore/lite';
import { contactMessageConverter } from '../firestore/converters';
import type { ContactSubject } from '../models/contact-message.model';

export interface ContactMessageDraft {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly firestore = inject(Firestore);

  send(draft: ContactMessageDraft): Promise<void> {
    return addDoc(
      collection(this.firestore, 'contactMessages').withConverter(contactMessageConverter),
      { ...draft, id: '', date: new Date(), read: false },
    ).then(() => undefined);
  }
}
