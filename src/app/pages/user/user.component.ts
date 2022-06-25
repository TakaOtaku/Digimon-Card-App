import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, IDeck, TAGS } from '../../../models';
import { deleteDeck, importDeck, setDeck } from '../../store/digimon.actions';
import { selectDecks } from '../../store/digimon.selectors';

/** TODO
 * Check if it is a deck-link, then search for the deck in the database and set the site view to deckbuilder

 private checkForDeckLink() {
  this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      if (event.url.includes('?deck=')) {
        this.databaseService
          .loadDeck(event.url.substring(7))
          .pipe(filter((value) => value.cards.length > 0))
          .subscribe((deck) => {
            this.store.dispatch(
              setDeck({
                deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
              })
            );
            this.store.dispatch(setSite({ site: SITES.DeckBuilder }));
          });
      }
    });
}
 public userId: string;

 constructor(route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.userId = params["id"];
    });
  }
 */

@Component({
  selector: 'digimon-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  decks: IDeck[] = [];

  colors = COLORS;
  tags = TAGS;

  deckRowContext: MenuItem[];

  importDeckDialog = false;
  exportDeckDialog = false;
  accessoryDialog = false;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
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
        command: () => (this.exportDeckDialog = true),
      },
      {
        label: 'Change Accessories',
        icon: 'pi pi-fw pi-cog',
        command: () => (this.accessoryDialog = true),
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
      .subscribe((decks) => {
        try {
          const test = [...new Set(decks)];
          this.decks = test.sort((a, b) => {
            const timeA = new Date(a?.date ?? '').getTime() ?? 0;
            const timeB = new Date(b?.date ?? '').getTime() ?? 0;
            return timeB - timeA || a.title!.localeCompare(b.title!);
          });
        } catch (e) {
          this.decks = decks;
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
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
    this.messageService.add({
      severity: 'success',
      summary: 'New Deck created!',
      detail: 'A new Deck was created successfully!',
    });
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
   * Set the Deck-Builder-Deck and switch to the Deck-Builder
   */
  openDeck(): void {
    this.store.dispatch(setDeck({ deck: this.selectedDeck }));
    this.router.navigateByUrl('');
  }

  showContextMenu(menu: any, event: any, deck: IDeck) {
    this.selectedDeck = deck;
    menu.show(event);
  }
}
