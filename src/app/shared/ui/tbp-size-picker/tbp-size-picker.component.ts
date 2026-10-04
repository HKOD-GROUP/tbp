import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from '../../../core/util/noop';

export interface TbpSizeOption {
  label: string;
  available: boolean;
}

@Component({
  selector: 'tbp-size-picker',
  standalone: true,
  template: `
    <div class="sizes" role="group" [attr.aria-label]="ariaLabel()">
      @for (size of sizes(); track size.label) {
        <button
          type="button"
          [attr.aria-pressed]="value() === size.label"
          [disabled]="!size.available || disabled()"
          (click)="select(size.label)"
        >
          {{ size.label }}
        </button>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TbpSizePickerComponent),
      multi: true,
    },
  ],
})
export class TbpSizePickerComponent implements ControlValueAccessor {
  readonly sizes = input.required<TbpSizeOption[]>();
  readonly ariaLabel = input('Taille');

  protected readonly value = signal<string | null>(null);
  protected readonly disabled = signal(false);

  private onChange: (value: string | null) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected select(label: string): void {
    this.value.set(label);
    this.onChange(label);
    this.onTouched();
  }
}
