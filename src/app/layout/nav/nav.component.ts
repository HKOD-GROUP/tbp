import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavScrollService } from '../../core/scroll/nav-scroll.service';
import { TbpIconComponent } from '../../shared/ui/tbp-icon/tbp-icon.component';
import { TbpLogoComponent } from '../../shared/ui/tbp-logo/tbp-logo.component';
import { MenuService } from '../menu/menu.service';

interface NavLink {
  path: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { path: '/a-propos', label: 'À propos' },
  { path: '/evenements', label: 'Événements' },
  { path: '/boxeurs', label: 'Nos boxeurs' },
  { path: '/boutique', label: 'Boutique' },
  { path: '/news', label: 'News' },
  { path: '/contact', label: 'Contact' },
];

@Component({
  selector: 'tbp-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TbpLogoComponent, TbpIconComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected readonly scroll = inject(NavScrollService);
  protected readonly menu = inject(MenuService);
  protected readonly links = NAV_LINKS;

  protected toggleMenu(): void {
    this.menu.toggle();
    if (this.menu.isOpen()) this.scroll.forceVisible();
  }
}
