import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOXERS } from '../../../../data/boxers';
import { TbpFighterCardComponent } from '../../../../shared/ui/tbp-fighter-card/tbp-fighter-card.component';

@Component({
  selector: 'tbp-page-boxers-list',
  standalone: true,
  imports: [RouterLink, TbpFighterCardComponent],
  templateUrl: './boxers-list.page.component.html',
})
export class BoxersListPageComponent {
  protected readonly boxers = BOXERS;
  protected readonly showGrowingRosterCard = BOXERS.length < 3;
}
