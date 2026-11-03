import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Database, get, ref } from '@angular/fire/database';
import { Router, RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '@directives';
import { ensureCdnUrl } from '@functions';
import { IDeck } from '@models';
import { MongoBackendService } from '@services';
import { DigimonCardStore, WebsiteStore } from '@store';
import { catchError, of } from 'rxjs';

interface TierDeck {
  name: string;
  image: string;
  card: string;
}

// Same tiers and colors as the full tier list on /decks; Home shows the top three
const TIERS = [
  { tier: 'S', color: 'bg-red-500' },
  { tier: 'A', color: 'bg-orange-500' },
  { tier: 'B', color: 'bg-yellow-500' },
];

@Component({
  selector: 'digimon-home-meta',
  template: `
    @if (tiers().length) {
      <section class="flex flex-col gap-4">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="m-0 font-display text-2xl font-semibold text-fg">Meta right now</h2>
          <a routerLink="/decks" class="text-sm text-accent no-underline hover:underline">Full tier list and statistics</a>
        </div>
        <div class="overflow-hidden rounded-xl border border-line bg-ink-1">
          @for (row of tiers(); track row.tier) {
            <div class="flex items-stretch border-b border-line last:border-b-0">
              <div class="grid w-16 shrink-0 place-items-center font-display text-3xl font-bold text-ink-0" [ngClass]="row.color">{{ row.tier }}</div>
              <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto p-3">
                @for (deck of row.decks; track deck.name) {
                  <button
                    type="button"
                    (click)="searchArchetype(deck)"
                    class="flex w-40 shrink-0 items-center gap-2 rounded-lg bg-ink-2 p-2 text-left text-fg hover:outline hover:outline-1 hover:outline-accent">
                    <img [src]="cdn(deck.image)" alt="" class="h-12 w-9 shrink-0 rounded object-cover" />
                    <span class="text-sm font-semibold leading-tight">{{ deck.name }}</span>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </section>
    }

    @if (topDecks().length) {
      <section class="flex flex-col gap-4">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="m-0 font-display text-2xl font-semibold text-fg">Community decks</h2>
          <a routerLink="/decks" class="text-sm text-accent no-underline hover:underline">Browse all decks</a>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          @for (deck of topDecks(); track deck.id) {
            <a [routerLink]="['/deck', deck.id]" class="flex flex-col overflow-hidden rounded-xl border border-line bg-ink-1 text-fg no-underline hover:border-accent">
              <img [digimonImgFallback]="leadImage(deck)" alt="" class="h-40 w-full object-cover object-top" />
              <span class="flex flex-col gap-1 p-4">
                <span class="truncate font-display text-lg font-semibold">{{ deck.title || 'Untitled deck' }}</span>
                <span class="flex items-center gap-2 text-sm text-muted">
                  <span class="h-2.5 w-2.5 rounded-full" [ngClass]="deck.color?.name"></span>
                  by {{ deck.user || 'unknown' }}
                </span>
              </span>
            </a>
          }
        </div>
      </section>
    }
  `,
  host: { class: 'flex flex-col gap-10' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, RouterLink, ImgFallbackDirective],
})
export class HomeMetaComponent {
  private db = inject(Database);
  private router = inject(Router);
  private websiteStore = inject(WebsiteStore);
  private digimonCardStore = inject(DigimonCardStore);

  tiers = signal<{ tier: string; color: string; decks: TierDeck[] }[]>([]);
  topDecks = toSignal(inject(MongoBackendService).getTopDecks(4).pipe(catchError(() => of([] as IDeck[]))), { initialValue: [] as IDeck[] });
  cdn = ensureCdnUrl;

  constructor() {
    // One read instead of the live listener the full tier list uses
    get(ref(this.db, 'tierlist'))
      .then((snapshot) => {
        const data = snapshot.val();
        const tierlist: TierDeck[][] = Array.isArray(data) ? data : (data?.tierlist ?? []);
        this.tiers.set(
          TIERS.map((t, i) => ({ ...t, decks: tierlist[i] ?? [] })).filter((t) => t.decks.length > 0),
        );
      })
      .catch(() => this.tiers.set([]));
  }

  leadImage(deck: IDeck): string {
    return this.digimonCardStore.cardsMap().get(deck.imageCardId)?.cardImage ?? 'assets/images/digimon-card-back.webp';
  }

  searchArchetype(deck: TierDeck) {
    this.websiteStore.updateCommunityDeckSearch(deck.card);
    this.router.navigateByUrl('/decks');
  }
}
