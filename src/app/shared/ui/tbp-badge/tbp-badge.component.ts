import { Component, computed, input } from '@angular/core';

export type TbpBadgeVariant = 'default' | 'red' | 'muted' | 'ok' | 'danger' | 'amber';

@Component({
  selector: 'tbp-badge',
  standalone: true,
  template: `
    <span [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class TbpBadgeComponent {
  readonly variant = input<TbpBadgeVariant>('default');
  readonly live = input(false);

  protected readonly classes = computed(() => {
    const parts = ['badge'];
    if (this.variant() !== 'default') parts.push(`badge--${this.variant()}`);
    if (this.live()) parts.push('badge--live');
    return parts.join(' ');
  });
}
