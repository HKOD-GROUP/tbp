import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tbp-page-header',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <header class="phead">
      <div class="media">
        <img class="photo" [ngSrc]="image()" [alt]="imageAlt()" fill priority />
      </div>
      <div class="wrap phead__in">
        <ng-content />
      </div>
    </header>
  `,
})
export class TbpPageHeaderComponent {
  readonly image = input.required<string>();
  readonly imageAlt = input.required<string>();
}
