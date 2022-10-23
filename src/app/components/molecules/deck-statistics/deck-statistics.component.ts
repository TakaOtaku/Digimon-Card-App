import { Component, OnInit } from '@angular/core';
import { ICard, IDeck, IDeckCard } from '../../../../models';
import { DatabaseService } from '../../../service/database.service';
import { filter, first, switchMap, tap } from 'rxjs';
import { mapToDeckCards } from '../../../functions/digimon-card.functions';
import { Store } from '@ngrx/store';
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
    this.store
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
      });
  }

  findMostUsedCards() {
    const cards = this.communityDecks.map((deck) => deck.cards).flat(1);
    const deckCards = mapToDeckCards(cards, this.allCards);
    debugger;
  }
}
