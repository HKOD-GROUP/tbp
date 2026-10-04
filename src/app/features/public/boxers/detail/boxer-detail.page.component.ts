import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { findBoxerBySlug } from '../../../../data/boxers';
import { TbpFaceoffComponent } from '../../../../shared/ui/tbp-faceoff/tbp-faceoff.component';
import { TbpMosaicComponent } from '../../../../shared/ui/tbp-mosaic/tbp-mosaic.component';
import { TbpPosterComponent } from '../../../../shared/ui/tbp-poster/tbp-poster.component';
import type { TbpSpecRow } from '../../../../shared/ui/tbp-specs/tbp-specs.component';
import { TbpSpecsComponent } from '../../../../shared/ui/tbp-specs/tbp-specs.component';
import type { TbpStatItem } from '../../../../shared/ui/tbp-stats/tbp-stats.component';
import { TbpStatsComponent } from '../../../../shared/ui/tbp-stats/tbp-stats.component';
import { TbpSubnavComponent } from '../../../../shared/ui/tbp-subnav/tbp-subnav.component';
import { TbpTimelineComponent } from '../../../../shared/ui/tbp-timeline/tbp-timeline.component';

@Component({
  selector: 'tbp-page-boxer-detail',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TbpPosterComponent,
    TbpSubnavComponent,
    TbpStatsComponent,
    TbpSpecsComponent,
    TbpTimelineComponent,
    TbpMosaicComponent,
    TbpFaceoffComponent,
  ],
  templateUrl: './boxer-detail.page.component.html',
})
export class BoxerDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly boxer = findBoxerBySlug(this.route.snapshot.paramMap.get('slug') ?? '');

  protected readonly stats: TbpStatItem[] = this.boxer
    ? [
        { value: String(this.boxer.record.wins), label: 'Victoires chez les pros' },
        { value: String(this.boxer.record.losses), label: 'Défaite' },
        { value: String(this.boxer.record.draws), label: 'Match nul' },
        { value: this.boxer.heightMeters.toFixed(2).replace('.', ','), unit: 'm', label: 'Taille' },
      ]
    : [];

  protected readonly specs: TbpSpecRow[] = this.boxer
    ? [
        { label: 'Âge', value: `${this.boxer.age} ans` },
        { label: 'Taille', value: `${this.boxer.heightMeters.toFixed(2).replace('.', ',')} m` },
        { label: 'Catégorie', value: this.boxer.category },
        { label: 'Club', value: this.boxer.club },
        { label: 'Surnom', value: this.boxer.nickname },
        {
          label: 'Instagram',
          value: this.boxer.instagramHandle,
          href: this.boxer.instagramUrl,
        },
      ]
    : [];

  protected readonly mosaicImages = this.boxer
    ? [
        { src: this.boxer.images.action, alt: `${this.boxer.fullName} à l'entraînement` },
        { src: this.boxer.images.victory, alt: `${this.boxer.fullName}, victoire` },
        { src: this.boxer.images.ring, alt: `${this.boxer.fullName} dans le ring` },
      ]
    : [];

  constructor() {
    if (!this.boxer) {
      // Ne correspond à aucune route déclarée : tombe sur le `**` -> page 404.
      this.router.navigateByUrl('/404', { skipLocationChange: true });
    }
  }
}
