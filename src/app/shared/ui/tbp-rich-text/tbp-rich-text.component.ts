import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { noop } from '../../../core/util/noop';

const TOOLBAR = [['bold', 'italic'], [{ header: 2 }], [{ list: 'bullet' }], ['link', 'image']];

@Component({
  selector: 'tbp-rich-text',
  standalone: true,
  imports: [QuillModule, FormsModule],
  template: `
    <div class="rte">
      <quill-editor
        [modules]="{ toolbar: toolbar }"
        [placeholder]="placeholder()"
        [readOnly]="disabled()"
        [(ngModel)]="content"
        (onContentChanged)="handleChange($event.html)"
        (onBlur)="onTouched()"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TbpRichTextComponent),
      multi: true,
    },
  ],
})
export class TbpRichTextComponent implements ControlValueAccessor {
  readonly placeholder = input('Rédige le contenu ici…');

  protected readonly toolbar = TOOLBAR;
  protected content = '';
  protected readonly disabled = signal(false);

  protected onTouched: () => void = noop;
  private onChange: (value: string) => void = noop;

  writeValue(value: string): void {
    this.content = value ?? '';
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

  protected handleChange(html: string | null): void {
    this.content = html ?? '';
    this.onChange(this.content);
  }
}
