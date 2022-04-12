import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {ContextMenu} from "primeng/contextmenu";
import {Subject, takeUntil} from "rxjs";
import * as uuid from "uuid";
import {ICard, IColor, IDeck} from "../../../models";
import {ITag} from "../../../models/interfaces/tag.interface";
import {AuthService} from "../../service/auth.service";
import {DatabaseService} from "../../service/database.service";
import {deleteDeck, importDeck, setDeck, setSite} from "../../store/digimon.actions";
import {selectAllCards, selectDecks} from "../../store/digimon.selectors";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  decks: IDeck[] = [];

  importDialog = false;
  exportDialog = false;
  accessoryDialog = false;

  colors = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Multi'];


  deckRowContext: MenuItem[];

  private cards: ICard[];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.store.select(selectAllCards).pipe(takeUntil(this.onDestroy$)).subscribe(cards => this.cards = cards);
    this.deckRowContext = [
      {
        label:'Open',
        icon:'pi pi-fw pi-info-circle',
        command: () => this.openDeck()
      },
      {
        label:'Copy',
        icon:'pi pi-fw pi-copy',
        command: () => this.store.dispatch(importDeck({deck: {...this.selectedDeck, id: uuid.v4()}}))
      },
      {
        label:'Export',
        icon:'pi pi-fw pi-download',
        command: () => this.exportDialog = true
      },
      {
        label:'Change Accessories',
        icon:'pi pi-fw pi-cog',
        command: () => this.accessoryDialog = true
      },
      {
        separator:true
      },
      {
        label:'Delete',
        icon:'pi pi-fw pi-trash',
        command: () => this.deleteDeck()
      }
    ];
  }

  ngOnInit() {
    this.store.select(selectDecks).pipe(takeUntil(this.onDestroy$)).subscribe(decks => this.decks = decks);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  openImportDialog(): void  {
    this.importDialog = true;
  }

  openDeck(deck?: IDeck): void {
    if(deck) {
      this.store.dispatch(setDeck({deck}));
    } else {
      this.store.dispatch(setDeck({deck: this.selectedDeck}));
    }
    this.store.dispatch(setSite({site: SITES.DeckBuilder}));
  }

  deleteDeck() {
    this.confirmationService.confirm({
      key: 'DeleteDeck',
      message: 'You are about to permanently delete this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(deleteDeck({deck: this.selectedDeck}));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck deleted!',
          detail: 'Deck was deleted successfully!'
        });
      }
    });
  }

  createNewDeck() {
    const deck: IDeck = {
      id: uuid.v4(),
      cards: [],
      title: 'New Deck',
      color: {name: 'White', img: 'assets/decks/white.svg'},
    };
    this.store.dispatch(importDeck({deck}));
  }
}
