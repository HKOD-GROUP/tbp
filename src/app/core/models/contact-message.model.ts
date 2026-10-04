export type ContactSubject = 'partenariat' | 'presse' | 'boxeur' | 'billetterie' | 'autre';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  date: Date;
  read: boolean;
}

export interface NewsletterEntry {
  id: string;
  email: string;
  date: Date;
}
