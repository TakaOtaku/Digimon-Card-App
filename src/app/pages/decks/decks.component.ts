import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import * as uuid from "uuid";
import {IColor, IDeck} from "../../../models";
import {changeDeck, deleteDeck, importDeck, setDeck, setSite} from "../../store/digimon.actions";
import {selectDecks} from "../../store/digimon.selectors";
import {SITES} from "../main-page/main-page.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent {
  deck: IDeck;
  decks$ = this.store.select(selectDecks);

  title: string;
  description: string;
  color: IColor = {name: 'Red', img: 'assets/decks/red.svg'};
  colorList: IColor[] = [
    {name: 'Red', img: 'assets/decks/red.svg'},
    {name: 'Blue', img: 'assets/decks/blue.svg'},
    {name: 'Yellow', img: 'assets/decks/yellow.svg'},
    {name: 'Green', img: 'assets/decks/green.svg'},
    {name: 'Black', img: 'assets/decks/black.svg'},
    {name: 'Purple', img: 'assets/decks/purple.svg'},
    {name: 'White', img: 'assets/decks/white.svg'}
  ];
  colorMap = new Map<string, string>([
    ['Red', '#e7002c'],
    ['Blue', '#0097e1'],
    ['Yellow', '#fee100'],
    ['Green', '#009c6b'],
    ['Black', '#211813'],
    ['Purple', '#6555a2'],
    ['White', '#ffffff'],
  ]);

  importDialog = false;
  exportDialog = false;
  accessoryDialog = false;

  deckContext: MenuItem[];


  constructor(
    private store: Store,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.deckContext = [
      {
        label:'Open',
        icon:'pi pi-fw pi-trash',
        command: () => this.openDeck()
      },
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

  saveDeck(): void {
    this.store.dispatch(changeDeck({
      deck: {...this.deck,
        title: this.title,
        description: this.description,
        color: this.color}
    }));
    this.accessoryDialog = false;
    this.messageService.add({severity:'success', summary:'Deck saved!', detail:'Deck Accessory was saved successfully!'});
  }

  deleteDeck() {
    this.confirmationService.confirm({
      key: 'DeleteDeck',
      message: 'You are about to permanently delete this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(deleteDeck({deck: this.deck}));
        this.messageService.add({severity:'success', summary:'Deck deleted!', detail:'Deck was deleted successfully!'});
      }
    });
  }

  onContextMenu(deck: IDeck) {
    this.deck = deck;
    this.title = deck.title ?? '';
    this.description = deck.description ?? '';
  }
}
