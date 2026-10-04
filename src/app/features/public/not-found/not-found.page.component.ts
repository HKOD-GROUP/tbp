import { Component } from '@angular/core';
import { TbpButtonComponent } from '../../../shared/ui/tbp-button/tbp-button.component';
import { TbpPageHeaderComponent } from '../../../shared/ui/tbp-page-header/tbp-page-header.component';

@Component({
  selector: 'tbp-page-not-found',
  standalone: true,
  imports: [TbpButtonComponent, TbpPageHeaderComponent],
  template: `
    <tbp-page-header image="assets/images/ring-coin-face.webp" imageAlt="Coin rouge du ring">
      <p class="label label--red">404</p>
      <h1 class="h1">K.O. <span class="it">· Resté au tapis</span></h1>
      <p class="lead">Cette page est restée au tapis. Retourne sur le ring.</p>
      <tbp-button variant="primary" [href]="'/'">Retour à l'accueil</tbp-button>
    </tbp-page-header>
  `,
})
export class NotFoundPageComponent {}
