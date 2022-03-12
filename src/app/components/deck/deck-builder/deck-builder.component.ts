import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Subject, takeUntil} from "rxjs";
import {IDeck} from "../../../models";
import {selectDeck} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.css']
})
export class DeckBuilderComponent implements OnInit, OnDestroy {
  public deck: IDeck = {cards: []};

  public mappedDeck = {
    eggs: [],
    mainDeck: [],
    sideDeck: []
  }

  private onDestroy$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(selectDeck).pipe(takeUntil(this.onDestroy$), filter(value => !!value)).subscribe(deck => this.deck = deck ?? {cards: []});
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
