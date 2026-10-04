import { Component, input, output } from '@angular/core';

export interface TbpTab {
  id: string;
  label: string;
}

@Component({
  selector: 'tbp-tabs',
  standalone: true,
  template: `
    <div class="tabs" role="tablist">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="tab.id === activeId()"
          (click)="selected.emit(tab.id)"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `,
})
export class TbpTabsComponent {
  readonly tabs = input.required<TbpTab[]>();
  readonly activeId = input.required<string>();
  readonly selected = output<string>();
}
