import { Component, input } from '@angular/core';
import { TbpButtonComponent } from '../tbp-button/tbp-button.component';

export interface TbpSubnavLink {
  href: string;
  label: string;
}

@Component({
  selector: 'tbp-subnav',
  standalone: true,
  imports: [TbpButtonComponent],
  template: `
    <div class="subnav">
      <div class="wrap subnav__in">
        <span class="subnav__title">{{ title() }}</span>
        <div class="subnav__links">
          @for (link of links(); track link.href) {
            <a [href]="link.href">{{ link.label }}</a>
          }
          @if (actionLabel(); as label) {
            <tbp-button variant="primary" size="sm" [href]="actionHref()">{{ label }}</tbp-button>
          }
        </div>
      </div>
    </div>
  `,
})
export class TbpSubnavComponent {
  readonly title = input.required<string>();
  readonly links = input<TbpSubnavLink[]>([]);
  readonly actionLabel = input<string>();
  readonly actionHref = input<string>();
}
