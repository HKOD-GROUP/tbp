import { isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavScrollService implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isSolid = signal(false);
  readonly isHidden = signal(false);

  private lastY = 0;
  private readonly onScroll = (): void => {
    const y = window.scrollY;
    this.isSolid.set(y > 40);
    this.isHidden.set(y > this.lastY && y > 480);
    this.lastY = y;
  };

  constructor() {
    if (this.isBrowser) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  /** Appelé par le menu plein écran pour garder le header visible pendant qu'il est ouvert. */
  forceVisible(): void {
    this.isHidden.set(false);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }
}
