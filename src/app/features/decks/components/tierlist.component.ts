import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ADMINS, emptyDeck, TIERLIST } from '@models';
import { ensureCdnUrl } from '@functions';
import { MongoBackendService } from '@services';
import { DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { OverlayZoneFixDirective } from '@directives';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'digimon-tierlist',
  template: `
    <div class="mb-5 flex w-full flex-col gap-3">
      <h2 class="m-0 flex flex-wrap items-center gap-1 font-display text-2xl font-semibold text-fg">
        Archetype tier list
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
      </h2>
      <p class="m-0 text-xs text-muted">Maintained by #Naethaen · click an archetype to search its decks</p>

      <div class="overflow-hidden rounded-xl border border-line">
      <div *ngFor="let key of tiers; let i = index" class="flex w-full flex-row border-b border-line last:border-b-0">
        <div
          [ngClass]="key.color"
          pDroppable="gens"
          (onDrop)="onDropToTier(i)"
          class="grid w-20 shrink-0 place-items-center font-display text-5xl font-bold text-ink-0">
          {{ key.tier }}
        </div>
        <p-listbox [options]="tierlist[i]" [(ngModel)]="selectedDeck" optionLabel="name">
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
                [lazyLoad]="ensureCdnUrl(deck.image)"
                [ngStyle]="{
                  border: '2px solid black',
                  'border-radius': '5px',
                  background: 'black',
                }"
                [alt]="deck.name"
                class="barsHandle m-auto h-24 cursor-pointer"
                defaultImage="assets/images/digimon-card-back.webp"
                errorImage="assets/images/digimon-card-back.webp" />
            </div>
          </ng-template>
        </p-listbox>
      </div>
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
    OverlayZoneFixDirective,
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
  private mongoBackendService = inject(MongoBackendService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private db = inject(Database);

  constructor() {
    const tierlistRef = ref(this.db, 'tierlist');
    onValue(tierlistRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase tierlist data:', data);

      // Only update if data is valid and non-empty
      if (data) {
        if (Array.isArray(data)) {
          // If it's an array with tiers
          if (data.length > 0 && data[0] && Array.isArray(data[0]) && data[0].length > 0) {
            this.tierlist = data;
            console.log('Tierlist updated from Firebase array');
            this.changeDetectorRef.detectChanges();
          }
        } else if (data.tierlist && Array.isArray(data.tierlist)) {
          // If it's an object with tierlist property
          if (data.tierlist.length > 0 && data.tierlist[0].length > 0) {
            this.tierlist = data.tierlist;
            console.log('Tierlist updated from Firebase object');
            this.changeDetectorRef.detectChanges();
          }
        }
      }
    }, (error) => {
      console.error('Error loading tierlist from Firebase:', error);
    });
  }

  openCommunityWithSearch(card: string) {
    this.websiteStore.updateCommunityDeckSearch(card);
    this.router.navigateByUrl('/decks');
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
    // Remove the dragged element from the old tier
    this.tierlist[this.startTier].splice(this.startIndex, 1);

    // Add the dragged element to the new tier
    this.tierlist[tier].push(this.selectedDeck);

    // Update the tierlist
    this.changeDetectorRef.detectChanges();
  }

  removeDeck(deck: any, index: number, tier: number) {
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
    const tierlistRef = ref(this.db, 'tierlist/tierlist');
    set(tierlistRef, this.tierlist)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tierlist uploaded successfully.',
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading tierlist: ' + error.message,
        });
      });
  }

  ensureCdnUrl = ensureCdnUrl;

}
