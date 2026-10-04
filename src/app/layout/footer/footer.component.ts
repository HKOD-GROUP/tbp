import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SOCIAL_LINKS } from '../../core/data/social-links';
import { TbpIconComponent } from '../../shared/ui/tbp-icon/tbp-icon.component';
import { TbpLogoComponent } from '../../shared/ui/tbp-logo/tbp-logo.component';

@Component({
  selector: 'tbp-footer',
  standalone: true,
  imports: [RouterLink, TbpLogoComponent, TbpIconComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly socials = SOCIAL_LINKS;
  protected readonly year = new Date().getFullYear();
}
