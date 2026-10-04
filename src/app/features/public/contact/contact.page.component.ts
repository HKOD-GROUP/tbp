import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import type { ContactSubject } from '../../../core/models/contact-message.model';
import { TbpAlertComponent } from '../../../shared/ui/tbp-alert/tbp-alert.component';
import { TbpButtonComponent } from '../../../shared/ui/tbp-button/tbp-button.component';
import { TbpCheckboxComponent } from '../../../shared/ui/tbp-checkbox/tbp-checkbox.component';
import { TbpFieldComponent } from '../../../shared/ui/tbp-field/tbp-field.component';
import { TbpSelectComponent } from '../../../shared/ui/tbp-select/tbp-select.component';
import { TbpTextareaComponent } from '../../../shared/ui/tbp-textarea/tbp-textarea.component';

const SUBJECT_OPTIONS = [
  { value: 'partenariat', label: 'Partenariat / sponsoring' },
  { value: 'presse', label: 'Presse / médias' },
  { value: 'boxeur', label: 'Je suis boxeur' },
  { value: 'billetterie', label: 'Billetterie' },
  { value: 'autre', label: 'Autre' },
];

// Délai minimum de remplissage anti-spam (EDB 4 et 8), en millisecondes.
const MIN_FILL_TIME_MS = 3000;

interface ContactForm {
  name: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
  consent: FormControl<boolean>;
  /** Champ piège invisible : doit rester vide. */
  website: FormControl<string>;
}

@Component({
  selector: 'tbp-page-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TbpFieldComponent,
    TbpSelectComponent,
    TbpTextareaComponent,
    TbpCheckboxComponent,
    TbpButtonComponent,
    TbpAlertComponent,
  ],
  templateUrl: './contact.page.component.html',
})
export class ContactPageComponent implements OnInit {
  private readonly contactService = inject(ContactService);

  protected readonly subjectOptions = SUBJECT_OPTIONS;
  protected readonly form = new FormGroup<ContactForm>({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subject: new FormControl('', { nonNullable: true, validators: Validators.required }),
    message: new FormControl('', { nonNullable: true, validators: Validators.required }),
    consent: new FormControl(false, {
      nonNullable: true,
      validators: Validators.requiredTrue,
    }),
    website: new FormControl('', { nonNullable: true }),
  });

  protected status: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  private loadedAt = 0;

  ngOnInit(): void {
    this.loadedAt = Date.now();
  }

  protected errorFor(control: keyof ContactForm): string | undefined {
    const c = this.form.controls[control];
    if (!c.touched || c.valid) return undefined;
    if (c.hasError('required') || c.hasError('requiredTrue')) return 'Ce champ est obligatoire.';
    if (c.hasError('email')) return 'Adresse e-mail invalide.';
    return 'Champ invalide.';
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    // Anti-spam : champ piège rempli ou formulaire envoyé trop vite.
    if (this.form.controls.website.value || Date.now() - this.loadedAt < MIN_FILL_TIME_MS) {
      this.status = 'sent';
      return;
    }

    this.status = 'sending';
    const { name, email, subject, message } = this.form.getRawValue();
    this.contactService
      .send({ name, email, subject: subject as ContactSubject, message })
      .then(() => {
        this.status = 'sent';
        this.form.reset({
          name: '',
          email: '',
          subject: '',
          message: '',
          consent: false,
          website: '',
        });
      })
      .catch(() => {
        this.status = 'error';
      });
  }
}
