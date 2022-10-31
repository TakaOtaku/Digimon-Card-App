import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './pages/blog/blog.component';
import { CollectionPageComponent } from './pages/collection-page/collection-page.component';
import { CommunityComponent } from './pages/community/community.component';
import { DeckbuilderComponent } from './pages/deckbuilder/deckbuilder.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { TestPageComponent } from './pages/test-page/test-page.component';

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
