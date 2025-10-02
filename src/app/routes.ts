import { Routes } from '@angular/router';
import { CollectionPageComponent } from './features/collection/collection-page.component';
import { DeckbuilderPageComponent } from './features/deckbuilder/deckbuilder-page.component';
import { DecksPageComponent } from './features/decks/decks-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { MigrationComponent } from './features/migration/migration.component';
import { ProductsComponent } from './features/products/products.component';
import { ProfilePageComponent } from './features/profile/profile-page.component';
import { RulesComponent } from './features/rules/rules.component';
import { TestPageComponent } from './features/test/test-page.component';

export const routes: Routes = [
  {
    path: 'migration',
    component: MigrationComponent,
  },
  {
    path: 'test',
    component: TestPageComponent,
  },
  {
    path: 'decks',
    component: DecksPageComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'user',
    component: ProfilePageComponent,
  },
  {
    path: 'user/:id',
    component: ProfilePageComponent,
  },
  {
    path: 'deckbuilder/user/:userId/deck/:deckId',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder/:id',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'collection',
    component: CollectionPageComponent,
  },
  {
    path: 'collection/:userId',
    component: CollectionPageComponent,
  },
  {
    path: 'rulings',
    component: RulesComponent,
  },
  { path: '**', component: HomePageComponent },
];
