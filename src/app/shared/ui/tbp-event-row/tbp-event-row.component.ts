import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';

@Component({
  selector: 'tbp-event-row',
  standalone: true,
  imports: [NgOptimizedImage, TbpIconComponent, RouterLink],
  template: `
    <a class="row" [routerLink]="href()">
      <div class="media row__img">
        <img class="photo" [ngSrc]="posterImage()" [alt]="title()" fill />
      </div>
      <span class="row__date">{{ date() }}</span>
      <span class="row__title">{{ title() }}</span>
      <span class="row__place">{{ place() }}</span>
      <span class="icon-btn" aria-hidden="true">
        <tbp-icon name="arrow" />
      </span>
    </a>
  `,
})
export class TbpEventRowComponent {
  readonly href = input.required<string>();
  readonly posterImage = input.required<string>();
  readonly date = input.required<string>();
  readonly title = input.required<string>();
  readonly place = input.required<string>();
}
