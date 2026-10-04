import { Component, inject } from '@angular/core';
import { TbpAlertComponent } from '../../../shared/ui/tbp-alert/tbp-alert.component';
import { TbpBadgeComponent } from '../../../shared/ui/tbp-badge/tbp-badge.component';
import { TbpButtonComponent } from '../../../shared/ui/tbp-button/tbp-button.component';
import { TbpCheckboxComponent } from '../../../shared/ui/tbp-checkbox/tbp-checkbox.component';
import { TbpConfirmDialogComponent } from '../../../shared/ui/tbp-confirm-dialog/tbp-confirm-dialog.component';
import { TbpCountdownComponent } from '../../../shared/ui/tbp-countdown/tbp-countdown.component';
import { TbpDropzoneComponent } from '../../../shared/ui/tbp-dropzone/tbp-dropzone.component';
import { TbpEmptyStateComponent } from '../../../shared/ui/tbp-empty-state/tbp-empty-state.component';
import { TbpEventRowComponent } from '../../../shared/ui/tbp-event-row/tbp-event-row.component';
import { TbpFaceoffComponent } from '../../../shared/ui/tbp-faceoff/tbp-faceoff.component';
import { TbpFieldComponent } from '../../../shared/ui/tbp-field/tbp-field.component';
import { TbpFightCardComponent } from '../../../shared/ui/tbp-fight-card/tbp-fight-card.component';
import { TbpFighterCardComponent } from '../../../shared/ui/tbp-fighter-card/tbp-fighter-card.component';
import { TbpGalleryComponent } from '../../../shared/ui/tbp-gallery/tbp-gallery.component';
import { TbpIconButtonComponent } from '../../../shared/ui/tbp-icon-button/tbp-icon-button.component';
import { TbpIconComponent } from '../../../shared/ui/tbp-icon/tbp-icon.component';
import { TBP_ICON_NAMES } from '../../../shared/ui/tbp-icon/tbp-icon.types';
import { TbpLinkComponent } from '../../../shared/ui/tbp-link/tbp-link.component';
import { TbpLogoComponent } from '../../../shared/ui/tbp-logo/tbp-logo.component';
import { TbpMosaicComponent } from '../../../shared/ui/tbp-mosaic/tbp-mosaic.component';
import { TbpNewsCardComponent } from '../../../shared/ui/tbp-news-card/tbp-news-card.component';
import { TbpPageHeaderComponent } from '../../../shared/ui/tbp-page-header/tbp-page-header.component';
import { TbpPosterComponent } from '../../../shared/ui/tbp-poster/tbp-poster.component';
import { TbpProductCardComponent } from '../../../shared/ui/tbp-product-card/tbp-product-card.component';
import { TbpRichTextComponent } from '../../../shared/ui/tbp-rich-text/tbp-rich-text.component';
import { TbpSelectComponent } from '../../../shared/ui/tbp-select/tbp-select.component';
import { TbpSizePickerComponent } from '../../../shared/ui/tbp-size-picker/tbp-size-picker.component';
import { TbpSpecsComponent } from '../../../shared/ui/tbp-specs/tbp-specs.component';
import { TbpStatsComponent } from '../../../shared/ui/tbp-stats/tbp-stats.component';
import { TbpStripRedComponent } from '../../../shared/ui/tbp-strip-red/tbp-strip-red.component';
import { TbpSubnavComponent } from '../../../shared/ui/tbp-subnav/tbp-subnav.component';
import { TbpSubscribeComponent } from '../../../shared/ui/tbp-subscribe/tbp-subscribe.component';
import { TbpSwitchComponent } from '../../../shared/ui/tbp-switch/tbp-switch.component';
import { TbpTabsComponent } from '../../../shared/ui/tbp-tabs/tbp-tabs.component';
import { TbpTextareaComponent } from '../../../shared/ui/tbp-textarea/tbp-textarea.component';
import { TbpTicketBarComponent } from '../../../shared/ui/tbp-ticket-bar/tbp-ticket-bar.component';
import { TbpTimelineComponent } from '../../../shared/ui/tbp-timeline/tbp-timeline.component';
import { TbpToastService } from '../../../shared/ui/tbp-toast/tbp-toast.service';

interface ColorToken {
  name: string;
  variable: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { name: 'Ink', variable: '--ink' },
  { name: 'Ink 2', variable: '--ink-2' },
  { name: 'Ink 3', variable: '--ink-3' },
  { name: 'Ink 4', variable: '--ink-4' },
  { name: 'Paper', variable: '--paper' },
  { name: 'Muted', variable: '--muted' },
  { name: 'Dim', variable: '--dim' },
  { name: 'Red', variable: '--red' },
  { name: 'Red haut', variable: '--red-hi' },
  { name: 'Red bas', variable: '--red-lo' },
  { name: 'Red texte', variable: '--red-text' },
  { name: 'Blue (coin bleu)', variable: '--blue' },
  { name: 'OK', variable: '--ok' },
];

