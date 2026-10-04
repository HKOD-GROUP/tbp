import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tbp-faceoff',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './tbp-faceoff.component.html',
})
export class TbpFaceoffComponent {
  readonly image = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly redName = input.required<string>();
  readonly blueName = input('À annoncer');
  readonly redRecord = input<string>();
  readonly blueRecord = input<string>();
  readonly category = input<string>();
  readonly priority = input(false);
}
