import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tbp-news-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <a class="card" [routerLink]="href()">
      <div class="media r-4x3">
        <img class="photo" [ngSrc]="image()" [alt]="title()" fill />
      </div>
      <div class="card__meta">
        <span class="it">{{ date() }}</span>
      </div>
      <span class="card__title">{{ title() }}</span>
      @if (excerpt(); as text) {
        <p class="small">{{ text }}</p>
      }
    </a>
  `,
})
export class TbpNewsCardComponent {
  readonly href = input.required<string>();
  readonly image = input.required<string>();
  readonly date = input.required<string>();
  readonly title = input.required<string>();
  readonly excerpt = input<string>();
}
