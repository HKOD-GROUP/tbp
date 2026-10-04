import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FOUNDERS } from '../../../data/founders';

@Component({
  selector: 'tbp-page-about',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './about.page.component.html',
})
export class AboutPageComponent {
  protected readonly founders = FOUNDERS;
  protected readonly manifesto =
    "Team BARAIA Promotion est née d'une volonté d'indépendance : construire nos propres opportunités et faire vivre une boxe fidèle à nos valeurs. À travers nos événements du peuple, populaires et accessibles à tous, nous réunissons les générations et donnons leur place aux talents de nos territoires. Notre engagement dépasse le ring : faire du sport un outil d'éducation, transmettre le respect, la discipline et la confiance en soi, et montrer à chaque jeune qu'il peut construire son avenir sans renoncer à qui il est.";
}
