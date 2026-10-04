import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminEventsService } from '../../../core/services/admin/admin-events.service';
import { AdminMessagesService } from '../../../core/services/admin/admin-messages.service';
import { AdminNewsService } from '../../../core/services/admin/admin-news.service';
import { AdminProductsService } from '../../../core/services/admin/admin-products.service';
import { environment } from '../../../../environments/environment';
import { TbpIconComponent } from '../../../shared/ui/tbp-icon/tbp-icon.component';
import { TbpLogoComponent } from '../../../shared/ui/tbp-logo/tbp-logo.component';
import { AdminEventsPaneComponent } from './panes/events/admin-events-pane.component';
import { AdminMessagesPaneComponent } from './panes/messages/admin-messages-pane.component';
import { AdminNewsPaneComponent } from './panes/news/admin-news-pane.component';
import { AdminShopPaneComponent } from './panes/shop/admin-shop-pane.component';

export type AdminTabId = 'galas' | 'news' | 'shop' | 'msg';

@Component({
  selector: 'tbp-page-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    TbpIconComponent,
    TbpLogoComponent,
    AdminEventsPaneComponent,
    AdminNewsPaneComponent,
    AdminShopPaneComponent,
    AdminMessagesPaneComponent,
  ],
  templateUrl: './admin-dashboard.page.component.html',
})
export class AdminDashboardPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly events = inject(AdminEventsService);
  protected readonly news = inject(AdminNewsService);
  protected readonly products = inject(AdminProductsService);
  protected readonly messages = inject(AdminMessagesService);

  protected readonly adminEmail = environment.adminEmail;
  protected readonly avatarInitials = this.adminEmail.slice(0, 2).toUpperCase();

  protected readonly activeTab = signal<AdminTabId>('galas');

  private readonly eventsPane = viewChild(AdminEventsPaneComponent);
  private readonly newsPane = viewChild(AdminNewsPaneComponent);
  private readonly shopPane = viewChild(AdminShopPaneComponent);

  protected setTab(tab: AdminTabId): void {
    this.activeTab.set(tab);
  }

  protected openFab(): void {
    switch (this.activeTab()) {
      case 'galas':
        this.eventsPane()?.openCreate();
        break;
      case 'news':
        this.newsPane()?.openCreate();
        break;
      case 'shop':
        this.shopPane()?.openCreate();
        break;
    }
  }

  protected signOut(): void {
    this.auth.signOut().then(() => this.router.navigateByUrl('/admin/connexion'));
  }
}
