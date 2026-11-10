import { SeoService } from '@services';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, of, switchMap, tap } from 'rxjs';
import * as uuid from 'uuid';
import { emptySave } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { MongoBackendService } from '../../services/mongo-backend.service';
import { SaveStore } from '../../store/save.store';
import { WebsiteStore } from '../../store/website.store';
import { PaginationCardListComponent } from '../collection/components/pagination-card-list.component';
import { PageComponent } from '../shared/page.component';
import { DeckStatsComponent } from './components/deck-stats.component';
import { DeckViewComponent } from './components/deck-view.component';

@Component({
  selector: 'digimon-deckbuilder-page',
  template: `
    <h1 class="sr-only">Deck builder</h1>
    @if ((checkUrl$ | async) !== false) {
      <digimon-page>
        <digimon-deck-view
          *ngIf="deckView"
          class="overflow-y-auto pb-[10rem] xl:pb-4 h-full max-h-full overflow-x-hidden self-baseline"
          [ngClass]="{
            'w-2/5 max-w-[40%] xl:w-[36%] xl:max-w-[36%]': collectionView,
            'w-full': !collectionView,
          }"
          [collectionView]="collectionView"
          [poolVisible]="collectionView"
          [showcase]="!collectionView && wide"
          (togglePool)="changeView()"></digimon-deck-view>

        <digimon-pagination-card-list
          *ngIf="collectionView"
          [initialWidth]="3"
          [bottomInset]="true"
          [filterBoxEnabled]="false"
          [ngClass]="{ 'w-3/5 max-w-[60%] xl:w-auto xl:max-w-none xl:flex-1 xl:min-w-0': deckView, 'w-full': !deckView }"
          class="border-l max-h-full border-line flex flex-row  h-[calc(var(--app-vh)-7.5rem)] md:h-[calc(var(--app-vh)-5rem)]"></digimon-pagination-card-list>


        @if (statsDisplay && deckView) {
          <digimon-deck-stats class="fixed left-0 z-[300] hidden lg:block xl:hidden" [collectionView]="collectionView" [hideable]="true" (hide)="statsDisplay = false"></digimon-deck-stats>
        }
        @if (statsDisplay && deckView) {
          <!-- Wide screens: stats get their own column instead of the fixed bottom strip -->
          <digimon-deck-stats
            [column]="true"
            [hideable]="true"
            (hide)="statsDisplay = false"
            class="hidden xl:flex w-[20rem] shrink-0 h-full overflow-y-auto border-l border-line bg-ink-1 p-4"></digimon-deck-stats>
        }
        @if (!statsDisplay && deckView) {
          <button type="button" (click)="statsDisplay = true" class="fixed right-0 top-28 z-[300] hidden h-10 items-center gap-1.5 rounded-l-lg border border-r-0 border-line bg-ink-1 px-3 text-xs font-semibold text-fg hover:border-accent lg:flex" aria-label="Show deck stats">
            <i class="pi pi-angle-double-left"></i> Stats
          </button>
        }
        @if (mobileTab === 'stats') {
          <digimon-deck-stats [column]="true" class="lg:hidden flex w-full h-full overflow-y-auto p-4 pb-20"></digimon-deck-stats>
        }
      </digimon-page>

      <div role="tablist" aria-label="Builder view" class="lg:hidden fixed inset-x-3 bottom-[4.5rem] z-[350] flex gap-1 rounded-xl border border-line bg-ink-1 p-1 shadow-lg">
        @for (tab of mobileTabs; track tab.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="mobileTab === tab.id"
            (click)="setMobileTab(tab.id)"
            class="h-10 flex-1 rounded-lg text-sm font-semibold"
            [ngClass]="mobileTab === tab.id ? 'bg-line text-fg' : 'text-muted'">
            {{ tab.id === 'deck' ? 'Deck ' + deckCount() : tab.label }}
          </button>
        }
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgIf, DeckViewComponent, DeckStatsComponent, AsyncPipe, PaginationCardListComponent, PageComponent],
})
export class DeckbuilderPageComponent implements OnInit {
  private seo = inject(SeoService);
  route = inject(ActivatedRoute);
  mongoBackendService = inject(MongoBackendService);
  authService = inject(AuthService);

  saveStore = inject(SaveStore);
  websiteStore = inject(WebsiteStore);

  deckCount = () => this.websiteStore.deck().cards.reduce((n, c) => n + c.count, 0);
  collectionView = true;
  deckView = true;

  statsDisplay = true;

  checkUrl$ = this.route.params.pipe(
    filter((params) => !!params['id'] || (!!params['userId'] && !!params['deckId'])),
    switchMap((params) => {
      if (params['userId'] && params['deckId']) {
        this.deckId = params['deckId'];
        return this.mongoBackendService.getSave(params['userId']);
      } else if (params['id']) {
        this.deckId = params['id'];
        return this.mongoBackendService.getDeck(params['id']).pipe(
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

      const sameUser = save.uid === this.authService.currentUser()?.uid;

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

  // Phones (< lg) show one of pool / deck / stats at a time
  mobileTabs = [
    { id: 'pool', label: 'Pool' },
    { id: 'deck', label: 'Deck' },
    { id: 'stats', label: 'Stats' },
  ] as const;
  mobileTab: 'pool' | 'deck' | 'stats' = 'deck';

  setMobileTab(tab: 'pool' | 'deck' | 'stats') {
    this.mobileTab = tab;
    this.collectionView = tab === 'pool';
    this.deckView = tab === 'deck';
  }

  // lg and up; phones switch views with the Pool / Deck / Stats tabs instead
  wide = true;

  private onResize() {
    // Prerendering has no window; render the desktop layout
    this.wide = typeof window === 'undefined' || window.innerWidth >= 1024;
    if (!this.wide) {
      this.collectionView = false;
      this.deckView = true;
    } else {
      this.collectionView = true;
      this.deckView = true;
    }
  }

  private makeGoogleFriendly() {
    this.seo.set('Deck builder', 'Build Digimon TCG decks with level curves, deck checks, test hands, price checks and image export, then share them.');
  }
}
