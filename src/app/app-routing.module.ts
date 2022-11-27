import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlogComponent } from "./features/blog/blog.component";
import { CollectionPageComponent } from "./features/collection/collection-page.component";
import { CommunityComponent } from "./features/community/community.component";
import { DeckbuilderPageComponent } from "./features/deckbuilder/deckbuilder-page.component";
import { DecksPageComponent } from "./features/decks/decks-page.component";
import { HomePageComponent } from "./features/home/home-page.component";
import { ProductsComponent } from "./features/products/products.component.ts";
import { ProfilePageComponent } from "./features/profile/profile-page.component";
import { TestPageComponent } from "./features/test/test-page.component";

const routes: Routes = [
  {
    path: "test",
    component: TestPageComponent
  },
  {
    path: "community",
    component: CommunityComponent
  },
  {
    path: "decks",
    component: DecksPageComponent
  },
  {
    path: "products",
    component: ProductsComponent
  },
  {
    path: "user",
    component: ProfilePageComponent
  },
  {
    path: "user/:id",
    component: ProfilePageComponent
  },
  {
    path: "deckbuilder/user/:userId/deck/:deckId",
    component: DeckbuilderPageComponent
  },
  {
    path: "deckbuilder/:id",
    component: DeckbuilderPageComponent
  },
  {
    path: "deckbuilder",
    component: DeckbuilderPageComponent
  },
  {
    path: "collection",
    component: CollectionPageComponent
  },
  {
    path: "blog/:id",
    component: BlogComponent
  },
  { path: "**", component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
