import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';

@Component({
  selector: 'tbp-strip-red',
  standalone: true,
  imports: [TbpIconComponent, RouterLink],
  template: `
    <a class="strip-red" [routerLink]="href()">
      <div class="wrap strip-red__in">
        <div class="strip-red__items">
          <ng-content />
        </div>
        <tbp-icon name="arrow" />
      </div>
    </a>
  `,
})
export class TbpStripRedComponent {
  readonly href = input.required<string>();
}
