import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Subject, takeUntil } from "rxjs";
import * as uuid from "uuid";
import { COLORS, ICountCard, IDeck, IUser, TAGS } from "../../../../models";
import { AuthService } from "../../../service/auth.service";
import { DatabaseService } from "../../../service/database.service";
import { deleteDeck, importDeck, setDeck } from "../../../store/digimon.actions";
import { selectDecks } from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.css'],
})
export class DecksComponent implements OnInit, OnDestroy {
  selectedDeck: IDeck;
  @Input() decks: IDeck[] = [];

  colors = COLORS;
  tags = TAGS;

  deckRowContext: MenuItem[];

  importDeckDialog = false;
  exportDeckDialog = false;
  accessoryDialog = false;

  collection: ICountCard[];
  user: IUser;

  correctUser = false;
  params = '';

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private store: Store,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        () =>
          (this.correctUser =
            this.authService.userData?.uid === 'user/' + this.params)
      );

    this.route.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => (this.params = params['id'] ?? ''));

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
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl(
        `deckbuilder/user/${this.authService.userData?.uid}/deck/${this.selectedDeck.id}`
      );
    } else {
      this.store.dispatch(setDeck({ deck: this.selectedDeck }));
      this.router.navigateByUrl('deckbuilder');
    }
  }

  showContextMenu(menu: any, event: any, deck: IDeck) {
    this.selectedDeck = deck;
    menu.show(event);
  }
}
