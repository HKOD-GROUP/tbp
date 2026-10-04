import { Component, input } from '@angular/core';

export interface TbpStatItem {
  value: string;
  unit?: string;
  label: string;
}

@Component({
  selector: 'tbp-stats',
  standalone: true,
  template: `
    <div class="stats" [class.stats--3]="items().length === 3">
      @for (item of items(); track item.label) {
        <div class="stat">
          <span class="stat__value num"
            >{{ item.value }}
            @if (item.unit; as unit) {
              <span class="it">{{ unit }}</span>
            }
          </span>
          <span class="stat__label">{{ item.label }}</span>
        </div>
      }
    </div>
  `,
})
export class TbpStatsComponent {
  readonly items = input.required<TbpStatItem[]>();
}
