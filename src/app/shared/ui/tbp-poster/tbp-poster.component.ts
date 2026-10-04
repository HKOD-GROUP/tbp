import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type TbpPosterVariant = 'fighter' | 'salle';

@Component({
  selector: 'tbp-poster',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './tbp-poster.component.html',
})
export class TbpPosterComponent {
  readonly variant = input<TbpPosterVariant>('fighter');
  readonly backgroundImage = input.required<string>();
  readonly backgroundAlt = input.required<string>();
  readonly giantWord = input<string>();
  readonly giantGhost = input(false);
  readonly figureImage = input<string>();
  readonly figureAlt = input<string>();
  readonly priority = input(false);

  protected readonly classes = computed(() =>
    this.variant() === 'salle' ? 'poster poster--salle' : 'poster',
  );
}
