import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TIERLIST } from '../../../models';
import { JAPTIERLIST } from '../../../models/data/japtierlist.data';
import { setCommunityDeckSearch } from '../../store/digimon.actions';

@Component({
  selector: 'digimon-tierlist',
  template: `
    <div class="mb-5 w-full border-2 border-slate-500 p-1">
      <h1
        class="main-font mb-2 w-full text-center text-3xl font-extrabold uppercase text-white"
      >
        Digimon Deck Tierlist
        <span
          class="surface-card ml-auto inline-block whitespace-nowrap rounded py-1.5 px-2.5 text-center align-baseline font-bold leading-none text-white"
          >{{ currentRegion }}</span
        >
        <button
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-map-marker"
          pButton
          pRipple
          type="button"
          (click)="switchRegion()"
        ></button>
      </h1>
      <div
        *ngFor="let key of tiers; let i = index"
        class="flex w-full flex-row border border-black"
      >
        <div
          [ngClass]="key.color"
          class="text-black-outline w-24 text-center text-7xl font-black leading-[5.5rem] text-white"
        >
          {{ key.tier }}
        </div>
        <div class="flex h-full w-full flex-row flex-wrap bg-slate-800">
          <div *ngFor="let deck of tierlist[i]">
            <img
              (click)="openCommunityWithSearch(deck.card)"
              pTooltip="{{ deck.name }}"
              tooltipPosition="top"
              [lazyLoad]="deck.image"
              [ngStyle]="{ border: '2px solid black', 'border-radius': '5px' }"
              [alt]="deck.name"
              class="m-auto h-24 cursor-pointer"
              defaultImage="assets/images/digimon-card-back.webp"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TierlistComponent {
  currentRegion = 'GLOBAL';
  tierlist = TIERLIST;
  tiers = [
    { tier: 'S', color: 'bg-red-500' },
    { tier: 'A', color: 'bg-orange-500' },
    { tier: 'B', color: 'bg-yellow-500' },
    { tier: 'C', color: 'bg-green-500' },
    { tier: 'D', color: 'bg-blue-500' },
  ];

  constructor(private store: Store, private router: Router) {}

  openCommunityWithSearch(card: string) {
    this.store.dispatch(setCommunityDeckSearch({ communityDeckSearch: card }));
    this.router.navigateByUrl('/community');
  }

  switchRegion() {
    if (this.currentRegion === 'GLOBAL') {
      this.currentRegion = 'JAPAN';
      this.tierlist = JAPTIERLIST;
    } else {
      this.currentRegion = 'GLOBAL';
      this.tierlist = TIERLIST;
    }
  }
}
