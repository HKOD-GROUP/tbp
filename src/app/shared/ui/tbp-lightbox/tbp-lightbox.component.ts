import { NgOptimizedImage } from '@angular/common';
import { Component, HostListener, computed, input, output } from '@angular/core';
import { TbpIconButtonComponent } from '../tbp-icon-button/tbp-icon-button.component';

export interface TbpLightboxImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'tbp-lightbox',
  standalone: true,
  imports: [NgOptimizedImage, TbpIconButtonComponent],
  template: `
    @if (activeIndex(); as index0) {
      <div class="lightbox" role="dialog" aria-modal="true" [attr.aria-label]="current()?.alt">
        <tbp-icon-button
          class="lightbox__close"
          name="close"
          ariaLabel="Fermer"
          (click)="closed.emit()"
        />
        @if (images().length > 1) {
          <tbp-icon-button
            class="lightbox__prev"
            name="left"
            ariaLabel="Image précédente"
            (click)="previous()"
          />
          <tbp-icon-button
            class="lightbox__next"
            name="right"
            ariaLabel="Image suivante"
            (click)="next()"
          />
        }
        @if (current(); as image) {
          <img class="lightbox__img" [ngSrc]="image.src" [alt]="image.alt" width="1200" height="900" />
        }
      </div>
    }
  `,
})
export class TbpLightboxComponent {
  readonly images = input.required<TbpLightboxImage[]>();
  readonly index = input<number | null>(null);
  readonly closed = output<void>();
  readonly indexChanged = output<number>();

  protected readonly activeIndex = computed(() => this.index());
  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : this.images()[i];
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.index() !== null) this.closed.emit();
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.index() !== null) this.previous();
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.index() !== null) this.next();
  }

  protected previous(): void {
    const i = this.index();
    if (i === null) return;
    const total = this.images().length;
    this.indexChanged.emit((i - 1 + total) % total);
  }

  protected next(): void {
    const i = this.index();
    if (i === null) return;
    const total = this.images().length;
    this.indexChanged.emit((i + 1) % total);
  }
}
