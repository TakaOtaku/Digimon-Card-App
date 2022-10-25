import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, switchMap, tap } from 'rxjs';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';
import { DatabaseService } from '../../../service/database.service';
import { selectAllCards } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-statistics',
  templateUrl: './deck-statistics.component.html',
})
export class DeckStatisticsComponent implements OnInit {
  mostUsedCards: IDeckCard[] = [];
  allCards: ICard[] = [];
  communityDecks: IDeck[] = [];

  constructor(private store: Store, private dbService: DatabaseService) {}

  ngOnInit(): void {
    const subscription = this.store
      .select(selectAllCards)
      .pipe(
        tap((allCards) => (this.allCards = allCards)),
        switchMap(() =>
          this.dbService.loadCommunityDecks().pipe(
            filter((value) => value != null && value.length > 0),
            first()
          )
        )
      )
      .subscribe((decks) => {
        this.communityDecks = decks;
        this.findMostUsedCards();
        subscription.unsubscribe();
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