const BREAKPOINTS = [
  { name: 'xl', value: '1180px' },
  { name: 'lg', value: '1060px' },
  { name: 'md', value: '860px' },
  { name: 'sm', value: '640px' },
];

const SELECT_OPTIONS = [
  { value: 'partenariat', label: 'Partenariat / sponsoring' },
  { value: 'presse', label: 'Presse / médias' },
  { value: 'boxeur', label: 'Je suis boxeur' },
  { value: 'billetterie', label: 'Billetterie' },
  { value: 'autre', label: 'Autre' },
];

const SIZE_OPTIONS = [
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: false },
  { label: 'XL', available: true },
];

@Component({
  selector: 'tbp-styleguide',
  standalone: true,
  imports: [
    TbpIconComponent,
    TbpLogoComponent,
    TbpButtonComponent,
    TbpLinkComponent,
    TbpIconButtonComponent,
    TbpBadgeComponent,
    TbpFieldComponent,
    TbpSelectComponent,
    TbpTextareaComponent,
    TbpCheckboxComponent,
    TbpSwitchComponent,
    TbpSizePickerComponent,
    TbpSubscribeComponent,
    TbpDropzoneComponent,
    TbpAlertComponent,
    TbpConfirmDialogComponent,
    TbpRichTextComponent,
    TbpPosterComponent,
    TbpStripRedComponent,
    TbpFaceoffComponent,
    TbpCountdownComponent,
    TbpTicketBarComponent,
    TbpFighterCardComponent,
    TbpEventRowComponent,
    TbpMosaicComponent,
    TbpGalleryComponent,
    TbpEmptyStateComponent,
    TbpTimelineComponent,
    TbpStatsComponent,
    TbpSpecsComponent,
    TbpFightCardComponent,
    TbpPageHeaderComponent,
    TbpTabsComponent,
    TbpSubnavComponent,
    TbpNewsCardComponent,
    TbpProductCardComponent,
  ],
  templateUrl: './styleguide.component.html',
  styleUrl: './styleguide.component.scss',
})
export class StyleguideComponent {
  private readonly toastService = inject(TbpToastService);

  protected readonly colors = COLOR_TOKENS;
  protected readonly breakpoints = BREAKPOINTS;
  protected readonly icons = TBP_ICON_NAMES;
  protected readonly selectOptions = SELECT_OPTIONS;
  protected readonly sizeOptions = SIZE_OPTIONS;
  protected dialogOpen = false;

  protected readonly countdownTarget = new Date(Date.now() + 1000 * 60 * 60 * 24 * 12);
  protected readonly galleryImages = [
    { src: 'assets/images/chadi-ring.webp', alt: 'Chadi dans le ring' },
    { src: 'assets/images/combat.webp', alt: 'Échange de coups' },
    { src: 'assets/images/ring-coin.webp', alt: 'Coin rouge' },
  ];
  protected readonly mosaicImages = [
    { src: 'assets/images/chadi-jab.webp', alt: 'Chadi touche son adversaire' },
    { src: 'assets/images/chadi-victoire.webp', alt: 'Victoire' },
    { src: 'assets/images/ring-angle.webp', alt: 'Ring en angle' },
    { src: 'assets/images/ring-haut.webp', alt: 'Ring vu de haut' },
    { src: 'assets/images/ring-coin-face.webp', alt: 'Coin rouge de face' },
  ];
  protected readonly timelineItems = [
    { period: 'Enfance', description: 'Premiers gants à l’âge de 5 ans.' },
    { period: 'Amateur', description: 'Double champion de France de boxe amateur.' },
    { period: '2017 – 2025', description: 'Membre de l’équipe de France.' },
  ];
  protected readonly statsItems = [
    { value: '7', label: 'Victoires chez les pros' },
    { value: '0', label: 'Défaite' },
    { value: '1', label: 'Match nul' },
    { value: '1,90', unit: 'm', label: 'Taille' },
  ];
  protected readonly specRows = [
    { label: 'Âge', value: '24 ans' },
    { label: 'Catégorie', value: 'Super-welters' },
    { label: 'Instagram', value: '@chadi_baraia', href: 'https://www.instagram.com/chadi_baraia' },
  ];
  protected readonly fights = [
    { red: 'Chadi Baraia', blue: 'À annoncer', category: 'Super-welters' },
  ];
  protected readonly tabs = [
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passés' },
  ];
  protected activeTab = 'upcoming';

  protected showToast(): void {
    this.toastService.show('Événement enregistré avec succès.');
  }

  protected openDialog(): void {
    this.dialogOpen = true;
  }

  protected closeDialog(): void {
    this.dialogOpen = false;
  }
}
