import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, ICard, ICountCard, IDeck, IUser, TAGS } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { deleteDeck, importDeck, setDeck } from '../../store/digimon.actions';
import { selectAllCards, selectDecks } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-decks',
  template: `<div class="border-2 border-slate-500 text-white">
    <p-contextMenu #table [model]="deckRowContext"></p-contextMenu>
    <p-table
      [(contextMenuSelection)]="selectedDeck"
      [contextMenu]="table"
      [globalFilterFields]="[
        'color.name',
        'title',
        'tags',
        '',
        ' ',
        '',
        '',
        'user'
      ]"
      [scrollHeight]="'calc(100vh - 48px)'"
      [scrollable]="true"
      [showCurrentPageReport]="true"
      [value]="decks"
      responsiveLayout="scroll"
      styleClass="p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr class="p-0">
          <th class="mx-auto max-w-[70px] p-0">
            Color
            <p-columnFilter
              display="menu"
              field="color.name"
              matchMode="equals"
            >
              <ng-template
                let-filter="filterCallback"
                let-value
                pTemplate="filter"
              >
                <p-dropdown
                  (onChange)="filter($event.value)"
                  [ngModel]="value"
                  [options]="colors"
                  placeholder="Any"
                >
                  <ng-template let-option pTemplate="item">
                    <span [class]="'customer-badge status-' + option">{{
                      option
                    }}</span>
                  </ng-template>
                </p-dropdown>
              </ng-template>
            </p-columnFilter>
          </th>
          <th class="max-w-[600px] p-0 text-center">
            Title
            <p-columnFilter
              display="menu"
              field="title"
              type="text"
            ></p-columnFilter>
          </th>
          <th class="max-w-[100px] p-0 text-center">Tags</th>
          <th class="max-w-[200px] p-0 text-center">Description</th>
          <th class="max-w-[200px] p-0 text-center">Color</th>
          <th class="max-w-[200px] p-0 text-center">Level</th>
          <th class="max-w-[200px] p-0 text-center">Card-Types</th>
        </tr>
      </ng-template>
      <ng-template let-deck pTemplate="body">
        <tr [pContextMenuRow]="deck" class="max-h-[50px]">
          <td class="inline-flex max-w-[70px] p-0">
            <img
              [src]="deck.color?.img ?? 'assets/decks/white.svg'"
              alt="Digimon Deck Image"
              class="mx-auto max-h-[50px]"
            />
          </td>
          <td
            (click)="showContextMenu(table, $event, deck)"
            class="max-w-[600px] cursor-pointer truncate p-0"
          >
            {{ deck.title }}
          </td>
          <td class="max-w-[100px] p-0">
            <p-chip
              *ngFor="let tag of deck.tags"
              label="{{ tag.name }}"
            ></p-chip>
          </td>
          <td class="max-w-[200px] overflow-hidden whitespace-nowrap p-0">
            <p class="animate-scroll">
              {{ deck.description }}
            </p>
          </td>
          <td class="max-w-[200px] p-0">
            <digimon-color-spread
              class="mx-0.5 w-full"
              [deck]="deck"
              [allCards]="allCards"
            ></digimon-color-spread>
          </td>
          <td class="max-w-[200px] p-0">
            <digimon-level-spread
              class="mx-0.5 w-full"
              [deck]="deck"
              [allCards]="allCards"
            ></digimon-level-spread>
          </td>
          <td class="max-w-[200px] p-0">
            <digimon-ddto-spread
              class="mx-0.5 w-full"
              [deck]="deck"
              [allCards]="allCards"
            ></digimon-ddto-spread>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      header="Export Deck"
      [showHeader]="false"
      [(visible)]="exportDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      ><digimon-export-deck-dialog></digimon-export-deck-dialog
    ></p-dialog>

    <p-dialog
      header="Import Deck"
      [showHeader]="false"
      [(visible)]="importDeckDialog"
      styleClass="w-[100%] min-w-[250px] sm:min-w-[500px] sm:w-[700px] min-h-[500px]"
      [baseZIndex]="10000"
      ><digimon-import-deck-dialog></digimon-import-deck-dialog
    ></p-dialog>

    <p-dialog
      [showHeader]="false"
      header="Change Accessory"
      [(visible)]="accessoryDialog"
      styleClass="w-[95vw] xl:w-[50vw] h-[400px]"
      [baseZIndex]="10000"
      ><digimon-change-accessorie-dialog></digimon-change-accessorie-dialog
    ></p-dialog>
  </div> `,
})
export class DecksComponent implements OnInit, OnDestroy {
  @Input() decks: IDeck[] = [];
  selectedDeck: IDeck;

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

  allCards: ICard[] = [];

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
          this.decks = test.sort((a, b) => a.title!.localeCompare(b.title!));
          //this.decks = test.sort((a, b) => {
          //  const timeA = new Date(a?.date ?? '').getTime() ?? 0;
          //  const timeB = new Date(b?.date ?? '').getTime() ?? 0;
          //  return timeB - timeA || a.title!.localeCompare(b.title!);
          //});
        } catch (e) {
          this.decks = decks;
        }
      });
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));
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

  showContextMenu(menu: ContextMenu, event: MouseEvent, deck: IDeck) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedDeck = deck;
    menu.show(event);
  }
}
