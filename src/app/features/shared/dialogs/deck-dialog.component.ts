import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import { ObscenityPipe } from '../../../pipes/obscenity.pipe';
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
        class="grid max-h-[375px] w-full grid-cols-4 overflow-y-scroll border-2 border-slate-200 md:grid-cols-6 lg:grid-cols-8"
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

      <div *ngIf="!editable; else edit" class="border border-slate-200 p-2">
        <div class="flex flex-col">
          <div class="text-shadow mr-3 text-3xl font-black text-[#e2e4e6]">
            {{ deck?.title }}
          </div>

          <div class="flex flex-row">
            <div>{{ deck?.description }}</div>
            <div
              *ngFor="let tag of deck?.tags"
              class="surface-ground mx-0.5 my-0.5 h-10 rounded-full border border-black px-1.5 text-xs font-bold leading-[35px] lg:mt-2.5"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>
      </div>
      <ng-template #edit [formGroup]="deckFormGroup">
        <div class="my-1 mx-auto grid lg:grid-cols-2">
          <div class="col-span-2 flex flex-row">
            <input
              formControlName="title"
              placeholder="Deck Name:"
              class="mr-2 w-full text-sm"
              pInputText
              type="text"
            />
            <p-dropdown
              styleClass="truncate w-full lg:w-[250px]"
              [options]="cardImageOptions"
              formControlName="cardImage"
              optionLabel="name"
              appendTo="body"
            >
            </p-dropdown>
          </div>
          <textarea
            formControlName="description"
            placeholder="Description:"
            class="h-[66px] w-full overflow-hidden"
            pInputTextarea
          ></textarea>
          <div class="mx-auto flex flex-row align-middle">
            <div
              *ngFor="let tag of deck?.tags"
              class="surface-ground mx-0.5 my-0.5 h-10 rounded-full border border-black px-1.5 text-xs font-bold leading-[35px] lg:mt-2.5"
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
          (click)="openDeck()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Open"
        ></button>
        <button
          (click)="copyDeck()"
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
          (click)="deleteDeck()"
          pButton
          class="p-button-sm lg:p-button p-button-outlined"
          type="button"
          label="Delete"
        ></button>
      </div>
      <ng-template #editButtons>
        <div class="mx-auto mt-1 grid grid-cols-3 lg:grid-cols-5">
          <button
            (click)="openDeck()"
            pButton
            class="p-button-sm lg:p-button p-button-outlined"
            type="button"
            label="Open"
          ></button>
          <button
            (click)="copyDeck()"
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
            (click)="deleteDeck()"
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
  @Input() deck: IDeck;
  @Input() editable = true;

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
    if (!changes['deck'].currentValue) {
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

  openDeck() {
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

  deleteDeck() {
    if (this.editable) {
      this.confirmationService.confirm({
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

  copyDeck() {
    this.confirmationService.confirm({
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
}
