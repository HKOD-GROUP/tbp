import { Component, OnInit, output, signal } from '@angular/core';
import { TbpButtonComponent } from '../tbp-button/tbp-button.component';

// Anti-spam sans captcha (EDB 4 et 8) : champ piège invisible + délai minimum
// de remplissage, comme pour le formulaire de contact.
const MIN_FILL_TIME_MS = 3000;

@Component({
  selector: 'tbp-subscribe',
  standalone: true,
  imports: [TbpButtonComponent],
  template: `
    <form class="subscribe" (submit)="handleSubmit($event)">
      <input
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        [value]="website()"
        (input)="website.set($any($event.target).value)"
        style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0"
        aria-hidden="true"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Votre e-mail"
        autocomplete="email"
        [value]="email()"
        (input)="email.set($any($event.target).value)"
      />
      <tbp-button type="submit" [icon]="false" [loading]="pending()">S'inscrire</tbp-button>
    </form>
  `,
})
export class TbpSubscribeComponent implements OnInit {
  readonly subscribed = output<string>();
  readonly pending = signal(false);

  protected readonly email = signal('');
  protected readonly website = signal('');
  private loadedAt = 0;

  ngOnInit(): void {
    this.loadedAt = Date.now();
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    const value = this.email().trim();
    if (!value) return;

    const isSpam = this.website() !== '' || Date.now() - this.loadedAt < MIN_FILL_TIME_MS;
    this.email.set('');
    if (isSpam) return;

    this.subscribed.emit(value);
  }
}
