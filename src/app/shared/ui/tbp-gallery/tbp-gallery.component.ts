import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface TbpGalleryImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'tbp-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="gallery">
      @for (image of images(); track image.src; let i = $index) {
        <button type="button" class="media" (click)="opened.emit(i)">
          <img class="photo" [ngSrc]="image.src" [alt]="image.alt" fill />
        </button>
      }
    </div>
  `,
})
export class TbpGalleryComponent {
  readonly images = input.required<TbpGalleryImage[]>();
  /** Index de l'image cliquée ; la visionneuse plein écran est branchée en phase 7 avec les données réelles. */
  readonly opened = output<number>();
}
