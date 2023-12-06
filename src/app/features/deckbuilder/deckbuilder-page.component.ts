import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, of, Subject, switchMap } from 'rxjs';
import * as uuid from 'uuid';
import { IDeck, ISave } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { CardListComponent } from '../collection/components/card-list.component';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { WebsiteActions } from '../../store/digimon.actions';
import { DeckStatsComponent } from './components/deck-stats.component';
import { DeckViewComponent } from './components/deck-view.component';

@Component({
  selector: 'digimon-deckbuilder-page',
  template: `
    <div
      class="relative flex flex-row
      min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[100vh] max-h-[100vh] w-[100vw] lg:w-[calc(100vw-6.5rem)]
      overflow-hidden bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <digimon-deck-view
        *ngIf="deckView"
        class="overflow-y-auto"
        [ngClass]="{ 'w-6/12': collectionView, 'w-full': !collectionView }"
        [collectionView]="collectionView"
        (hideStats)="hideStats = !hideStats"></digimon-deck-view>

      <digimon-pagination-card-list
        *ngIf="collectionView"
        [initialWidth]="3"
        [ngClass]="{ 'w-6/12': deckView, 'w-full': !deckView }"
        class="border-l border-slate-200"></digimon-pagination-card-list>
      <button
        class="surface-card h-full w-6 border-l border-slate-200"
        (click)="changeView()">
        <span
          class="h-full w-full rotate-180 text-center font-bold text-[#e2e4e6]"
          [ngStyle]="{ writingMode: 'vertical-rl' }"
          >{{ collectionView ? 'Hide Card View' : 'Show Card View' }}</span
        >
      </button>

      @if (hideStats) {
        <digimon-deck-stats
          class="fixed z-[300]"
          [collectionView]="collectionView"
          [showStats]="showStats"></digimon-deck-stats>
      }
    </div>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgStyle,
    DeckViewComponent,
    DeckStatsComponent,
    FilterAndSearchComponent,
    CardListComponent,
    AsyncPipe,
    PaginationCardListComponent,
  ],
})
export class DeckbuilderPageComponent implements OnInit, OnDestroy {
  collectionView = true;
  deckView = true;

  showStats = true;

  hideStats = false;

  private deckId = '';

  private screenWidth: number;
  private onDestroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private meta: Meta,
    private title: Title,
  ) {}

  ngOnInit() {
    this.onResize();

    this.makeGoogleFriendly();

    this.checkURL();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  changeView() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1024) {
      this.collectionView = !this.collectionView;
      this.deckView = !this.collectionView;
    } else {
      this.collectionView = !this.collectionView;
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1024) {
      this.collectionView = false;
      this.deckView = true;

      this.showStats = true;
    } else {
      this.collectionView = true;
      this.deckView = true;

      this.showStats = true;
    }
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Deck Builder');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Build tournament winning decks with the best deck builder for the Digimon TCG and share them with the community or your friends.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, decks, deck builder, tournament, TCG, community, friends, share',
      },
    ]);
  }

  private checkURL() {
    this.route.params
      .pipe(
        first(),
        filter((params) => {
          return !!params['id'] || (!!params['userId'] && !!params['deckId']);
        }),
        switchMap((params) => {
          if (params['userId'] && params['deckId']) {
            this.deckId = params['deckId'];
            return this.digimonBackendService
              .getSave(params['userId'])
              .pipe(first());
          } else {
            this.digimonBackendService
              .getDeck(params['id'])
              .subscribe((deck) => {
                this.store.dispatch(
                  WebsiteActions.setDeck({
                    deck: { ...deck, id: uuid.v4() },
                  }),
                );
              });
            return of(false);
          }
        }),
      )
      .subscribe((save) => {
        if (!save) {
          return;
        }
        const iSave = save as unknown as ISave;

        const foundDeck = iSave.decks.find((deck) => deck.id === this.deckId);
        if (!foundDeck) {
          return;
        }

        const iDeck = foundDeck as unknown as IDeck;
        const sameUser = iSave.uid === this.authService.userData?.uid;

        this.store.dispatch(
          WebsiteActions.setDeck({
            deck: {
              ...iDeck,
              id: sameUser ? iDeck.id : uuid.v4(),
            },
          }),
        );
      });
  }
}
