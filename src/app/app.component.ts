import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TbpIconSpriteComponent } from './shared/ui/tbp-icon/tbp-icon-sprite.component';
import { TbpToastHostComponent } from './shared/ui/tbp-toast/tbp-toast-host.component';

@Component({
  selector: 'tbp-root',
  standalone: true,
  imports: [RouterOutlet, TbpIconSpriteComponent, TbpToastHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
