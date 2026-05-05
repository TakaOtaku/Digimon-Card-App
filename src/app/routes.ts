import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'migration',
    loadComponent: () => import('./features/migration/migration.component').then(m => m.MigrationComponent),
    canActivate: [authGuard],
  },
  {
    path: 'decks',
    loadComponent: () => import('./features/decks/decks-page.component').then(m => m.DecksPageComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'user',
    loadComponent: () => import('./features/profile/profile-page.component').then(m => m.ProfilePageComponent),
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./features/profile/profile-page.component').then(m => m.ProfilePageComponent),
  },
  {
    path: 'deckbuilder/user/:userId/deck/:deckId',
    loadComponent: () => import('./features/deckbuilder/deckbuilder-page.component').then(m => m.DeckbuilderPageComponent),
  },
  {
    path: 'deckbuilder/:id',
    loadComponent: () => import('./features/deckbuilder/deckbuilder-page.component').then(m => m.DeckbuilderPageComponent),
  },
  {
    path: 'deckbuilder',
    loadComponent: () => import('./features/deckbuilder/deckbuilder-page.component').then(m => m.DeckbuilderPageComponent),
  },
  {
    path: 'collection',
    loadComponent: () => import('./features/collection/collection-page.component').then(m => m.CollectionPageComponent),
  },
  {
    path: 'collection/:userId',
    loadComponent: () => import('./features/collection/collection-page.component').then(m => m.CollectionPageComponent),
  },
  {
    path: 'rulings',
    loadComponent: () => import('./features/rules/rules.component').then(m => m.RulesComponent),
  },
  {
    path: 'price-compare',
    loadComponent: () => import('./features/price-compare/price-compare.component').then(m => m.PriceCompareComponent),
  },
  { path: '**', loadComponent: () => import('./features/home/home-page.component').then(m => m.HomePageComponent) },
];
