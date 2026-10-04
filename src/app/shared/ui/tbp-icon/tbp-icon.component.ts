import { Component, computed, input } from '@angular/core';
import type { TbpIconName } from './tbp-icon.types';

@Component({
  selector: 'tbp-icon',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" aria-hidden="true" focusable="false">
      <use [attr.href]="href()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      color: inherit;
    }

    svg {
      display: block;
    }
  `,
})
export class TbpIconComponent {
  readonly name = input.required<TbpIconName>();
  readonly size = input(24);

  protected readonly href = computed(() => `#i-${this.name()}`);
}
