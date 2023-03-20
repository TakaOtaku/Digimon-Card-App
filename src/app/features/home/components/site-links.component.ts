import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'digimon-site-links',
  template: `
    <div class="grid gap-5 sm:grid-cols-2">
      <digimon-split-box
        image="assets/images/splitbuttons/Deckbuilder.webp"
        header="Deckbuilder"
        subheader="Build and Share Decks"
        (click)="this.router.navigateByUrl('/deckbuilder')"></digimon-split-box>
      <digimon-split-box
        image="assets/images/splitbuttons/Collection.webp"
        header="Collection"
        subheader="Track your Cards"
        (click)="this.router.navigateByUrl('/collection')"></digimon-split-box>
      <digimon-split-box
        image="assets/images/splitbuttons/Profile.webp"
        header="Profile"
        subheader="Overview of your Decks and Collection"
        (click)="this.router.navigateByUrl('/user')"></digimon-split-box>
      <digimon-split-box
        image="assets/images/splitbuttons/Decks.webp"
        header="Decks"
        subheader="Community created Decks"
        (click)="this.router.navigateByUrl('/decks')"></digimon-split-box>
      <digimon-split-box
        image="assets/images/splitbuttons/Community.webp"
        header="Community"
        subheader="Deck- and Tournament-Reports"
        (click)="this.router.navigateByUrl('/community')"></digimon-split-box>
      <digimon-split-box
        image="assets/images/splitbuttons/Products.webp"
        header="Products"
        subheader="List of all Digimon TCG Products"
        (click)="this.router.navigateByUrl('/products')"></digimon-split-box>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteLinksComponent {
  constructor(public router: Router) {}
}
