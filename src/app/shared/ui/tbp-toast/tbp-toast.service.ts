import { Injectable, signal } from '@angular/core';

export interface TbpToast {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DISPLAY_MS = 4000;

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class TbpToastService {
  private readonly _toast = signal<TbpToast | null>(null);
  readonly toast = this._toast.asReadonly();

  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  show(message: string, options?: { actionLabel?: string; onAction?: () => void }): void {
    clearTimeout(this.timeoutId);
    this._toast.set({ id: ++nextId, message, ...options });
    this.timeoutId = setTimeout(() => this._toast.set(null), DISPLAY_MS);
  }

  dismiss(): void {
    clearTimeout(this.timeoutId);
    this._toast.set(null);
  }
}
