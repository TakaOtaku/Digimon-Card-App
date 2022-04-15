import {DatePipe} from "@angular/common";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MessageService} from "primeng/api";
import {Subject, takeUntil} from "rxjs";
import * as uuid from "uuid";
import {COLORS, IDeck, TAGS} from "../../../models";
import {DatabaseService} from "../../service/database.service";
import {importDeck, setDeck, setEdit, setSite} from "../../store/digimon.actions";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-community-decks',
  templateUrl: './community-decks.component.html',
  styleUrls: ['./community-decks.component.scss'],
})
export class CommunityDecksComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  decks: IDeck[] = [];

  tags = TAGS;
  colors = COLORS;

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
    this.db.loadCommunityDecks().pipe(takeUntil(this.onDestroy$))
      .subscribe(decks => this.decks = decks.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  viewDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to open this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(setEdit({edit: false}));
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

  dateFormat(date: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(date, 'MMM d, y, h:mm:ss a')!;
  }
}
