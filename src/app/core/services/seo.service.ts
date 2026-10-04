import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

const SITE_NAME = 'Team Baraia Promotion';
const DEFAULT_IMAGE = `${environment.siteUrl}/assets/images/ring-face.webp`;

export interface SeoData {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(data: SeoData): void {
    const url = `${environment.siteUrl}${data.path}`;
    const image = data.image ?? DEFAULT_IMAGE;

    this.titleService.setTitle(data.title);

    this.setTag('name', 'description', data.description);
    this.setTag('name', 'robots', data.noindex ? 'noindex, nofollow' : 'index, follow');

    this.setTag('property', 'og:site_name', SITE_NAME);
    this.setTag('property', 'og:type', data.type ?? 'website');
    this.setTag('property', 'og:title', data.title);
    this.setTag('property', 'og:description', data.description);
    this.setTag('property', 'og:url', url);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:locale', 'fr_FR');

    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', data.title);
    this.setTag('name', 'twitter:description', data.description);
    this.setTag('name', 'twitter:image', image);

    this.setCanonical(url);
  }

  setJsonLd(id: string, json: object): void {
    this.removeJsonLd(id);
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(json);
    this.document.head.appendChild(script);
  }

  removeJsonLd(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  private setTag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content });
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
