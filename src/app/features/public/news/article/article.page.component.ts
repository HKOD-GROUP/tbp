import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { NewsService } from '../../../../core/services/news.service';

@Component({
  selector: 'tbp-page-article',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe, RouterLink],
  templateUrl: './article.page.component.html',
})
export class ArticlePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly eventsService = inject(EventsService);

  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  private readonly rawArticle = this.newsService.bySlug(this.slug);

  // Un article programmé dans le futur n'est pas encore accessible, même par lien direct.
  protected readonly article = computed(() => {
    const article = this.rawArticle();
    if (!article || article.publishedAt.getTime() > Date.now()) return undefined;
    return article;
  });

  protected readonly linkedEvent = computed(() => {
    const eventId = this.article()?.eventId;
    return eventId ? this.eventsService.byId(eventId)() : undefined;
  });

  protected shareSupported = typeof navigator !== 'undefined' && !!navigator.share;
  protected linkCopied = false;

  constructor() {
    effect(() => {
      if (!this.newsService.loading() && !this.article()) {
        this.router.navigateByUrl('/404', { skipLocationChange: true });
      }
    });
  }

  protected async share(): Promise<void> {
    const article = this.article();
    if (!article) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      await navigator.share({ title: article.title, url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
    }
  }
}
