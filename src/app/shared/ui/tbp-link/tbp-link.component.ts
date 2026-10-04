import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TbpIconComponent } from '../tbp-icon/tbp-icon.component';
import type { TbpIconName } from '../tbp-icon/tbp-icon.types';

export type TbpLinkVariant = 'default' | 'red' | 'back' | 'plain';

@Component({
  selector: 'tbp-link',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, TbpIconComponent],
  templateUrl: './tbp-link.component.html',
})
export class TbpLinkComponent {
  readonly href = input<string>();
  // Chemin interne (SPA) : si fourni, prime sur `href` et est posé sur le vrai
  // <a> interne via [routerLink]. Nommé `to` (pas `routerLink`) exprès : s'il
  // s'appelait `routerLink`, la vraie directive RouterLink d'Angular
  // matcherait AUSSI l'hôte `<tbp-link>` (sélecteur [routerLink] global au
  // template), en plus de celle posée ici sur le <a> — double navigation et,
  // pire, course avec le href vide du <a> si rien ne la pose à l'intérieur.
  readonly to = input<string | string[]>();
  readonly variant = input<TbpLinkVariant>('default');
  readonly iconName = input<TbpIconName>('arrow');
  readonly target = input<string>();
  readonly rel = input<string>();

  protected readonly classes = computed(() => {
    const parts = ['link'];
    if (this.variant() !== 'default') parts.push(`link--${this.variant()}`);
    return parts.join(' ');
  });
}
