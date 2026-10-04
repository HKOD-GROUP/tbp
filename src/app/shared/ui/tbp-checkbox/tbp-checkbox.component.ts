import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from '../../../core/util/noop';

@Component({
  selector: 'tbp-checkbox',
  standalone: true,
  template: `
    <label class="checkbox">
      <input
        type="checkbox"
        [checked]="value()"
        [disabled]="disabled()"
        (change)="handleChange($any($event.target).checked)"
        (blur)="onTouched()"
      />
      <span><ng-content /></span>
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TbpCheckboxComponent),
      multi: true,
    },
  ],
})
export class TbpCheckboxComponent implements ControlValueAccessor {
  protected readonly value = signal(false);
  protected readonly disabled = signal(false);

  protected onTouched: () => void = noop;
  private onChange: (value: boolean) => void = noop;

  writeValue(value: boolean): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected handleChange(checked: boolean): void {
    this.value.set(checked);
    this.onChange(checked);
  }
}
