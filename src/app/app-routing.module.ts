import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './pages/blog.component';
import { CollectionPageComponent } from './pages/collection-page.component';
import { CommunityComponent } from './pages/community.component';
import { DeckbuilderComponent } from './pages/deckbuilder.component';
import { HomeComponent } from './pages/home.component';
import { TestPageComponent } from './pages/test-page.component';
import { UserComponent } from './pages/user.component';

const routes: Routes = [
  {
    path: 'test',
    component: TestPageComponent,
  },
  {
    path: 'community',
    component: CommunityComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'user/:id',
    component: UserComponent,
  },
  {
    path: 'deckbuilder/user/:userId/deck/:deckId',
    component: DeckbuilderComponent,
  },
  {
    path: 'deckbuilder/:id',
    component: DeckbuilderComponent,
  },
  {
    path: 'deckbuilder',
    component: DeckbuilderComponent,
  },
  {
    path: 'collection',
    component: CollectionPageComponent,
  },
  {
    path: 'blog/:id',
    component: BlogComponent,
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
