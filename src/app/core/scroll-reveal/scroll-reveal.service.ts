import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollRevealService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer: IntersectionObserver | null = null;

  observe(element: Element, onReveal: () => void): void {
    if (!this.isBrowser) {
      // Rendu serveur : pas d'observation, l'état visible est appliqué à l'hydratation.
      onReveal();
      return;
    }

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onReveal();
      return;
    }

    this.getObserver().observe(element);
    this.callbacks.set(element, onReveal);
  }

  unobserve(element: Element): void {
    this.observer?.unobserve(element);
    this.callbacks.delete(element);
  }

  private readonly callbacks = new Map<Element, () => void>();

  private getObserver(): IntersectionObserver {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.callbacks.get(entry.target)?.();
          this.observer?.unobserve(entry.target);
          this.callbacks.delete(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    return this.observer;
  }
}
