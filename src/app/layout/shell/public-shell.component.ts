import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MenuComponent } from '../menu/menu.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'tbp-public-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent, MenuComponent, FooterComponent],
  template: `
    <tbp-nav />
    <tbp-menu />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <tbp-footer />
  `,
})
export class PublicShellComponent {}
