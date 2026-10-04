import { Component, input } from '@angular/core';
import { TbpButtonComponent } from '../tbp-button/tbp-button.component';

@Component({
  selector: 'tbp-ticket-bar',
  standalone: true,
  imports: [TbpButtonComponent],
  template: `
    <a class="mcta" [class.is-on]="visible()" [href]="href()">
      <div class="mcta__txt">
        <b>{{ title() }}</b>
        <span>{{ subtitle() }}</span>
      </div>
      <tbp-button variant="primary" size="sm" [icon]="false">{{ ctaLabel() }}</tbp-button>
    </a>
  `,
})
export class TbpTicketBarComponent {
  readonly href = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly ctaLabel = input('Billetterie');
  readonly visible = input(true);
}
