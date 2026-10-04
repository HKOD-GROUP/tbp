import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SOCIAL_LINKS } from '../../core/data/social-links';
import { TbpIconComponent } from '../../shared/ui/tbp-icon/tbp-icon.component';
import { MenuService } from './menu.service';

interface MenuLink {
  path: string;
  label: string;
}

const MENU_LINKS: MenuLink[] = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/evenements', label: 'Événements' },
  { path: '/boxeurs', label: 'Nos boxeurs' },
  { path: '/boutique', label: 'Boutique' },
  { path: '/news', label: 'News' },
  { path: '/contact', label: 'Contact' },
];

@Component({
  selector: 'tbp-menu',
  standalone: true,
  imports: [RouterLink, TbpIconComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements AfterViewChecked {
  protected readonly menu = inject(MenuService);
  protected readonly links = MENU_LINKS;
  protected readonly socials = SOCIAL_LINKS;

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly previouslyFocused = signal<HTMLElement | null>(null);
  private wasOpen = false;

  ngAfterViewChecked(): void {
    const isOpen = this.menu.isOpen();
    if (isOpen && !this.wasOpen) {
      this.previouslyFocused.set(this.document.activeElement as HTMLElement);
      this.panel()?.nativeElement.focus();
    } else if (!isOpen && this.wasOpen) {
      this.previouslyFocused()?.focus();
    }
    this.wasOpen = isOpen;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menu.isOpen()) this.menu.close();
  }

  @HostListener('document:focusin', ['$event'])
  protected trapFocus(event: FocusEvent): void {
    const panel = this.panel()?.nativeElement;
    if (!this.menu.isOpen() || !panel) return;
    if (!panel.contains(event.target as Node)) {
      panel.focus();
    }
  }

  protected currentPath(path: string): boolean {
    return this.router.url === path;
  }
}
