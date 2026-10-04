import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from '../../../core/util/noop';

@Component({
  selector: 'tbp-switch',
  standalone: true,
  template: `
    <label class="switch">
      <span>
        <b>{{ label() }}</b>
        @if (description(); as d) {
          <small>{{ d }}</small>
        }
      </span>
      <input
        type="checkbox"
        [checked]="value()"
        [disabled]="disabled()"
        (change)="handleChange($any($event.target).checked)"
        (blur)="onTouched()"
      />
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TbpSwitchComponent),
      multi: true,
    },
  ],
})
export class TbpSwitchComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly description = input<string>();

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
