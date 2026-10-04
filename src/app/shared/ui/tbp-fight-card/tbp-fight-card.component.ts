import { Component, input } from '@angular/core';

export interface TbpFight {
  red: string;
  blue: string;
  category: string;
}

@Component({
  selector: 'tbp-fight-card',
  standalone: true,
  template: `
    <div class="fights">
      @for (fight of fights(); track $index; let first = $first) {
        <div class="fight" [class.fight--main]="first">
          <div class="fight__side fight__side--red">
            <span class="fight__corner">Coin rouge</span>
            <span class="fight__name">{{ fight.red }}</span>
            <span class="small">{{ fight.category }}</span>
          </div>
          <span class="fight__vs">VS</span>
          <div class="fight__side fight__side--blue">
            <span class="fight__corner">Coin bleu</span>
            <span class="fight__name">{{ fight.blue }}</span>
            <span class="small">{{ fight.category }}</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class TbpFightCardComponent {
  readonly fights = input.required<TbpFight[]>();
}
