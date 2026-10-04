import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from '@angular/fire/firestore/lite';
import type { ContactMessage, NewsletterEntry } from '../models/contact-message.model';
import type { TbpEvent } from '../models/event.model';
import type { News } from '../models/news.model';
import type { Product } from '../models/product.model';

function toDate(value: Timestamp | Date | undefined): Date {
  if (!value) return new Date(0);
  return value instanceof Timestamp ? value.toDate() : value;
}

function toTimestamp(value: Timestamp | Date): Timestamp {
  return value instanceof Timestamp ? value : Timestamp.fromDate(value);
}

export const eventConverter: FirestoreDataConverter<TbpEvent> = {
  toFirestore(event: WithFieldValue<TbpEvent>): DocumentData {
    return {
      title: event.title,
      slug: event.slug,
      date: toTimestamp(event.date as Date),
      venue: event.venue,
      city: event.city,
      address: event.address,
      posterUrl: event.posterUrl,
      description: event.description,
      ticketUrl: event.ticketUrl,
      fightCard: event.fightCard,
      gallery: event.gallery,
      published: event.published,
      createdAt: toTimestamp(event.createdAt as Date),
      updatedAt: toTimestamp(event.updatedAt as Date),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): TbpEvent {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data['title'],
      slug: data['slug'],
      date: toDate(data['date']),
      venue: data['venue'],
      city: data['city'],
      address: data['address'],
      posterUrl: data['posterUrl'],
      description: data['description'],
      ticketUrl: data['ticketUrl'],
      fightCard: data['fightCard'],
      gallery: data['gallery'],
      published: !!data['published'],
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  },
};

export const newsConverter: FirestoreDataConverter<News> = {
  toFirestore(news: WithFieldValue<News>): DocumentData {
    return {
      title: news.title,
      slug: news.slug,
      coverUrl: news.coverUrl,
      excerpt: news.excerpt,
      content: news.content,
      publishedAt: toTimestamp(news.publishedAt as Date),
      eventId: news.eventId,
      published: news.published,
      createdAt: toTimestamp(news.createdAt as Date),
      updatedAt: toTimestamp(news.updatedAt as Date),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): News {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data['title'],
      slug: data['slug'],
      coverUrl: data['coverUrl'],
      excerpt: data['excerpt'],
      content: data['content'],
      publishedAt: toDate(data['publishedAt']),
      eventId: data['eventId'],
      published: !!data['published'],
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  },
};

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: WithFieldValue<Product>): DocumentData {
    return {
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      paypalUrl: product.paypalUrl,
      order: product.order,
      visible: product.visible,
      createdAt: toTimestamp(product.createdAt as Date),
      updatedAt: toTimestamp(product.updatedAt as Date),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): Product {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data['name'],
      slug: data['slug'],
      price: data['price'],
      description: data['description'],
      images: data['images'] ?? [],
      colors: data['colors'],
      sizes: data['sizes'],
      paypalUrl: data['paypalUrl'],
      order: data['order'] ?? 0,
      visible: !!data['visible'],
      createdAt: toDate(data['createdAt']),
      updatedAt: toDate(data['updatedAt']),
    };
  },
};

export const contactMessageConverter: FirestoreDataConverter<ContactMessage> = {
  toFirestore(message: WithFieldValue<ContactMessage>): DocumentData {
    return {
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      date: toTimestamp(message.date as Date),
      read: message.read,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): ContactMessage {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data['name'],
      email: data['email'],
      subject: data['subject'],
      message: data['message'],
      date: toDate(data['date']),
      read: !!data['read'],
    };
  },
};

export const newsletterConverter: FirestoreDataConverter<NewsletterEntry> = {
  toFirestore(entry: WithFieldValue<NewsletterEntry>): DocumentData {
    return { email: entry.email, date: toTimestamp(entry.date as Date) };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): NewsletterEntry {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      email: data['email'],
      date: toDate(data['date']),
    };
  },
};
