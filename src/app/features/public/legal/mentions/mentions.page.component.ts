import { Component } from '@angular/core';
import { TbpSpecsComponent } from '../../../../shared/ui/tbp-specs/tbp-specs.component';

@Component({
  selector: 'tbp-page-mentions',
  standalone: true,
  imports: [TbpSpecsComponent],
  templateUrl: './mentions.page.component.html',
})
export class MentionsPageComponent {
  // EDB section 10 : informations légales exactes de l'éditeur.
  protected readonly rows = [
    { label: 'Éditeur', value: 'TEAM BARAIA PUBLISHING, société par actions simplifiée' },
    { label: 'SIRET', value: '992 223 222 00017' },
    { label: 'Siège social', value: '24 rue Maxime Petit, 91270 Vigneux-sur-Seine' },
    { label: 'Responsable de la publication', value: 'Chadi Baraia' },
    {
      label: 'Contact',
      value: 'teambaraia.publishing@gmail.com',
      href: 'mailto:teambaraia.publishing@gmail.com',
    },
    {
      label: 'Hébergeur',
      value:
        'Google LLC (Firebase Hosting), 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis',
    },
  ];
}
