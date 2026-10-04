import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TbpButtonComponent } from '../tbp-button/tbp-button.component';

@Component({
  selector: 'tbp-confirm-dialog',
  standalone: true,
  imports: [TbpButtonComponent],
  template: `
    <div class="dialog-veil" [class.is-on]="open()">
      @if (open()) {
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="descriptionId"
          #dialog
          tabindex="-1"
        >
          <h4 [id]="titleId">{{ title() }}</h4>
          <p [id]="descriptionId">{{ description() }}</p>
          <div class="actions">
            <tbp-button variant="outline" size="sm" [icon]="false" (click)="cancel()">
              {{ cancelLabel() }}
            </tbp-button>
            <tbp-button variant="danger" size="sm" [icon]="false" (click)="confirm()">
              {{ confirmLabel() }}
            </tbp-button>
          </div>
        </div>
      }
    </div>
  `,
})
export class TbpConfirmDialogComponent implements OnDestroy {
  private static nextId = 0;

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly confirmLabel = input('Supprimer');
  readonly cancelLabel = input('Annuler');
  readonly open = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly titleId = `tbp-dialog-title-${++TbpConfirmDialogComponent.nextId}`;
  protected readonly descriptionId = `tbp-dialog-desc-${TbpConfirmDialogComponent.nextId}`;

  private readonly document = inject(DOCUMENT);
  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly previouslyFocused = signal<HTMLElement | null>(null);

  constructor() {
    effect(
      () => {
        if (this.open()) {
          this.previouslyFocused.set(this.document.activeElement as HTMLElement);
          queueMicrotask(() => this.dialogRef()?.nativeElement.focus());
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.cancel();
  }

  @HostListener('document:focusin', ['$event'])
  protected trapFocus(event: FocusEvent): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!this.open() || !dialog) return;
    if (!dialog.contains(event.target as Node)) {
      dialog.focus();
    }
  }

  protected confirm(): void {
    this.confirmed.emit();
    this.restoreFocus();
  }

  protected cancel(): void {
    this.cancelled.emit();
    this.restoreFocus();
  }

  private focusWhenOpened(): void {
    if (!this.open()) return;
    this.previouslyFocused.set(this.document.activeElement as HTMLElement);
    this.dialogRef()?.nativeElement.focus();
  }

  private restoreFocus(): void {
    this.previouslyFocused()?.focus();
    this.previouslyFocused.set(null);
  }
}
