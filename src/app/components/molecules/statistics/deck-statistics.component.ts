import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, switchMap, tap } from 'rxjs';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import {
  selectAllCards,
  selectCommunityDecks,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-statistics',
  template: `<div class="w-full border-2 border-slate-500 p-1">
    <h1
      class="mb-2 w-full text-center text-3xl font-extrabold uppercase text-white"
    >
      Community Deck Statistics
    </h1>
    <div class="flex flex-col gap-1 overflow-x-hidden lg:grid lg:grid-cols-2">
      <div class="w-full p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-white">All Cards</h1>
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 lg:overflow-x-hidden">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="max-h-[200px] overflow-x-hidden overflow-y-scroll">
              <table class="min-w-full overflow-x-hidden">
                <thead class="surface-card border-b">
                  <tr>
                    <th
                      scope="col"
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of mostUsedCards | slice: 0:50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                  >
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-white">
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
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Digimon')
                        | slice: 0:50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                  >
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-white">
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
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Tamer') | slice: 0:50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                  >
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ averagePlayed(card) }}x
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-1">
        <h1 class="mb-2 w-full text-xl font-extrabold text-white">
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
                      class="max-w-[50px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      class="maw-w-[150px] px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Card
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Played
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      % of Decks
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      # Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="
                      let card of filter(mostUsedCards, 'Option') | slice: 0:50;
                      let i = index
                    "
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                  >
                    <td
                      class="max-w-[50px] whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ i + 1 }}.
                    </td>
                    <td
                      class="max-w-[150px] overflow-hidden whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.cardNumber }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ card.count }}x
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ percentInDecks(card) }}%
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
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
  </div> `,
})
export class DeckStatisticsComponent implements OnInit {
  mostUsedCards: IDeckCard[] = [];
  allCards: ICard[] = [];
  communityDecks: IDeck[] = [];

  constructor(
    private store: Store,
    private digimonBackendService: DigimonBackendService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectAllCards)
      .pipe(
        first(),
        tap((allCards) => (this.allCards = allCards)),
        switchMap(() =>
          this.store.select(selectCommunityDecks).pipe(
            filter((value) => value != null && value.length > 0),
            first()
          )
        )
      )
      .subscribe((decks) => {
        this.communityDecks = decks;
        this.findMostUsedCards();
      });
  }

  findMostUsedCards() {
    const cards = mapToDeckCards(
      this.communityDecks.map((deck) => deck.cards).flat(1),
      this.allCards
    );

    let checked: string[] = [];
    const cardsWithCount = cards
      .map((card) => {
        if (checked.includes(card.cardNumber)) {
          return;
        }
        const count = getCountFromDeckCards(
          cards.filter((value) => value.cardNumber === card.cardNumber)
        );

        checked.push(card.cardNumber);
        return { ...card, count } as IDeckCard;
      })
      .filter((value1) => value1 !== undefined)
      .sort((a, b) => b!.count - a!.count);

    this.mostUsedCards = cardsWithCount as IDeckCard[];
  }

  percentInDecks(search: IDeckCard) {
    const inHowManyDecks = this.communityDecks.filter((deck) => {
      return deck.cards.find((card) => card.id.includes(search.cardNumber));
    }).length;

    return ((inHowManyDecks / this.communityDecks.length) * 100).toFixed(2);
  }

  averagePlayed(search: IDeckCard) {
    const inWhichDecks = this.communityDecks.filter((deck) =>
      deck.cards.find((card) => card.id.includes(search.cardNumber))
    );

    let howOftenInTheDecks = 0;
    inWhichDecks.forEach((deck) => {
      howOftenInTheDecks += getCountFromDeckCards(
        deck.cards.filter((card) => card.id.includes(search.cardNumber))
      );
    });

    return (howOftenInTheDecks / inWhichDecks.length).toFixed(2);
  }

  filter(cards: IDeckCard[], search: string): IDeckCard[] {
    return cards.filter((card) => card.cardType === search);
  }
}
