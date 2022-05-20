import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, IDeck, TAGS } from '../../../models';
import {
  deleteDeck,
  importDeck,
  setAccessoryDeckDialog,
  setDeck,
  setExportDeckDialog,
  setImportDeckDialog,
  setSite,
} from '../../store/digimon.actions';
import { selectDecks } from '../../store/digimon.selectors';
import { SITES } from '../main-page/main-page.component';

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  decks: IDeck[] = [];

  colors = COLORS;
  tags = TAGS;

  deckRowContext: MenuItem[];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.deckRowContext = [
      {
        label: 'Open',
        icon: 'pi pi-fw pi-info-circle',
        command: () => this.openDeck(),
      },
      {
        label: 'Copy',
        icon: 'pi pi-fw pi-copy',
        command: () =>
          this.store.dispatch(
            importDeck({ deck: { ...this.selectedDeck, id: uuid.v4() } })
          ),
      },
      {
        label: 'Export',
        icon: 'pi pi-fw pi-download',
        command: () =>
          this.store.dispatch(
            setExportDeckDialog({ show: true, deck: this.selectedDeck })
          ),
      },
      {
        label: 'Change Accessories',
        icon: 'pi pi-fw pi-cog',
        command: () =>
          this.store.dispatch(
            setAccessoryDeckDialog({ show: true, deck: this.selectedDeck })
          ),
      },
      {
        separator: true,
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => this.deleteDeck(),
      },
    ];
  }

  ngOnInit() {
    this.store
      .select(selectDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => (this.decks = decks));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  /**
   * Open the import deck dialog
   */
  openImportDialog(): void {
    this.store.dispatch(setImportDeckDialog({ show: true }));
  }

  /**
   * Set the Deck-Builder-Deck and switch to the Deck-Builder
   */
  openDeck(): void {
    this.store.dispatch(setDeck({ deck: this.selectedDeck }));
    this.store.dispatch(setSite({ site: SITES.DeckBuilder }));
  }

  /**
   * Delete a Deck permanently.
   */
  deleteDeck() {
    this.confirmationService.confirm({
      key: 'Delete',
      message: 'You are about to permanently delete this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(deleteDeck({ deck: this.selectedDeck }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deck deleted!',
          detail: 'Deck was deleted successfully!',
        });
      },
    });
  }

  /**
   * Create a new empty Deck
   */
  createNewDeck() {
    const deck: IDeck = {
      id: uuid.v4(),
      cards: [],
      title: 'New Deck',
      color: { name: 'White', img: 'assets/decks/white.svg' },
    };
    this.store.dispatch(importDeck({ deck }));
  }

  showContextMenu(menu: any, event: any, deck: IDeck) {
    this.selectedDeck = deck;
    menu.show(event);
  }
}
