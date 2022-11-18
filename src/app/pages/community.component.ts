import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ConfirmationService,
  FilterService,
  MessageService,
} from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, ICard, IDeck, TAGS } from '../../models';
import { mapToDeckCards } from '../functions/digimon-card.functions';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';
import { importDeck, setDeck } from '../store/digimon.actions';
import {
  selectAllCards,
  selectCommunityDecks,
  selectCommunityDeckSearch,
} from '../store/digimon.selectors';

@Component({
  selector: 'digimon-community',
  template: `
    <div class="h-[calc(100vh-58px)] overflow-y-scroll">
      <p-contextMenu #table [model]="deckRowContext"></p-contextMenu>
      <div class="surface-card flex flex-col p-2">
        <span
          [ngStyle]="{ display: 'inline-flex' }"
          class="p-input-icon-left w-full"
        >
          <i class="pi pi-search h-3"></i>
          <input
            [formControl]="searchFilter"
            class="h-6 w-full text-xs"
            pInputText
            placeholder="Search for cards! (Name or ID e.g. BT3-063"
            type="text"
          />
        </span>
      </div>

      <p-table
        [(contextMenuSelection)]="selectedDeck"
        [contextMenu]="table"
        [globalFilterFields]="[
          '',
          'color.name',
          'title',
          'tags.0.name',
          '',
          '',
          '',
          '',
          'user',
          ''
        ]"
        [paginator]="true"
        [rowsPerPageOptions]="[25, 50, 75]"
        [rows]="25"
        [scrollable]="true"
        [showCurrentPageReport]="true"
        [value]="decks"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} decks"
        dataKey="title"
        styleClass="p-datatable-striped"
      >
        <ng-template pTemplate="header">
          <tr>
            <th class="max-w-[30px] p-0"></th>
            <th class="max-w-[70px] p-0">
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
            <th class="max-w-[400px] p-0">
              Title
              <p-columnFilter
                display="menu"
                field="title"
                type="text"
              ></p-columnFilter>
            </th>
            <th class="max-w-[300px] p-0">
              Tags
              <p-columnFilter
                display="menu"
                field="tags.0.name"
                matchMode="contains"
              >
                <ng-template
                  let-filter="filterCallback"
                  let-value
                  pTemplate="filter"
                >
                  <p-dropdown
                    (onChange)="filter($event.value)"
                    [ngModel]="value"
                    [options]="tags"
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
            <th class="max-w-[400px] p-0">Description</th>
            <th class="max-w-[400px] p-0">Color</th>
            <th class="max-w-[400px] p-0">Level</th>
            <th class="max-w-[400px] p-0">Card-Types</th>
            <th class="max-w-[400px] p-0">
              User
              <p-columnFilter
                display="menu"
                field="user"
                type="text"
              ></p-columnFilter>
            </th>
            <th class="max-w-[400px] p-0" pSortableColumn="date">
              Date
              <p-sortIcon field="date"></p-sortIcon>
            </th>
          </tr>
        </ng-template>
        <ng-template let-deck let-expanded="expanded" pTemplate="body">
          <tr class="max-h-[50px]" [pContextMenuRow]="deck">
            <td class="max-w-[30px] p-0">
              <button
                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                [pRowToggler]="deck"
                class="p-button-text p-button-rounded p-button-plain"
                pButton
                pRipple
                type="button"
              ></button>
            </td>
            <td class="inline-flex max-w-[70px] p-0">
              <img
                [src]="deck.color?.img ?? 'assets/decks/white.svg'"
                alt="Digimon Deck Image"
                class="mx-auto max-h-[50px]"
              />
            </td>
            <td
              (click)="showContextMenu(table, $event, deck)"
              class="cursor-pointer p-0"
            >
              {{ deck.title }}
            </td>
            <td class="max-w-[300px] p-0">
              <p-chip
                *ngFor="let tag of deck.tags"
                label="{{ tag.name }}"
              ></p-chip>
            </td>
            <td class="max-w-[400px] overflow-hidden whitespace-nowrap p-0">
              <p class="animate-scroll">
                {{ deck.description }}
              </p>
            </td>
            <td class="max-w-[400px] p-0">
              <digimon-color-spread
                class="mx-0.5 w-full"
                [deck]="deck"
                [allCards]="allCards"
              ></digimon-color-spread>
            </td>
            <td class="max-w-[400px] p-0">
              <digimon-level-spread
                class="mx-0.5 w-full"
                [deck]="deck"
                [allCards]="allCards"
              ></digimon-level-spread>
            </td>
            <td class="max-w-[400px] p-0">
              <digimon-ddto-spread
                class="mx-0.5 w-full"
                [deck]="deck"
                [allCards]="allCards"
              ></digimon-ddto-spread>
            </td>
            <td class="max-w-[400px] p-0">
              {{ deck.user }}
            </td>
            <td class="max-w-[400px] p-0">
              {{ deck.date | date: 'dd.MM.yyyy' }}
            </td>
          </tr>
        </ng-template>
        <ng-template let-deck pTemplate="rowexpansion">
          <tr>
            <td colspan="7">
              <div class="card-list surface-card flex flex-wrap pt-3">
                <div *ngFor="let card of deck.cards">
                  <digimon-small-card
                    [card]="card"
                    [cards]="allCards"
                  ></digimon-small-card>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <div class="h-24 w-full lg:hidden"></div>
    </div>
  `,
})
export class CommunityComponent implements OnInit, OnDestroy {
  public selectedDeck: IDeck;
  public decks: IDeck[] = [];
  private allDecks: IDeck[] = [];

