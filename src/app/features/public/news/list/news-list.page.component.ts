import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../../core/services/news.service';
import { TbpButtonComponent } from '../../../../shared/ui/tbp-button/tbp-button.component';
import { TbpNewsCardComponent } from '../../../../shared/ui/tbp-news-card/tbp-news-card.component';

@Component({
  selector: 'tbp-page-news-list',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, DatePipe, TbpNewsCardComponent, TbpButtonComponent],
  providers: [DatePipe],
  templateUrl: './news-list.page.component.html',
})
export class NewsListPageComponent {
  private readonly datePipe = inject(DatePipe);

  protected readonly news = inject(NewsService);

  protected readonly visibleRows = computed(() =>
    this.news.visible().map((item) => ({
      ...item,
      formattedDate: this.datePipe.transform(item.publishedAt, 'dd.MM.yyyy') ?? '',
    })),
  );
}
