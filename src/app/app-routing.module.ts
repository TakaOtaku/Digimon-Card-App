import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommunityComponent} from './pages/community/community.component';
import {HomeComponent} from './pages/home/home.component';
import {UserComponent} from './pages/user/user.component';

const routes: Routes = [
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
    path: 'user/:userId/deck/:deckId',
    component: HomeComponent,
  },
  {
    path: 'deck/:id',
    component: HomeComponent,
  },
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
