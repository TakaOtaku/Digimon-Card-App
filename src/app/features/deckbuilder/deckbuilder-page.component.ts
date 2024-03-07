import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { filter, map, of, switchMap, tap } from 'rxjs';
import * as uuid from 'uuid';
import { emptySave } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { SaveStore } from '../../store/save.store';
import { WebsiteStore } from '../../store/website.store';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { FilterAndSearchComponent } from '../shared/filter/filter-and-search.component';
import { PageComponent } from '../shared/page.component';
import { DeckStatsComponent } from './components/deck-stats.component';
import { DeckViewComponent } from './components/deck-view.component';

@Component({
  selector: 'digimon-deckbuilder-page',
  template: `
    @if ((checkUrl$ | async) !== false) {
      <digimon-page>
        <digimon-deck-view
          *ngIf="deckView"
          class="overflow-y-auto pb-[10rem] h-full max-h-full overflow-x-hidden self-baseline"
          [ngClass]="{
            'w-2/5 max-w-[40%]': collectionView,
            'w-full': !collectionView
          }"
          [collectionView]="collectionView"
          (hideStats)="statsDisplay = !statsDisplay"></digimon-deck-view>

        <digimon-pagination-card-list
          *ngIf="collectionView"
          [initialWidth]="3"
          [ngClass]="{ 'w-3/5 max-w-[60%]': deckView, 'w-full': !deckView }"
          class="border-l max-h-full border-slate-200 flex flex-row  h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] lg:h-screen"></digimon-pagination-card-list>

        <button
          class="surface-card w-6 border-l border-slate-200"
          (click)="changeView()">
          <span
            class="w-full h-[calc(100%-4rem)] md:h-[calc(100%-5.5rem)] lg:h-[calc(100%-0.5rem)] rotate-180 text-center font-bold text-[#e2e4e6]"
            [ngStyle]="{ writingMode: 'vertical-rl' }"
            >{{ collectionView ? 'Hide Card View' : 'Show Card View' }}</span
          >
        </button>

        @if (statsDisplay && deckView) {
          <digimon-deck-stats
            class="fixed left-0 lg:left-[6.5rem] z-[300]"
            [collectionView]="collectionView"></digimon-deck-stats>
        }
      </digimon-page>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgIf,
    NgStyle,
    DeckViewComponent,
    DeckStatsComponent,
    FilterAndSearchComponent,
    AsyncPipe,
    PaginationCardListComponent,
    PageComponent,
  ],
})
export class DeckbuilderPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  digimonBackendService = inject(DigimonBackendService);
  authService = inject(AuthService);
  meta = inject(Meta);
  title = inject(Title);

  saveStore = inject(SaveStore);
  websiteStore = inject(WebsiteStore);

  collectionView = true;
  deckView = true;

  statsDisplay = true;

  checkUrl$ = this.route.params.pipe(
    filter(
      (params) => !!params['id'] || (!!params['userId'] && !!params['deckId']),
    ),
    switchMap((params) => {
      if (params['userId'] && params['deckId']) {
        this.deckId = params['deckId'];
        return this.digimonBackendService.getSave(params['userId']);
      } else if (params['id']) {
        this.deckId = params['id'];
        return this.digimonBackendService.getDeck(params['id']).pipe(
          map((deck) => {
            return { ...emptySave, decks: [deck] };
          }),
        );
      } else {
        return of(emptySave);
      }
    }),
    tap((save) => {
      if (save.decks.length === 0) return;

      const foundDeck = save.decks.find((deck) => deck.id === this.deckId);
      if (!foundDeck) return;

      const sameUser = save.uid === this.authService.userData?.uid;

      // Set a new UID if it is a new user, otherwise keep the old one
      this.websiteStore.updateDeck({
        ...foundDeck,
        id: sameUser ? foundDeck.id : uuid.v4(),
      });
    }),
    switchMap(() => of(true)),
  );

  private deckId = '';

  ngOnInit() {
    this.onResize();

    this.makeGoogleFriendly();
  }

  changeView() {
    if (window.innerWidth < 1024) {
      this.collectionView = !this.collectionView;
      this.deckView = !this.collectionView;
    } else {
      this.collectionView = !this.collectionView;
    }
  }

  private onResize() {
    if (window.innerWidth < 1024) {
      this.collectionView = false;
      this.deckView = true;
    } else {
      this.collectionView = true;
      this.deckView = true;
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
}
