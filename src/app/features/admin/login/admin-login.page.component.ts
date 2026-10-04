import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TbpAlertComponent } from '../../../shared/ui/tbp-alert/tbp-alert.component';
import { TbpButtonComponent } from '../../../shared/ui/tbp-button/tbp-button.component';
import { TbpFieldComponent } from '../../../shared/ui/tbp-field/tbp-field.component';
import { TbpLinkComponent } from '../../../shared/ui/tbp-link/tbp-link.component';
import { TbpLogoComponent } from '../../../shared/ui/tbp-logo/tbp-logo.component';

@Component({
  selector: 'tbp-page-admin-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    TbpAlertComponent,
    TbpButtonComponent,
    TbpFieldComponent,
    TbpLinkComponent,
    TbpLogoComponent,
  ],
  templateUrl: './admin-login.page.component.html',
})
export class AdminLoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.auth
      .signInAsAdmin(this.form.getRawValue().password)
      .then(() => this.router.navigateByUrl('/admin'))
      .catch(() => this.error.set(true))
      .finally(() => this.loading.set(false));
  }
}
