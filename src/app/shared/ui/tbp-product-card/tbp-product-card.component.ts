import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { TbpButtonComponent } from '../tbp-button/tbp-button.component';

@Component({
  selector: 'tbp-product-card',
  standalone: true,
  imports: [NgOptimizedImage, TbpButtonComponent],
  template: `
    <article class="product">
      <div class="media r-1x1">
        <img class="photo" [ngSrc]="image()" [alt]="name()" fill />
      </div>
      <div class="product__top">
        <span class="product__name">{{ name() }}</span>
        <span class="product__price">{{ price() }}</span>
      </div>
      @if (description(); as desc) {
        <p class="product__desc">{{ desc }}</p>
      }
      <ng-content />
      @if (buyHref(); as href) {
        <tbp-button variant="primary" [block]="true" [href]="href" target="_blank" rel="noopener">
          Acheter avec PayPal
        </tbp-button>
      }
    </article>
  `,
})
export class TbpProductCardComponent {
  readonly image = input.required<string>();
  readonly name = input.required<string>();
  readonly price = input.required<string>();
  readonly description = input<string>();
  readonly buyHref = input<string>();
}
