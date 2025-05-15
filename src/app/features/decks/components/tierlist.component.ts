import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ADMINS, emptyDeck, JAPTIERLIST, TIERLIST } from '@models';
import { DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'digimon-tierlist',
  template: `
    <div class="mb-5 w-full p-1">
      <h1 class="main-font w-full text-3xl font-extrabold uppercase text-[#e2e4e6]">
        Digimon Archtype Ranking
        <span
          class="surface-card ml-auto inline-block whitespace-nowrap rounded border border-black px-2.5 py-1.5 text-center align-baseline font-bold leading-none text-[#e2e4e6]"
          >{{ currentRegion }}</span
        >
        <button
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-map-marker"
          pButton
          pRipple
          type="button"
          (click)="switchRegion()"></button>
        <button
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-copy"
          pButton
          pRipple
          type="button"
          (click)="copyTierlist()"></button>
        <button
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-plus"
          pButton
          pRipple
          type="button"
          (click)="archtypeDialog = true"></button>
        <button
          *ngIf="isAdmin()"
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-clipboard"
          pButton
          pRipple
          type="button"
          (click)="pasteTierlist()"></button>
        <button
          *ngIf="isAdmin()"
          class="p-button-outlined p-button-rounded p-button-sm mx-2"
          icon="pi pi-upload"
          pButton
          pRipple
          type="button"
          (click)="uploadTierlist()"></button>
      </h1>
      <h3 class="mb-2 text-2xs">Maintained by #Naethaen</h3>

      <div *ngFor="let key of tiers; let i = index" class="flex w-full flex-row border border-black">
        <div
          [ngClass]="key.color"
          pDroppable="gens"
          (onDrop)="onDropToTier(i)"
          class="text-black-outline w-24 text-center text-7xl font-black leading-[5.5rem] text-[#e2e4e6]">
          {{ key.tier }}
        </div>
        <p-listbox [options]="tierlist[i]" [(ngModel)]="selectedDeck">
          <ng-template let-deck let-index="index" pTemplate="item">
            <div
              (contextmenu)="removeDeck(deck, index, i)"
              class="ui-helper-clearfix"
              pDraggable="gens"
              pDroppable="gens"
              dragHandle=".barsHandle"
              (onDragStart)="onDragStart(index, i)"
              (onDrop)="onDrop(index, i)">
              <img
                (click)="openCommunityWithSearch(deck.card)"
                pTooltip="{{ deck.name }}"
                tooltipPosition="top"
                [lazyLoad]="deck.image"
                [ngStyle]="{
                  border: '2px solid black',
                  'border-radius': '5px',
                }"
                [alt]="deck.name"
                class="barsHandle m-auto h-24 cursor-pointer"
                defaultImage="assets/images/digimon-card-back.webp" />
            </div>
          </ng-template>
        </p-listbox>
      </div>
    </div>

    <p-dialog
      header="Add Archtype"
      [(visible)]="archtypeDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass=""
      [baseZIndex]="10000">
      <div class="flex flex-col">
        <span>Add the card id that represents the deck you want to add</span>
        <input class="my-5" type="text" pInputText [(ngModel)]="cardId" placeholder="BT1-001" />
        <p-button (click)="addDeck()">Add</p-button>
      </div>
    </p-dialog>
  `,
  styleUrls: ['./tierlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    RippleModule,
    NgFor,
    NgClass,
    TooltipModule,
    LazyLoadImageModule,
    NgStyle,
    DragDropModule,
    ListboxModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ContextMenuModule,
    NgIf,
  ],
})
export class TierlistComponent {
  websiteStore = inject(WebsiteStore);
  currentRegion = 'GLOBAL';
  tierlist = TIERLIST;
  tiers = [
    { tier: 'S', color: 'bg-red-500' },
    { tier: 'A', color: 'bg-orange-500' },
    { tier: 'B', color: 'bg-yellow-500' },
    { tier: 'C', color: 'bg-green-500' },
    { tier: 'D', color: 'bg-blue-500' },
  ];
  startIndex: number = 0;
  startTier: number = 0;
  selectedDeck: any;
  archtypeDialog = false;
  cardId: string;
  protected readonly emptyDeck = emptyDeck;
  private digimonCardStore = inject(DigimonCardStore);
  private saveStore = inject(SaveStore);
  isAdmin = computed(() => {
    return !!ADMINS.find((user) => {
      if (this.saveStore.save().uid === user.id) {
        return user.admin;
      }
      return false;
    });
  });
  private messageService = inject(MessageService);
  private router: Router = inject(Router);
  private db: AngularFireDatabase = inject(AngularFireDatabase);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.db
      .list('tierlist')
      .valueChanges()
      .subscribe((value) => {
        const newTierlist = (value as any[])[0];
        this.tierlist = newTierlist;
        this.changeDetectorRef.detectChanges();
      });
  }

  openCommunityWithSearch(card: string) {
    this.websiteStore.updateCommunityDeckSearch(card);
    this.router.navigateByUrl('/decks');
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

  onDragStart(index: number, tier: number) {
    this.startIndex = index;
    this.startTier = tier;
    this.selectedDeck = this.tierlist[tier][index];
  }

  onDrop(endIndex: number, endTier: number) {
    // Remove the dragged element from the old tier
    this.tierlist[this.startTier].splice(this.startIndex, 1);

    // Add the dragged element to the new tier
    this.tierlist[endTier].splice(endIndex, 0, this.selectedDeck);

    // Update the tierlist
    this.changeDetectorRef.detectChanges();
  }

  copyTierlist() {
    const tierlistJson = JSON.stringify(this.tierlist);
    navigator.clipboard.writeText(tierlistJson);
  }

  addDeck() {
    const card = this.digimonCardStore.cards().find((card) => card.id === this.cardId);
    if (card) {
      const deck = {
        name: card.name.english,
        card: card.id,
        image: card.cardImage,
      };
      this.tierlist[0].push(deck);
      this.archtypeDialog = false;
      this.changeDetectorRef.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Card ["' + card.name.english + '"] added to Tierlist.',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Card ID not found.',
      });
    }
  }

  onDropToTier(tier: number) {
    console.log('Move Deck ' + this.selectedDeck.name + ' to Tier ' + this.tiers[tier].tier);
    // Remove the dragged element from the old tier
    this.tierlist[this.startTier].splice(this.startIndex, 1);

    // Add the dragged element to the new tier
    this.tierlist[tier].push(this.selectedDeck);

    // Update the tierlist
    this.changeDetectorRef.detectChanges();
  }

  removeDeck(deck: any, index: number, tier: number) {
    console.log('Remove Deck ', deck);
    this.tierlist[tier].splice(index, 1);
  }

  pasteTierlist() {
    navigator.clipboard.readText().then((text) => {
      try {
        const tierlist = JSON.parse(text);
        this.tierlist = tierlist;
        this.changeDetectorRef.detectChanges();
      } catch (e) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Tierlist JSON.',
        });
      }
    });
  }

  uploadTierlist() {
    // Upload the current tierlist to the database
    this.db.list('tierlist').set('tierlist', this.tierlist);
  }
}
