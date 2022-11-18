import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, of, Subject, switchMap, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { IDeck, ISave } from '../../models';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';
import { setDeck } from '../store/digimon.actions';
import { selectMobileCollectionView } from '../store/digimon.selectors';

@Component({
  selector: 'digimon-deckbuilder',
  template: `
    <div
      [ngClass]="{ hidden: mobileCollectionView }"
      class="relative inline-flex h-[calc(100vh-50px)] w-full flex-row overflow-hidden"
    >
      <button
        *ngIf="showAccordionButtons"
        class="primary-background my-1 h-full w-6 border-y border-slate-200"
        (click)="changeView('Deck')"
      >
        <span
          class="h-full w-full rotate-180 text-center font-bold text-white"
          [ngStyle]="{ writingMode: 'vertical-rl' }"
          >{{ deckView ? 'Hide Deck View' : 'Show Deck View' }}</span
        >
      </button>
      <div
        *ngIf="deckView"
        class="my-1 mr-1 h-full justify-center overflow-x-hidden overflow-y-scroll border border-slate-200"
        [ngClass]="{ 'w-5/12': collectionView, 'w-full': !collectionView }"
      >
        <digimon-deck-view
          [collectionView]="collectionView"
          (hideStats)="hideStats = !hideStats"
        ></digimon-deck-view>
      </div>

      <div
        *ngIf="collectionView"
        class="my-1 h-full max-h-full"
        [ngClass]="{ 'w-7/12': deckView, 'w-full': !deckView }"
      >
        <digimon-collection-view
          class="h-full max-h-full"
          [deckView]="deckView"
        ></digimon-collection-view>
      </div>
      <button
        *ngIf="showAccordionButtons"
        class="primary-background my-1 h-full w-6 border-y border-slate-200"
        (click)="changeView('Collection')"
      >
        <span
          class="h-full w-full rotate-180 text-center font-bold text-white"
          [ngStyle]="{ writingMode: 'vertical-rl' }"
          >{{ collectionView ? 'Hide Card View' : 'Show Card View' }}</span
        >
      </button>

      <digimon-deck-stats
        class="fixed z-[300]"
        [ngClass]="{ hidden: hideStats }"
        [collectionView]="collectionView"
        [showStats]="showStats"
      ></digimon-deck-stats>
    </div>

    <div
      [ngClass]="{ hidden: !mobileCollectionView }"
      class="h-[calc(100vh-58px)] overflow-y-scroll"
    >
      <div class="h-full w-full">
        <digimon-filter-and-search
          [compact]="true"
          class="w-100"
        ></digimon-filter-and-search>
        <digimon-card-list [showCount]="32"></digimon-card-list>
        <div class="h-24 w-full lg:hidden"></div>
      </div>
    </div>
  `,
})
export class DeckbuilderComponent implements OnInit, OnDestroy {
  //region Accordions
  deckView = true;
  collectionView = true;
  showAccordionButtons = true;
  showStats = true;
  //endregion

  mobileCollectionView = false;
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
    private title: Title
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.makeGoogleFriendly();

    this.store
      .select(selectMobileCollectionView)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (mobileCollectionView) =>
          (this.mobileCollectionView = mobileCollectionView)
      );

    this.checkURL();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
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

  checkURL() {
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
                  setDeck({
                    deck: { ...deck, id: uuid.v4() },
                  })
                );
              });
            return of(false);
          }
        })
      )
      .subscribe((save) => {
        //http://localhost:4200/user/S3rWXPtCYRN8vSrxY3qE6aeewy43/deck/160a3fb2-3703-4183-9f52-65411dfd080e
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
          setDeck({
            deck: {
              ...iDeck,
              id: sameUser ? iDeck.id : uuid.v4(),
            },
          })
        );
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 768) {
      this.deckView = true;
      this.collectionView = false;

      this.showStats = true;

      this.showAccordionButtons = false;
    } else if (this.screenWidth >= 768 && this.screenWidth < 1024) {
      this.deckView = false;
      this.collectionView = true;

      this.showStats = false;

      this.showAccordionButtons = true;
    } else {
      this.deckView = true;
      this.collectionView = true;

      this.showStats = true;

      this.showAccordionButtons = true;
    }
  }

  changeView(view: string) {
    if (view === 'Deck') {
      this.deckView = !this.deckView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.collectionView = false;
          this.showStats = true;
          return;
        }
      }

      if (!this.collectionView) {
        this.collectionView = true;
      }
    } else if (view === 'Collection') {
      this.collectionView = !this.collectionView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.deckView = false;
          this.showStats = false;
          return;
        }
      }

      if (!this.deckView) {
        this.deckView = true;
      }
    }

    this.showStats = !(this.collectionView && !this.deckView);
  }
}
