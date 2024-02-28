import { NgFor, SlicePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IDeck, IDeckCard } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';

@Component({
  selector: 'digimon-deck-statistics',
  template: `
    <div class="flex flex-col overflow-hidden">
      <div class="my-1 w-full border border-slate-200 p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-[#e2e4e6]">
          All Cards
        </h1>
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 lg:overflow-x-hidden">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="max-h-[200px] overflow-x-hidden overflow-y-scroll">
              <table class="min-w-full overflow-x-hidden">
                <thead class="surface-card border-b">
                  <tr>
                    <th
                      scope="col"
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of mostUsedCards | slice: 0 : 50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150">
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.name.english }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="my-1 w-full border border-slate-200 p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-[#e2e4e6]">
          Digimon Cards
        </h1>
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 lg:overflow-x-hidden">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="max-h-[200px] overflow-x-hidden overflow-y-scroll">
              <table class="min-w-full overflow-x-hidden">
                <thead class="surface-card border-b">
                  <tr>
                    <th
                      scope="col"
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Digimon')
                        | slice: 0 : 50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150">
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.name.english }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="my-1 w-full border border-slate-200 p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-[#e2e4e6]">
          Tamer Cards
        </h1>
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 lg:overflow-x-hidden">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="max-h-[200px] overflow-x-hidden overflow-y-scroll">
              <table class="min-w-full overflow-x-hidden">
                <thead class="surface-card border-b">
                  <tr>
                    <th
                      scope="col"
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Tamer')
                        | slice: 0 : 50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150">
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.name.english }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="my-1 w-full border border-slate-200 p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-[#e2e4e6]">
          Option Cards
        </h1>
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 lg:overflow-x-hidden">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="max-h-[200px] overflow-x-hidden overflow-y-scroll">
              <table class="min-w-full overflow-x-hidden">
                <thead class="surface-card border-b">
                  <tr>
                    <th
                      scope="col"
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]">
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Option')
                        | slice: 0 : 50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150">
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.name.english }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]">
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgFor, SlicePipe, FormsModule],
})
export class DeckStatisticsComponent implements OnInit, OnDestroy {
  @Input() decks: IDeck[];
  @Input() updateCards: Subject<boolean>;
  @Input() loading: boolean;
  @Output() loadingChange = new EventEmitter<boolean>();

  mostUsedCards: IDeckCard[] = [];

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject();

  ngOnInit() {
    this.updateCards
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.findMostUsedCards());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  findMostUsedCards() {
    this.loadingChange.emit(true);
    const cards = mapToDeckCards(
      this.decks.map((deck) => deck.cards).flat(1),
      this.digimonCardStore.cards(),
    );

    let checked: string[] = [];
    const cardsWithCount = cards
      .map((card) => {
        if (checked.includes(card.cardNumber)) {
          return;
        }
        const count = getCountFromDeckCards(
          cards.filter((value) => value.cardNumber === card.cardNumber),
        );

        checked.push(card.cardNumber);
        return { ...card, count } as IDeckCard;
      })
      .filter((value1) => value1 !== undefined && value1.name && value1.id)
      .sort((a, b) => b!.count - a!.count);

    this.mostUsedCards = cardsWithCount.slice(1) as IDeckCard[];
    this.loadingChange.emit(false);
  }

  percentInDecks(search: IDeckCard) {
    const inHowManyDecks = this.decks.filter((deck) => {
      return deck.cards.find((card) => card.id.includes(search.cardNumber));
    }).length;

    return ((inHowManyDecks / this.decks.length) * 100).toFixed(2);
  }

  averagePlayed(search: IDeckCard) {
    const inWhichDecks = this.decks.filter((deck) =>
      deck.cards.find((card) => card.id.includes(search.cardNumber)),
    );

    let howOftenInTheDecks = 0;
    inWhichDecks.forEach((deck) => {
      howOftenInTheDecks += getCountFromDeckCards(
        deck.cards.filter((card) => card.id.includes(search.cardNumber)),
      );
    });

    return (howOftenInTheDecks / inWhichDecks.length).toFixed(2);
  }

  filter(cards: IDeckCard[], search: string): IDeckCard[] {
    return cards.filter((card) => card.cardType === search);
  }
}
