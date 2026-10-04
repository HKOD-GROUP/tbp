import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

export interface TbpMosaicImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'tbp-mosaic',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="mosaic">
      @for (image of images(); track image.src) {
        <div class="media">
          <img class="photo" [ngSrc]="image.src" [alt]="image.alt" fill />
        </div>
      }
    </div>
  `,
})
export class TbpMosaicComponent {
  readonly images = input.required<TbpMosaicImage[]>();
}
