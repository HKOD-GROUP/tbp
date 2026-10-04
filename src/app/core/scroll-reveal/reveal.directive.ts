import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ScrollRevealService } from './scroll-reveal.service';

/**
 * Apparition au défilement, une seule fois, désactivée si mouvement réduit (géré en CSS).
 * `tbpReveal="text"` (défaut) : fondu + translation de 30px (classe `.rv`).
 * `tbpReveal="image"` : dévoilement du haut vers le bas (classe `.rv-img`).
 */
@Directive({
  selector: '[tbpReveal]',
  standalone: true,
})
export class TbpRevealDirective implements OnInit, OnDestroy {
  readonly tbpReveal = input<'text' | 'image'>('text');

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly scrollReveal = inject(ScrollRevealService);

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.classList.add(this.tbpReveal() === 'image' ? 'rv-img' : 'rv');
    this.scrollReveal.observe(host, () => host.classList.add('is-in'));
  }

  ngOnDestroy(): void {
    this.scrollReveal.unobserve(this.el.nativeElement);
  }
}
