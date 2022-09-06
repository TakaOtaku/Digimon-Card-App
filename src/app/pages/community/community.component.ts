import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ConfirmationService,
  FilterService,
  MessageService,
  SelectItem,
} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { COLORS, ICard, IDeck, TAGS } from '../../../models';
import { DatabaseService } from '../../service/database.service';
import { importDeck, setDeck } from '../../store/digimon.actions';
import { selectAllCards } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-community',
  templateUrl: './community.component.html',
})
export class CommunityComponent implements OnInit, OnDestroy {
  public selectedDeck: IDeck;
  public decks: IDeck[] = [];

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.db
      .loadCommunityDecks()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (decks) =>
          (this.decks = decks.sort(
            (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
          ))
      );
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));

    this.filterService.register('array-some', (value: any[], filters: any) => {
      debugger;
      if (filters === undefined || filters === null || filters.length === 0) {
        return true;
      }

      return value.some((v) => filters.includes(v));
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
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
        this.router.navigateByUrl('/deck/' + deck.id);
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
    selBox.value = 'https://digimoncard.app/deck/' + deck.id;
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

  dateFormat(date: Date): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(date, 'MMM d, y, h:mm:ss a')!;
  }

  showContextMenu(menu: any, event: any, deck: IDeck) {
    this.selectedDeck = deck;
    menu.show(event);
  }
}
