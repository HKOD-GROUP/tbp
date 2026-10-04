import { Component, input } from '@angular/core';

export interface TbpTimelineItem {
  period: string;
  description: string;
}

@Component({
  selector: 'tbp-timeline',
  standalone: true,
  template: `
    <ol class="timeline">
      @for (item of items(); track item.period) {
        <li>
          <span class="it">{{ item.period }}</span>
          <p>{{ item.description }}</p>
        </li>
      }
    </ol>
  `,
})
export class TbpTimelineComponent {
  readonly items = input.required<TbpTimelineItem[]>();
}