  searchFilter = new FormControl('');

  public tags = TAGS;
  public colors = COLORS;

  public deckRowContext = [
    {
      label: 'View',
      icon: 'pi pi-fw pi-search',
      command: () => this.viewDeck(this.selectedDeck),
    },
    {
      label: 'Copy',
      icon: 'pi pi-fw pi-copy',
      command: () => this.copyDeck(this.selectedDeck),
    },
    {
      label: 'Get Link',
      icon: 'pi pi-fw pi-share-alt',
      command: () => this.copyLink(this.selectedDeck),
    },
  ];

  public allCards: ICard[] = [];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private filterService: FilterService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();

    this.onSearch();

    this.store
      .select(selectCommunityDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        this.allDecks = [...decks].sort((a, b) => {
          const aTime = new Date(a.date!).getTime();
          const bTime = new Date(b.date!).getTime();
          return bTime - aTime;
        });
        this.decks = this.allDecks;
        this.filterDecks(this.searchFilter.value);
      });
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));

    this.store
      .select(selectCommunityDeckSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((search) => {
        this.searchFilter.setValue(search);
        this.filterDecks(search);
      });

    this.filterService.register('array-some', (value: any[], filters: any) => {
      if (filters === undefined || filters === null || filters.length === 0) {
        return true;
      }

      return value.some((v) => filters.includes(v));
    });

    if (this.authService.isLoggedIn) {
      if (
        this.authService.userData?.uid === 'S3rWXPtCYRN8vSrxY3qE6aeewy43' ||
        this.authService.userData?.uid === 'loBLZPOIL0ZlDzt6A1rgDiTomTw2'
      ) {
        this.deckRowContext.push({
          label: 'Delete',
          icon: 'pi pi-fw pi-delete',
          command: () => this.delete(this.selectedDeck),
        });
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Community');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Meta decks, fun decks, tournament decks and many more, find new decks for every set.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Meta, decks, tournament, fun',
      },
    ]);
  }

  viewDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to open this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(
          setDeck({
            deck: { ...deck, id: uuid.v4() },
          })
        );
        this.router.navigateByUrl('/deckbuilder/' + deck.id);
      },
    });
  }

  copyDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.store.dispatch(
          importDeck({
            deck: { ...deck, id: uuid.v4() },
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!',
        });
      },
    });
  }

  copyLink(deck: IDeck) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = 'https://digimoncard.app/deckbuilder/' + deck.id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.messageService.add({
      severity: 'success',
      summary: 'Link copied!',
      detail: 'The link was copied to your clipboard!',
    });
  }

  delete(deck: IDeck) {
    const sub: Subscription = this.digimonBackendService
      .deleteDeck(deck.id)
      .subscribe((value) => sub.unsubscribe());

    this.decks = this.decks.filter((currentDeck) => currentDeck.id !== deck.id);

    this.messageService.add({
      severity: 'success',
      summary: 'Deck delted!',
      detail: 'The deck was deleted!',
    });
  }

  dateFormat(date: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(date, 'MMM d, y, h:mm:ss a')!;
  }

  showContextMenu(menu: ContextMenu, event: MouseEvent, deck: IDeck) {
    this.selectedDeck = deck;
    event.stopPropagation();
    event.preventDefault();
    menu.show(event);
  }

  onSearch() {
    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.filterDecks(value);
      });
  }

  private filterDecks(filter: string) {
    this.decks = this.allDecks.filter((deck) => {
      const deckCards = mapToDeckCards(deck.cards, this.allCards);
      return !!deckCards.find(
        (card) =>
          card.id?.includes(filter) ||
          card.name?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      );
    });
  }
}
