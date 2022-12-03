import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first } from 'rxjs';
import * as uuid from 'uuid';
import { ICard, IDeck, IDeckCard, ITournamentDeck } from '../../../../models';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import { AuthService } from '../../../service/auth.service';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import {
  deleteDeck,
  importDeck,
  saveDeck,
  setDeck,
} from '../../../store/digimon.actions';
import { selectAllCards } from '../../../store/digimon.selectors';

export interface ICardImage {
  name: string;
  value: string;
}

@Component({
  selector: 'digimon-deck-dialog',
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="grid max-h-[375px] min-h-[200px] w-full grid-cols-4 overflow-y-scroll border-2 border-slate-200 md:grid-cols-6 lg:grid-cols-8"
      >
        <digimon-deck-card
          *ngFor="let card of mainDeck"
          [edit]="false"
          [card]="card"
          [cards]="allCards"
        ></digimon-deck-card>
      </div>

      <div
        class="surface-card my-1 mx-auto flex max-h-[200px] w-full flex-row border border-white"
      >
        <digimon-ddto-spread
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"
        ></digimon-ddto-spread>

        <digimon-chart-containers
          [deck]="mainDeck"
          class="mx-auto max-w-[40rem]"
        ></digimon-chart-containers>

        <digimon-color-spread
          [deck]="deck"
          [allCards]="allCards"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"
        ></digimon-color-spread>
      </div>

      <div
        *ngIf="!editable; else edit"
        class="my-1 mx-auto grid grid-cols-3 gap-y-1"
      >
        <label>Title</label>
        <div
          [pTooltip]="deck?.title ?? ''"
          tooltipPosition="top"
          class="text-shadow col-span-2 mr-3 truncate text-3xl font-black text-[#e2e4e6]"
        >
          {{ deck?.title }}
        </div>

        <label>Description</label>
        <div class="col-span-2">{{ deck?.description }}</div>

        <label *ngIf="mode === 'Community'">User</label>
        <div *ngIf="mode === 'Community'" class="col-span-2">
          {{ deck?.user }}
        </div>

        <label>Tags</label>
        <div class="col-span-2 flex flex-row align-middle">
          <div
            *ngFor="let tag of deck?.tags"
            class="surface-ground mr-0.5 h-8 border border-black px-1.5 text-xs font-bold leading-[35px]"
          >
            {{ tag.name }}
          </div>
        </div>

        <label *ngIf="mode === 'Tournament'">Placement</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ placementString(getTournamentDeck(deck).placement) }}
        </div>

        <label *ngIf="mode === 'Tournament'">Country</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ getTournamentDeck(deck).country }}
        </div>

        <label *ngIf="mode === 'Tournament'">Player</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ getTournamentDeck(deck).user }}
        </div>

        <label *ngIf="mode === 'Tournament'">Host</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ getTournamentDeck(deck).host }}
        </div>

        <label *ngIf="mode === 'Tournament'">Format</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ getTournamentDeck(deck).format }}
        </div>

        <label *ngIf="mode === 'Tournament'">Size</label>
        <div *ngIf="mode === 'Tournament'" class="col-span-2">
          {{ mapTournamentSize(getTournamentDeck(deck).size) }}
        </div>
      </div>
      <ng-template #edit [formGroup]="deckFormGroup">
        <div class="my-1 mx-auto grid grid-cols-3 gap-y-1">
          <label>Titel</label>
          <input
            formControlName="title"
            placeholder="Deck Name:"
            class="col-span-2 mr-2 w-full text-sm"
            pInputText
            type="text"
          />
          <label>Image</label>
          <p-dropdown
            styleClass="truncate w-full lg:w-[250px]"
            class=" col-span-2"
            [options]="cardImageOptions"
            formControlName="cardImage"
            optionLabel="name"
            appendTo="body"
          >
          </p-dropdown>
          <label>Description</label>
          <textarea
            formControlName="description"
            placeholder="Description:"
            class="col-span-2 h-[66px] w-full overflow-hidden"
            pInputTextarea
          ></textarea>
          <label>Tags</label>
          <div class="col-span-2 flex flex-row align-middle">
            <div
              *ngFor="let tag of deck?.tags"
              class="surface-ground mr-0.5 h-8 border border-black px-1.5 text-xs font-bold leading-[35px]"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>
      </ng-template>

      <div
        *ngIf="editable; else editButtons"
        class="mx-auto mt-1 grid grid-cols-3 lg:grid-cols-6"
      >
        <button
          (click)="saveDeck()"
          [disabled]="!deckFormGroup.dirty"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Save"
        ></button>
        <button
          (click)="openDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Open"
        ></button>
        <button
          (click)="copyDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Copy"
        ></button>
        <button
          (click)="showExportDeckDialog()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Export"
        ></button>
        <button
          (click)="getLink()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Get Link"
        ></button>
        <button
          (click)="deleteDeck($event)"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Delete"
        ></button>
      </div>
      <ng-template #editButtons>
        <div class="mx-auto mt-1 grid grid-cols-3 lg:grid-cols-5">
          <button
            (click)="openDeck($event)"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Open"
          ></button>
          <button
            (click)="copyDeck($event)"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Copy"
          ></button>
          <button
            (click)="showExportDeckDialog()"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Export"
          ></button>
          <button
            (click)="getLink()"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Get Link"
          ></button>
          <button
            *ngIf="isAdmin"
            (click)="deleteDeck($event)"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Delete"
          ></button>
        </div>
      </ng-template>
    </div>

    <p-dialog
      header="Export Deck"
      [(visible)]="exportDeckDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-export-deck-dialog [deck]="deck"></digimon-export-deck-dialog>
    </p-dialog>
  `,
})
export class DeckDialogComponent implements OnInit, OnChanges {
  @Input() deck: IDeck | ITournamentDeck;
  @Input() editable = true;
  @Input() mode = 'Basic';

  @Output() closeDialog = new EventEmitter<boolean>();

  deckFormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    cardImage: new FormControl({ name: 'BT1-001 - Yokomon', value: 'BT1-001' }),
  });

  saveDisabled = true;

  cardImageOptions: ICardImage[] = [];

  exportDeckDialog = false;
  allCards: ICard[] = [];
  mainDeck: IDeckCard[] = [];

  isAdmin = false;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router,
    private digimonBackendService: DigimonBackendService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.isAdmin =
      this.authService.userData?.uid === 'S3rWXPtCYRN8vSrxY3qE6aeewy43' ||
      this.authService.userData?.uid === 'loBLZPOIL0ZlDzt6A1rgDiTomTw2';
  }

  ngOnInit() {
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((allCards) => (this.allCards = allCards));

    this.mainDeck = mapToDeckCards(this.deck.cards, this.allCards);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['deck']?.currentValue) {
      return;
    }

    this.mainDeck = mapToDeckCards(this.deck.cards, this.allCards);

    this.deckFormGroup = new FormGroup({
      title: new FormControl(this.deck.title),
      description: new FormControl(this.deck.description),
      cardImage: new FormControl(this.getCardImage(this.deck.imageCardId)),
    });

    this.cardImageOptions = this.createImageOptions();
  }

  openDeck(event: Event) {
    if (this.editable) {
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl(
          `deckbuilder/user/${this.authService.userData?.uid}/deck/${this.deck.id}`
        );
      } else {
        this.store.dispatch(setDeck({ deck: this.deck }));
        this.router.navigateByUrl('deckbuilder');
      }
    } else {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        message: 'You are about to open this deck. Are you sure?',
        accept: () => {
          this.store.dispatch(
            setDeck({
              deck: { ...this.deck, id: uuid.v4() },
            })
          );
          this.router.navigateByUrl('/deckbuilder/' + this.deck.id);
        },
      });
    }
  }

  deleteDeck(event: Event) {
    if (this.editable) {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        key: 'Delete',
        message: 'You are about to permanently delete this deck. Are you sure?',
        accept: () => {
          this.store.dispatch(deleteDeck({ deck: this.deck }));
          this.messageService.add({
            severity: 'success',
            summary: 'Deck deleted!',
            detail: 'Deck was deleted successfully!',
          });
          this.closeDialog.emit(true);
        },
      });
    } else {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        key: 'Delete',
        message: 'You are about to permanently delete this deck. Are you sure?',
        accept: () => {
          this.digimonBackendService
            .deleteDeck(this.deck.id)
            .pipe(first())
            .subscribe();
          this.messageService.add({
            severity: 'success',
            summary: 'Deck deleted!',
            detail: 'Deck was deleted successfully!',
          });
          this.closeDialog.emit(true);
        },
      });
    }
  }

  copyDeck(event: Event) {
    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(
          importDeck({
            deck: { ...this.deck, id: uuid.v4() },
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!',
        });
        this.closeDialog.emit(true);
      },
    });
  }

  showExportDeckDialog() {
    this.exportDeckDialog = true;
  }

  createImageOptions(): ICardImage[] {
    return (
      this.mainDeck.map((card) => ({
        name: `${card.id} - ${card.name}`,
        value: card.id,
      })) ?? []
    );
  }

  getLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.editable
      ? `https://digimoncard.app/deckbuilder/user/${this.authService.userData?.uid}/deck/${this.deck.id}`
      : `https://digimoncard.app/deckbuilder/${this.deck.id}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.messageService.add({
      severity: 'success',
      summary: 'Deck-Link saved!',
      detail: 'The deck-link was saved to your clipboard!',
    });
  }

  saveDeck() {
    const deck: IDeck = {
      ...this.deck,
      title: this.deckFormGroup.get('title')?.value,
      description: this.deckFormGroup.get('description')?.value,
      imageCardId: this.deckFormGroup.get('cardImage')?.value.value,
    };

    this.store.dispatch(saveDeck({ deck }));
    this.messageService.add({
      severity: 'success',
      summary: 'Deck saved!',
      detail: 'The deck was saved successfully!',
    });
    this.closeDialog.emit(true);
  }

  getTournamentDeck(deck: IDeck | ITournamentDeck): ITournamentDeck {
    return deck as ITournamentDeck;
  }

  placementString(placement: number): string {
    if (placement === 1) {
      return '1st';
    } else if (placement === 2) {
      return '2nd';
    } else if (placement === 3) {
      return '3th';
    }
    return placement + 'th';
  }

  private getCardImage(imageCardId: string): ICardImage {
    let foundCard = this.allCards.find((card) => card.id === imageCardId);
    if (foundCard) {
      return {
        name: `${foundCard!.id} - ${foundCard!.name}`,
        value: foundCard!.id,
      };
    } else {
      foundCard = this.allCards.find(
        (card) => card.id === this.deck.cards[0].id
      );
      return foundCard
        ? {
            name: `${foundCard!.id} - ${foundCard!.name}`,
            value: foundCard!.id,
          }
        : { name: 'BT1-001 - Yokomon', value: 'BT1-001' };
    }
  }

  mapTournamentSize(size: string) {
    const map = new Map<string, string>([
      ['Small', 'Small (4-8 Player)'],
      ['Medium', 'Medium (8-16 Player)'],
      ['Large', 'Large (16-32 Player)'],
      ['Major', 'Major (32+ Player)'],
    ]);
    return map.get(size);
  }
}
