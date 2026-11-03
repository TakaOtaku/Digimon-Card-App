import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IDeck } from '@models';
import { AuthService } from '@services';
import { SaveStore, WebsiteStore } from '@store';

@Component({
  selector: 'digimon-home-intro',
  template: `
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 md:px-6 md:py-12">
      <section class="flex flex-wrap items-stretch gap-6">
        <div class="flex min-w-0 flex-[999_1_32rem] flex-col justify-center gap-5">
          <h1 class="m-0 font-display text-4xl font-bold leading-none text-fg md:text-6xl">Build. Track. Share.</h1>
          <p class="m-0 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Deck builder, collection tracker and card database for the Digimon Card Game. Card data is loaded once a day from
            <span class="font-semibold text-fg">DigimonCardGame.Fandom</span>, thanks to their effort.
          </p>
          <div class="flex flex-wrap gap-3">
            <a routerLink="/cards" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-semibold text-accent-ink no-underline">
              <i class="pi pi-search"></i> Search cards
            </a>
            <a
              routerLink="/deckbuilder"
              class="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-ink-2 px-5 font-semibold text-fg no-underline hover:border-accent">
              <i class="pi pi-plus"></i> New deck
            </a>
          </div>
        </div>

        <div class="flex min-w-0 flex-[1_1_20rem] flex-col gap-3 rounded-xl border border-line bg-ink-1 p-5">
          <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Continue building</h2>
          @for (deck of recentDecks(); track deck.id) {
            <button
              type="button"
              (click)="openDeck(deck)"
              class="flex items-center gap-3 rounded-lg border border-transparent bg-ink-2 p-3 text-left text-fg hover:border-accent">
              <span class="h-3 w-3 shrink-0 rounded-full" [ngClass]="deck.color?.name"></span>
              <span class="min-w-0 flex-1 truncate font-medium">{{ deck.title || 'Untitled deck' }}</span>
              <span class="font-mono text-xs text-muted">{{ cardCount(deck) }} cards</span>
            </button>
          } @empty {
            <p class="m-0 text-sm text-muted">Your saved decks show up here.</p>
          }
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        @for (action of actions; track action.url) {
          <a [routerLink]="action.url" class="flex items-start gap-4 rounded-xl border border-line bg-ink-1 p-5 text-fg no-underline hover:border-accent">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-2 text-accent">
              <i [class]="'pi ' + action.icon"></i>
            </span>
            <span class="flex flex-col gap-1">
              <span class="font-semibold">{{ action.title }}</span>
              <span class="text-sm leading-snug text-muted">{{ action.text }}</span>
            </span>
          </a>
        }
      </section>

      <section class="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
        <div class="flex min-w-0 flex-[1_1_28rem] flex-col gap-3">
          <h2 class="m-0 font-display text-xl font-semibold text-fg">Help shape Digimoncard.app</h2>
          <p class="m-0 text-sm leading-relaxed text-muted">
            Feedback and suggestions are always welcome on Discord and GitHub. I'm also <span class="font-semibold text-fg">looking for people</span>
            who want to help maintain the website, design new features and implement them.
          </p>
          <a href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank" class="self-start">
            <img src="assets/images/blue.png" alt="Donate with PayPal" class="h-11" width="183" height="44" />
          </a>
        </div>

        <div class="flex flex-col gap-3">
          <h2 class="m-0 text-xs font-semibold uppercase tracking-wider text-muted">Partners</h2>
          <div class="flex flex-row gap-6">
            @for (partner of partners; track partner.name) {
              <a class="flex flex-col items-center gap-1 text-fg no-underline" [href]="partner.url" target="_blank">
                <img class="h-14 w-14 rounded-full object-cover" [src]="partner.img" [alt]="partner.name" width="56" height="56" />
                <span class="text-xs font-semibold">{{ partner.name }}</span>
              </a>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, RouterLink],
})
export class HomeIntroComponent {
  private saveStore = inject(SaveStore);
  private websiteStore = inject(WebsiteStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  recentDecks = computed(() =>
    [...(this.saveStore.decks() ?? [])].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)).slice(0, 3),
  );

  actions = [
    { url: '/cards', icon: 'pi-search', title: 'Card search', text: 'Filter every card by color, level, set and effect.' },
    { url: '/deckbuilder', icon: 'pi-pencil', title: 'Deck builder', text: 'Build, import, test and price-check decks.' },
    { url: '/collection', icon: 'pi-folder', title: 'Collection', text: 'Track owned cards and set completion.' },
    { url: '/decks', icon: 'pi-table', title: 'Community decks', text: 'Browse shared decks and the archetype tier list.' },
  ];

  partners = [
    { name: 'AVAULT', url: 'https://www.youtube.com/@AVAULT', img: 'assets/images/partners/avault.jpg' },
    { name: 'Digimon TCG DACH', url: 'https://discord.gg/digimon-tcg-dach-759562127513223168', img: 'assets/images/partners/dach.png' },
    { name: 'East', url: 'https://www.youtube.com/East_ML', img: 'assets/images/partners/east.jpg' },
  ];

  cardCount(deck: IDeck): number {
    return (deck.cards ?? []).reduce((sum, card) => sum + card.count, 0);
  }

  // Same flow as opening your own deck from the deck dialog
  openDeck(deck: IDeck) {
    if (this.authService.isLoggedIn) {
      this.router.navigateByUrl(`deckbuilder/user/${this.authService.currentUser()!.uid}/deck/${deck.id}`);
    } else {
      this.websiteStore.updateDeck(deck);
      this.router.navigateByUrl('deckbuilder');
    }
  }
}
