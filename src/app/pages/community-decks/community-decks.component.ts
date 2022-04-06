import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MessageService} from "primeng/api";
import {Subject, takeUntil} from "rxjs";
import * as uuid from "uuid";
import {IDeck} from "../../../models";
import {DatabaseService} from "../../service/database.service";
import {importDeck, setDeck, setSite} from "../../store/digimon.actions";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-community-decks',
  templateUrl: './community-decks.component.html'
})
export class CommunityDecksComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  decks: IDeck[] = [];

  tags = ['BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6', 'BT7', 'BT8', 'EX1', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8', 'Tournament', 'Casual'];
  colors = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Multi'];

  deckRowContext = [
    {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewDeck(this.selectedDeck)},
    {label: 'Copy', icon: 'pi pi-fw pi-copy', command: () => this.copyDeck(this.selectedDeck)}
  ];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private db: DatabaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.db.loadCommunityDecks().pipe(takeUntil(this.onDestroy$)).subscribe(decks => this.decks = decks);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  viewDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to open this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(setDeck({deck: {...deck, id: uuid.v4(), rating: 0, ratingCount: 0}}));
        this.store.dispatch(setSite({site: SITES.DeckBuilder}));
      }
    });
  }

  copyDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(importDeck({deck: {...deck, id: uuid.v4(), rating: 0, ratingCount: 0}}));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!'
        });
      }
    });
  }

  rateDeck(deck: IDeck) {

  }
}
