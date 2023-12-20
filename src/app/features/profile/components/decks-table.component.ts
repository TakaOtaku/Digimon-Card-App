import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { first } from 'rxjs';
import { DigimonCard, IDeck } from '../../../../models';
import { setDeckImage } from '../../../functions/digimon-card.functions';
import { selectAllCards } from '../../../store/digimon.selectors';
import { DeckActions } from '../../../store/digimon.actions';

@Component({
  selector: 'digimon-decks-table',
  template: `
    <p-table
      *ngIf="allCards$ | async as allCards"
      [value]="decks"
      [scrollable]="true"
      [tableStyle]="{ 'min-width': '30rem' }"
      [breakpoint]="'0px'"
      sortField="name"
      sortMode="single"
      scrollHeight="650px"
      rowGroupMode="subheader"
      groupRowsBy="color.name"
      tableStyleClass="w-full">
      <ng-template pTemplate="header">
        <tr>
          <th></th>
          <th>Name</th>
          <th class="hidden md:table-cell">Description</th>
          <th class="hidden md:table-cell">Set</th>
          <th class="hidden md:table-cell">Date</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="groupheader" let-deck>
        <tr class="mt-[-ß.5rem]" pRowGroupHeader>
          <td class="py-3" colspan="5">
            <div class="flex flex-row">
              <div
                [ngClass]="deck.color.name"
                class="ml-3 mr-1 h-7 w-7 rounded-full"></div>
              <span class="ml-2 font-bold">{{ deck.color.name }} Decks</span>

              <div class="ml-auto mr-2 font-bold">
                Total {{ deck.color.name }} Decks:
                {{ decksWithColor(deck.color.name) }}
              </div>
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-deck let-rowIndex="rowIndex">
        <tr class="cursor-pointer" (click)="onDeckClick.emit(deck)">
          <td>
            <div
              class="surface-card relative h-16 w-56 border border-black"
              defaultImage="assets/images/digimon-card-back.webp"
              [lazyLoad]="getCardImage(deck, allCards)"
              [ngStyle]="{
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-position-y': '25%'
              }"></div>
          </td>
          <td class="text-xs font-bold">
            {{ deck.title }}
          </td>
          <td class="text-xs hidden md:table-cell">
            {{ deck.description }}
          </td>
          <td class="text-xs mx-auto hidden md:table-cell">
            <div *ngFor="let tag of deck.tags" class="mr-2">{{ tag.name }}</div>
          </td>
          <td class="text-center text-xs hidden md:table-cell">
            {{ deck.date | date: 'dd.MM.YY' }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [
    `
      td,
      th {
        padding: 0.2rem 0 0 !important;
      }
    `,
  ],
  standalone: true,
  imports: [
    NgIf,
    TableModule,
    SharedModule,
    NgClass,
    LazyLoadImageModule,
    NgStyle,
    NgFor,
    AsyncPipe,
    DatePipe,
  ],
})
export class DecksTableComponent {
  @Input() decks: IDeck[];
  @Output() onDeckClick = new EventEmitter<IDeck>();

  allCards: DigimonCard[] = [];
  allCards$ = this.store.select(selectAllCards);

  constructor(private store: Store) {
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((cards) => {
        this.allCards = cards;
      });
  }

  getCardImage(deck: IDeck, allCards: DigimonCard[]): string {
    //If there are no cards in the deck set it to the Yokomon
    if (!deck.cards || deck.cards.length === 0 || allCards.length === 0) {
      return '../../../assets/images/cards/eng/BT1-001.webp';
    }

    // If there is a ImageCardId set it
    if (deck.imageCardId) {
      return (
        allCards.find((card) => card.id === deck.imageCardId)?.cardImage ??
        '../../../assets/images/cards/eng/BT1-001.webp'
      );
    } else {
      const deckImage = setDeckImage(deck, this.allCards);
      this.store.dispatch(
        DeckActions.save({ deck: { ...deck, imageCardId: deckImage.id } }),
      );
      return deckImage.cardImage;
    }
  }

  decksWithColor(color: string) {
    return this.decks.filter((deck) => deck.color.name === color).length;
  }
}
