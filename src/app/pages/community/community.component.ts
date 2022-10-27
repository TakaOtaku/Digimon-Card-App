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
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, ICard, IDeck, TAGS } from '../../../models';
import { mapToDeckCards } from '../../functions/digimon-card.functions';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { importDeck, setDeck } from '../../store/digimon.actions';
import {
  selectAllCards,
  selectCommunityDeckSearch,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-community',
  templateUrl: './community.component.html',
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
    private db: DatabaseService,
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

    this.db
      .loadCommunityDecks()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        this.allDecks = decks.sort(
          (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
        );
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
            deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
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
            deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
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
    this.db.deleteDeck(deck.id);

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
