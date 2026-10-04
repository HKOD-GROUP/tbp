import { Component, input } from '@angular/core';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';

export interface TbpSpecRow {
  label: string;
  value: string;
  href?: string;
}

@Component({
  selector: 'tbp-specs',
  standalone: true,
  imports: [TbpIconComponent],
  template: `
    <dl class="specs" [class.specs--one]="oneColumn()">
      @for (row of rows(); track row.label) {
        <div class="specs__row">
          <dt>{{ row.label }}</dt>
          <dd>
            @if (row.href) {
              <a class="link" [href]="row.href" target="_blank" rel="noopener">
                {{ row.value }}
                <tbp-icon name="external" [size]="15" />
              </a>
            } @else {
              {{ row.value }}
            }
          </dd>
        </div>
      }
    </dl>
  `,
})
export class TbpSpecsComponent {
  readonly rows = input.required<TbpSpecRow[]>();
  readonly oneColumn = input(true);
}
