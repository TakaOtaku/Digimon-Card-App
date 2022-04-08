import {Component, OnDestroy} from '@angular/core';
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
export class DecksComponent implements OnDestroy {
  deck: IDeck;
  decks$ = this.store.select(selectDecks);

  importDialog = false;
  exportDialog = false;
  accessoryDialog = false;

  title: string;
  description: string;
  tags: ITag[];
  color: IColor;

  deckContext: MenuItem[];

  private cards: ICard[];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private db: DatabaseService
  ) {
    this.store.select(selectAllCards).pipe(takeUntil(this.onDestroy$)).subscribe(cards => this.cards = cards);
    this.deckContext = [
      {
        label:'Open',
        icon:'pi pi-fw pi-info-circle',
        command: () => this.openDeck()
      },
      //{
      //  label:'Share',
      //  icon:'pi pi-fw pi-share-alt',
      //  command: () => {
      //    this.confirmationService.confirm({
      //      message: 'You are about to share the deck. Are you sure?',
      //      accept: () => this.share()
      //    });
      //  }
      //},
      {
        label:'Copy',
        icon:'pi pi-fw pi-copy',
        command: () => this.store.dispatch(importDeck({deck: {...this.deck, id: uuid.v4()}}))
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
      this.store.dispatch(setDeck({deck: this.deck}));
    }
    this.store.dispatch(setSite({site: SITES.DeckBuilder}));
  }

  share() {
    if(this.getCardCount() !== 50) {
      this.messageService.add({severity:'error', summary:'Deck is not ready!', detail:'Deck was can not be shared! You don\'t have 50 cards.'});
      return;
    }

    this.confirmationService.confirm({
      message: 'You are about to share the deck. Are you sure?',
      accept: () => {
        this.db.shareDeck(this.deck, this.authService.userData);
        this.messageService.add({severity:'success', summary:'Deck shared!', detail:'Deck was shared successfully!'});
      }
    });
  }

  getCardCount(): number {
    let count = 0;
    this.deck.cards.forEach(card => {
      const foundCard = this.cards.find(b => card.id === b.cardNumber);
      if (foundCard?.cardLv !== 'Lv.2') {
        count += card.count
      }
    });

    return count;
  }

  deleteDeck() {
    this.confirmationService.confirm({
      key: 'DeleteDeck',
      message: 'You are about to permanently delete this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(deleteDeck({deck: this.deck}));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck deleted!',
          detail: 'Deck was deleted successfully!'
        });
      }
    });
  }

  onContextMenu(deck: IDeck) {
    this.deck = deck;
    this.title = deck.title ?? '';
    this.description = deck.description ?? '';
    this.tags = deck.tags ?? [];
    this.color = deck.color ?? {name: 'Red', img: 'assets/decks/red.svg'};
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

  onLeftMouseClick(event: MouseEvent, contextMenu: ContextMenu, deck: IDeck): void {
    this.onContextMenu(deck);
    event.stopPropagation();
    event.preventDefault();
    contextMenu.show(event);
  }
}
