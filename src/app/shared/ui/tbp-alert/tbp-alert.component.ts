import { Component, computed, input } from '@angular/core';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';
import type { TbpIconName } from '../tbp-icon/tbp-icon.types';

export type TbpAlertVariant = 'ok' | 'error' | 'info';

const ICON_BY_VARIANT: Record<TbpAlertVariant, TbpIconName> = {
  ok: 'check',
  error: 'alert',
  info: 'info',
};

@Component({
  selector: 'tbp-alert',
  standalone: true,
  imports: [TbpIconComponent],
  template: `
    <div [class]="classes()" role="status">
      <tbp-icon [name]="icon()" [size]="20" />
      <div>
        @if (title(); as t) {
          <b>{{ t }}</b>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class TbpAlertComponent {
  readonly variant = input<TbpAlertVariant>('info');
  readonly title = input<string>();

  protected readonly icon = computed(() => ICON_BY_VARIANT[this.variant()]);
  protected readonly classes = computed(() => `alert alert--${this.variant()}`);
}
