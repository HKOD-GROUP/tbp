import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';

export type TbpButtonVariant = 'primary' | 'light' | 'outline' | 'glass' | 'danger';
export type TbpButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'tbp-button',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, TbpIconComponent],
  templateUrl: './tbp-button.component.html',
})
export class TbpButtonComponent {
  readonly variant = input<TbpButtonVariant>('primary');
  readonly size = input<TbpButtonSize>('md');
  readonly icon = input(true);
  readonly block = input(false);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly href = input<string>();
  // Chemin interne (SPA), posé sur le vrai <a> interne. Nommé `to` et pas
  // `routerLink` — voir TbpLinkComponent pour le détail du conflit que ça évite
  // (la vraie directive RouterLink matcherait aussi l'hôte `<tbp-button>`).
  readonly to = input<string | string[]>();
  readonly target = input<string>();
  readonly rel = input<string>();
  /** Force visuellement un état (`is-hover`, `is-active`, `is-focus`) — réservé au styleguide. */
  readonly forceState = input<string>();

  protected readonly classes = computed(() => {
    const parts = ['btn', `btn--${this.variant()}`];
    if (this.size() !== 'md') parts.push(`btn--${this.size()}`);
    if (!this.icon()) parts.push('btn--no-ico');
    if (this.block()) parts.push('btn--block');
    if (this.loading()) parts.push('is-loading');
    const forced = this.forceState();
    if (forced) parts.push(forced);
    return parts.join(' ');
  });
}
