import { Component, input } from '@angular/core';

@Component({
  selector: 'tbp-empty-state',
  standalone: true,
  template: `
    <div class="empty">
      <p class="h3">{{ title() }}</p>
      @if (description(); as d) {
        <p class="small">{{ d }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class TbpEmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
