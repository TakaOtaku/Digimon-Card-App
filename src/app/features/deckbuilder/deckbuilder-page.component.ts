import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, of, Subject, switchMap } from 'rxjs';
import * as uuid from 'uuid';
import { IDeck, ISave } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { setDeck } from '../../store/digimon.actions';
import { selectMobileCollectionView } from '../../store/digimon.selectors';
import { CardListComponent } from '../collection/components/card-list.component';
import { CollectionViewComponent } from '../collection/components/collection-view.component';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { DeckStatsComponent } from './components/deck-stats.component';
import { DeckViewComponent } from './components/deck-view.component';

@Component({
  selector: 'digimon-deckbuilder-page',
  template: `
    <div [ngClass]="{ hidden: mobileCollectionView$ | async }" class="relative inline-flex h-full w-full flex-row overflow-hidden lg:bg-gradient-to-b lg:from-[#17212f] lg:to-[#08528d]">
      <button *ngIf="showAccordionButtons" class="surface-card h-full w-6 border-r border-slate-200" (click)="changeView('Deck')">
        <span class="h-full w-full rotate-180 text-center font-bold text-[#e2e4e6]" [ngStyle]="{ writingMode: 'vertical-rl' }">{{ deckView ? 'Hide Deck View' : 'Show Deck View' }}</span>
      </button>
      <digimon-deck-view
        *ngIf="deckView"
        [ngClass]="{ 'w-5/12': collectionView, 'w-full': !collectionView }"
        [collectionView]="collectionView"
        (hideStats)="hideStats = !hideStats"></digimon-deck-view>

      <digimon-collection-view *ngIf="collectionView" [ngClass]="{ 'w-7/12': deckView, 'w-full': !deckView }" class="border-l border-slate-200" [deckView]="deckView"></digimon-collection-view>
      <button *ngIf="showAccordionButtons" class="surface-card h-full w-6 border-l border-slate-200" (click)="changeView('Collection')">
        <span class="h-full w-full rotate-180 text-center font-bold text-[#e2e4e6]" [ngStyle]="{ writingMode: 'vertical-rl' }">{{ collectionView ? 'Hide Card View' : 'Show Card View' }}</span>
      </button>

      <digimon-deck-stats class="fixed z-[300]" [ngClass]="{ hidden: hideStats }" [collectionView]="collectionView" [showStats]="showStats"></digimon-deck-stats>
    </div>

    <div class="h-full w-full" [ngClass]="{ hidden: (mobileCollectionView$ | async) === false }">
      <digimon-filter-and-search></digimon-filter-and-search>
      <digimon-card-list [showCount]="32"></digimon-card-list>
    </div>
  `,
  standalone: true,
  imports: [NgClass, NgIf, NgStyle, DeckViewComponent, CollectionViewComponent, DeckStatsComponent, FilterAndSearchComponent, CardListComponent, AsyncPipe],
})
export class DeckbuilderPageComponent implements OnInit, OnDestroy {
  //region Accordions
  deckView = true;
  collectionView = true;
  showAccordionButtons = true;
  showStats = true;
  //endregion

  mobileCollectionView$ = this.store.select(selectMobileCollectionView);
  hideStats = false;

  private deckId = '';

  private screenWidth: number;
  private onDestroy$ = new Subject();

  constructor(private route: ActivatedRoute, private store: Store, private digimonBackendService: DigimonBackendService, private authService: AuthService, private meta: Meta, private title: Title) {}

  ngOnInit() {
    this.onResize();

    this.makeGoogleFriendly();

    this.checkURL();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
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

  @HostListener('window:resize', ['$event'])
  private onResize() {
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

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Deck Builder');

    this.meta.addTags([
      {
        name: 'description',
        content: 'Build tournament winning decks with the best deck builder for the Digimon TCG and share them with the community or your friends.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Digimon, decks, deck builder, tournament, TCG, community, friends, share',
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
            return this.digimonBackendService.getSave(params['userId']).pipe(first());
          } else {
            this.digimonBackendService.getDeck(params['id']).subscribe((deck) => {
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
}
