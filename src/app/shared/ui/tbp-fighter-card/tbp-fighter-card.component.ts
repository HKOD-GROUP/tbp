import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tbp-fighter-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './tbp-fighter-card.component.html',
})
export class TbpFighterCardComponent {
  readonly href = input.required<string>();
  readonly fullName = input.required<string>();
  readonly category = input.required<string>();
  readonly image = input.required<string>();
  readonly wins = input.required<number>();
  readonly losses = input.required<number>();
  readonly draws = input.required<number>();
}
