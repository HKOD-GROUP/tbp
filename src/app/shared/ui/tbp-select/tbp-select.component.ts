import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from '../../../core/util/noop';

export interface TbpSelectOption {
  value: string;
  label: string;
}

let nextId = 0;

@Component({
  selector: 'tbp-select',
  standalone: true,
  templateUrl: './tbp-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TbpSelectComponent),
      multi: true,
    },
  ],
})
export class TbpSelectComponent implements ControlValueAccessor {
  readonly id = `tbp-select-${++nextId}`;
  readonly label = input.required<string>();
  readonly options = input.required<TbpSelectOption[]>();
  readonly placeholder = input<string>();
  readonly errorMessage = input<string>();

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly touched = signal(false);

  protected readonly hasError = computed(() => this.touched() && !!this.errorMessage());

  protected readonly classes = computed(() => {
    const parts = ['field'];
    if (this.hasError()) parts.push('is-error');
    if (this.disabled()) parts.push('is-disabled');
    return parts.join(' ');
  });

  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected handleChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
