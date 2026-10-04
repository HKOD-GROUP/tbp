import { Component, computed, input } from '@angular/core';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';
import type { TbpIconName } from '../tbp-icon/tbp-icon.types';

@Component({
  selector: 'tbp-icon-button',
  standalone: true,
  imports: [TbpIconComponent],
  template: `
    <button
      [class]="classes()"
      type="button"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
    >
      <tbp-icon [name]="name()" [size]="size() === 'sm' ? 16 : 18" />
    </button>
  `,
})
export class TbpIconButtonComponent {
  readonly name = input.required<TbpIconName>();
  readonly ariaLabel = input.required<string>();
  readonly size = input<'md' | 'sm'>('md');
  readonly danger = input(false);
  readonly disabled = input(false);

  protected readonly classes = computed(() => {
    const parts = ['icon-btn'];
    if (this.size() === 'sm') parts.push('icon-btn--sm');
    if (this.danger()) parts.push('icon-btn--danger');
    return parts.join(' ');
  });
}
