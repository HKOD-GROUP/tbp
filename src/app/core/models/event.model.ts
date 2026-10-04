export interface EventFight {
  red: string;
  blue: string;
  category: string;
}

export interface TbpEvent {
  id: string;
  title: string;
  slug: string;
  /** Date et heure de début de l'événement. */
  date: Date;
  venue: string;
  city: string;
  address?: string;
  posterUrl: string;
  /** HTML assaini à l'affichage via [innerHTML], jamais bypassSecurityTrustHtml. */
  description?: string;
  ticketUrl?: string;
  fightCard?: EventFight[];
  gallery?: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventStatus = 'upcoming' | 'past';
