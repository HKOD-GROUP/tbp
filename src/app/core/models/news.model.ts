export interface News {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  /** 160 caractères maximum (EDB 5). */
  excerpt: string;
  /** HTML assaini à l'affichage via [innerHTML], jamais bypassSecurityTrustHtml. */
  content: string;
  publishedAt: Date;
  eventId?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
