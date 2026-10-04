import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isOpen = signal(false);

  constructor() {
    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) this.close();
    });
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
    this.syncScrollLock();
  }

  close(): void {
    this.isOpen.set(false);
    this.syncScrollLock();
  }

  private syncScrollLock(): void {
    if (!this.isBrowser) return;
    this.document.documentElement.style.overflow = this.isOpen() ? 'hidden' : '';
  }
}
