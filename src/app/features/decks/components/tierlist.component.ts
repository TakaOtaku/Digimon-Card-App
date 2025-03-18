import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ADMINS, emptyDeck, JAPTIERLIST, TIERLIST } from '../../../../models';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { DeckDialogComponent } from '../../shared/dialogs/deck-dialog.component';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { SaveStore } from '../../../store/save.store';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

interface TierDeck {
  name: string;
  card: string;
  image: string;
}

interface TierData {
  tier: string;
  color: string;
}

@Component({
  selector: 'digimon-tierlist',
  template: `
    <div class="mb-5 w-full p-1">
      <h1
        class="main-font w-full text-3xl font-extrabold uppercase text-[#e2e4e6]">
        Digimon Archtype Ranking
        <span
          class="surface-card ml-auto inline-block whitespace-nowrap rounded border border-black px-2.5 py-1.5 text-center align-baseline font-bold leading-none text-[#e2e4e6]"
          >{{ currentRegion }}</span
        >
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

      <div
        *ngFor="let key of tiers; let i = index; trackBy: trackByTier"
        class="flex w-full flex-row border border-black">
        <div
          [ngClass]="key.color"
          pDroppable="gens"
          (onDrop)="onDropToTier(i)"
          class="text-black-outline w-24 text-center text-7xl font-black leading-[5.5rem] text-[#e2e4e6]">
          {{ key.tier }}
        </div>
        <p-listbox
          [options]="tierlist[i]"
          [(ngModel)]="selectedDeck">
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
                [defaultImage]="'assets/images/digimon-card-back.webp'"
                [lazyLoad]="getCardImageCached(deck.image)"
                [ngStyle]="{
                  border: '2px solid black',
                  'border-radius': '5px'
                }"
                [alt]="deck.name"
                class="barsHandle m-auto h-24 cursor-pointer" />
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
        <input
          class="my-5"
          type="text"
          pInputText
          [(ngModel)]="cardId"
          placeholder="BT1-001" />
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
    DeckDialogComponent,
    InputTextModule,
    ContextMenuModule,
    NgIf,
  ],
})
export class TierlistComponent implements OnInit {
  private websiteStore = inject(WebsiteStore);
  private digimonCardStore = inject(DigimonCardStore);
  private saveStore = inject(SaveStore);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private db = inject(AngularFireDatabase);
  private changeDetectorRef = inject(ChangeDetectorRef);

  // Image cache
  private imageCache: Record<string, string> = {};

  currentRegion = 'GLOBAL';
  tierlist: TierDeck[][] = [];
  tiers: TierData[] = [
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
  cardId: string = '';
  protected readonly emptyDeck = emptyDeck;

  isAdmin = computed(() => {
    return !!ADMINS.find((user) => {
      if (this.saveStore.save().uid === user.id) {
        return user.admin;
      }
      return false;
    });
  });

  ngOnInit(): void {
    // Initialize with a local copy first for faster initial render
    this.tierlist = structuredClone(TIERLIST);

    // Then load from database
    this.db
      .list('tierlist')
      .valueChanges()
      .pipe(shareReplay(1))
      .subscribe({
        next: (value) => {
          const newTierlist = (value as any[])[0];
          if (newTierlist) {
            this.tierlist = newTierlist;
            this.preloadImages();
            this.changeDetectorRef.markForCheck();
          }
        },
        error: (err) => {
          console.error('Error loading tierlist:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to load tierlist from database.',
          });
        },
      });
  }

  trackByTier(index: number, item: TierData): string {
    return item.tier;
  }

  preloadImages(): void {
    // Preload images for visible cards
    for (const tier of this.tierlist) {
      for (const deck of tier) {
        if (deck.image) {
          this.getCardImageCached(deck.image);
        }
      }
    }
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
    // Create a copy of the tierlist to maintain immutability
    const updatedTierlist = structuredClone(this.tierlist);

    // Remove the dragged element from the old tier
    updatedTierlist[this.startTier].splice(this.startIndex, 1);

    // Add the dragged element to the new tier
    updatedTierlist[endTier].splice(endIndex, 0, this.selectedDeck);

    // Update the tierlist
    this.tierlist = updatedTierlist;
    this.changeDetectorRef.markForCheck();
  }

  copyTierlist() {
    const tierlistJson = JSON.stringify(this.tierlist);
    navigator.clipboard.writeText(tierlistJson).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Tierlist copied to clipboard.',
      });
    });
  }

  addDeck() {
    const card = this.digimonCardStore
      .cards()
      .find((card) => card.id === this.cardId);
    if (card) {
      const deck = {
        name: card.name.english,
        card: card.id,
        image: card.cardImage,
      };

      // Create a new array to trigger change detection
      const updatedTierlist = structuredClone(this.tierlist);
      updatedTierlist[0].push(deck);
      this.tierlist = updatedTierlist;

      this.archtypeDialog = false;
      this.cardId = '';
      this.changeDetectorRef.markForCheck();

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
    // Create a copy of the tierlist
    const updatedTierlist = structuredClone(this.tierlist);

    // Remove the dragged element from the old tier
    updatedTierlist[this.startTier].splice(this.startIndex, 1);

    // Add the dragged element to the new tier
    updatedTierlist[tier].push(this.selectedDeck);

    // Update the tierlist
    this.tierlist = updatedTierlist;
    this.changeDetectorRef.markForCheck();
  }

  removeDeck(deck: any, index: number, tier: number) {
    // Create a copy of the tierlist
    const updatedTierlist = structuredClone(this.tierlist);
    updatedTierlist[tier].splice(index, 1);
    this.tierlist = updatedTierlist;
    this.changeDetectorRef.markForCheck();
  }

  pasteTierlist() {
    navigator.clipboard.readText().then((text) => {
      try {
        const tierlist = JSON.parse(text);
        this.tierlist = tierlist;
        this.preloadImages();
        this.changeDetectorRef.markForCheck();
        this.messageService.add({
          severity: 'success',
          summary: 'Tierlist pasted successfully.',
        });
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
    this.db
      .list('tierlist')
      .set('tierlist', this.tierlist)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tierlist uploaded successfully.',
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to upload tierlist.',
          detail: error.message,
        });
      });
  }

  getCardImageCached(image: string): string {
    if (this.imageCache[image]) {
      return this.imageCache[image];
    }

    // remove assets/images/cards/ from string
    const cleanedImage = image.replace('assets/images/cards/', '');
    const cdnUrl = 'https://digimon-card-app.b-cdn.net/' + cleanedImage;

    // Cache the result
    this.imageCache[image] = cdnUrl;
    return cdnUrl;
  }
}
