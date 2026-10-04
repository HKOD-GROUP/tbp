import { Component, inject } from '@angular/core';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';
import { TbpToastService } from './tbp-toast.service';

@Component({
  selector: 'tbp-toast-host',
  standalone: true,
  imports: [TbpIconComponent],
  template: `
    @if (toastService.toast(); as toast) {
      <div class="toast is-on" role="status">
        <tbp-icon name="check" />
        <span>{{ toast.message }}</span>
        @if (toast.actionLabel) {
          <button type="button" (click)="runAction(toast)">{{ toast.actionLabel }}</button>
        }
      </div>
    }
  `,
})
export class TbpToastHostComponent {
  protected readonly toastService = inject(TbpToastService);

  protected runAction(toast: { onAction?: () => void }): void {
    toast.onAction?.();
    this.toastService.dismiss();
  }
}
