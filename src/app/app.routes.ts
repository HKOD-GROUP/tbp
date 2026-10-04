import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { devOnlyGuard } from './core/guards/dev-only.guard';
import { PublicShellComponent } from './layout/shell/public-shell.component';

export const routes: Routes = [
  {
    path: '_styleguide',
    canActivate: [devOnlyGuard],
    loadComponent: () =>
      import('./features/public/styleguide/styleguide.component').then(
        (m) => m.StyleguideComponent,
      ),
    title: 'Styleguide — TBP',
  },
  {
    path: 'admin/connexion',
    loadComponent: () =>
      import('./features/admin/login/admin-login.page.component').then(
        (m) => m.AdminLoginPageComponent,
      ),
    title: 'Connexion admin — TBP',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.page.component').then(
        (m) => m.AdminDashboardPageComponent,
      ),
    title: 'Tableau de bord — TBP',
  },
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.page.component').then((m) => m.HomePageComponent),
        title: 'Team Baraia Promotion',
      },
      {
        path: 'a-propos',
        loadComponent: () =>
          import('./features/public/about/about.page.component').then((m) => m.AboutPageComponent),
        title: 'À propos — TBP',
      },
      {
        path: 'evenements',
        loadComponent: () =>
          import('./features/public/events/list/events-list.page.component').then(
            (m) => m.EventsListPageComponent,
          ),
        title: 'Événements — TBP',
      },
      {
        path: 'evenements/:slug',
        loadComponent: () =>
          import('./features/public/events/detail/event-detail.page.component').then(
            (m) => m.EventDetailPageComponent,
          ),
        title: 'Événement — TBP',
      },
      {
        path: 'boxeurs',
        loadComponent: () =>
          import('./features/public/boxers/list/boxers-list.page.component').then(
            (m) => m.BoxersListPageComponent,
          ),
        title: 'Nos boxeurs — TBP',
      },
      {
        path: 'boxeurs/:slug',
        loadComponent: () =>
          import('./features/public/boxers/detail/boxer-detail.page.component').then(
            (m) => m.BoxerDetailPageComponent,
          ),
        title: 'Boxeur — TBP',
      },
      {
        path: 'boutique',
        loadComponent: () =>
          import('./features/public/shop/shop.page.component').then((m) => m.ShopPageComponent),
        title: 'Boutique — TBP',
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./features/public/news/list/news-list.page.component').then(
            (m) => m.NewsListPageComponent,
          ),
        title: 'News — TBP',
      },
      {
        path: 'news/:slug',
        loadComponent: () =>
          import('./features/public/news/article/article.page.component').then(
            (m) => m.ArticlePageComponent,
          ),
        title: 'Article — TBP',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.page.component').then(
            (m) => m.ContactPageComponent,
          ),
        title: 'Contact — TBP',
      },
      {
        path: 'mentions-legales',
        loadComponent: () =>
          import('./features/public/legal/mentions/mentions.page.component').then(
            (m) => m.MentionsPageComponent,
          ),
        title: 'Mentions légales — TBP',
      },
      {
        path: 'confidentialite',
        loadComponent: () =>
          import('./features/public/legal/privacy/privacy.page.component').then(
            (m) => m.PrivacyPageComponent,
          ),
        title: 'Politique de confidentialité — TBP',
      },
      {
        path: 'cgv',
        loadComponent: () =>
          import('./features/public/legal/terms/terms.page.component').then(
            (m) => m.TermsPageComponent,
          ),
        title: 'CGV — TBP',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/public/not-found/not-found.page.component').then(
            (m) => m.NotFoundPageComponent,
          ),
        title: 'Page introuvable — TBP',
      },
    ],
  },
];
