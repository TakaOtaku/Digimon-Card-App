import { NgClass, NgIf } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUser } from '@models';
import { AuthService } from '@services';
import { DialogStore, SaveStore } from '@store';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'digimon-nav-links',
  template: `
    @if (sidebar) {
      <div class="flex flex-col gap-5 pb-4">
        <div class="flex items-center gap-3">
          <span class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-ink-2 text-muted">
            @if (user(); as u) {
              <img [src]="u.photoUrl" alt="" class="h-full w-full object-cover" />
            } @else {
              <i class="pi pi-user text-xl"></i>
            }
          </span>
          <div class="min-w-0 flex-1">
            <div class="truncate font-semibold text-fg">{{ user()?.displayName || 'Not logged in' }}</div>
            <div class="text-xs text-muted">{{ user() ? 'Decks and collection sync to your account' : 'Log in to sync decks and collection' }}</div>
          </div>
          <button
            type="button"
            (click)="loginLogout(); done.emit()"
            class="h-10 shrink-0 rounded-lg px-4 text-sm font-semibold"
            [ngClass]="user() ? 'border border-line bg-ink-2 text-fg' : 'bg-accent text-accent-ink'">
            {{ user() ? 'Log out' : 'Log in' }}
          </button>
        </div>

        <nav aria-label="All pages" class="grid grid-cols-4 gap-2">
          @for (link of sheetLinks; track link.url) {
            <button
              type="button"
              (click)="go(link.url)"
              [attr.aria-current]="isActive(link.url) ? 'page' : null"
              class="flex flex-col items-center gap-1.5 rounded-xl border bg-ink-2 py-3 text-xs font-medium"
              [ngClass]="isActive(link.url) ? 'border-accent text-accent' : 'border-transparent text-fg'">
              <i [class]="'pi ' + link.icon" style="font-size: 1.25rem"></i>
              {{ link.label }}
            </button>
          }
        </nav>

        <div class="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line">
          <button type="button" (click)="openSettings(); done.emit()" class="flex h-12 items-center gap-3 px-4 text-left text-fg">
            <i class="pi pi-cog text-muted"></i><span class="flex-1">Settings</span><i class="pi pi-chevron-right text-xs text-muted"></i>
          </button>
          <button type="button" (click)="supportDialog = true" class="flex h-12 items-center gap-3 px-4 text-left text-fg">
            <i class="pi pi-heart-fill text-pink-400"></i><span class="flex-1">Support digimoncard.app</span><i class="pi pi-chevron-right text-xs text-muted"></i>
          </button>
          <button type="button" (click)="showChangelog(); done.emit()" class="flex h-12 items-center gap-3 px-4 text-left text-fg">
            <i class="pi pi-sparkles text-muted"></i><span class="flex-1">What's new</span>
            <span class="font-mono text-xs text-muted">v{{ version }}</span><i class="pi pi-chevron-right text-xs text-muted"></i>
          </button>
        </div>

        <div class="flex justify-center gap-6 text-muted">
          <a href="https://github.com/TakaOtaku/Digimon-Card-App" target="_blank" aria-label="GitHub" class="text-muted hover:text-accent"><i class="pi pi-github text-lg"></i></a>
          <a href="https://twitter.com/digimoncardapp" target="_blank" aria-label="X / Twitter" class="text-muted hover:text-accent"><i class="pi pi-twitter text-lg"></i></a>
          <a href="https://discordapp.com/users/189436886744432640" target="_blank" aria-label="Discord" class="text-muted hover:text-accent"><i class="pi pi-discord text-lg"></i></a>
          <a href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank" aria-label="Donate with PayPal" class="text-muted hover:text-accent"><i class="pi pi-paypal text-lg"></i></a>
        </div>
      </div>
    } @else {
      <ul
        [ngClass]="{
          'h-full flex-row ml-4 xl:ml-8': !sidebar,
          'w-[6.5rem] py-5 flex-col justify-between ml-auto': sidebar,
        }"
        class="p-0 my-0 list-none flex">
        <li class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer" [ngClass]="getNavigationBorder('/')" (click)="router.navigateByUrl('')">
          <i class="pi pi-home group-hover:text-accent" style="font-size: 1.5rem"></i>
          <div [ngClass]="{ 'text-accent': route() === '/' }" style="font-size:smaller" class="p-2 group-hover:text-accent">Home</div>
        </li>

        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/cards')"
          (click)="router.navigateByUrl('/cards')">
          <i class="pi pi-clone group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Cards</button>
        </li>

        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/deckbuilder')"
          (click)="router.navigateByUrl('/deckbuilder')">
          <i class="pi pi-pencil group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Deckbuilder</button>
        </li>

        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/collection')"
          (click)="router.navigateByUrl('/collection')">
          <i class="pi pi-folder group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Collection</button>
        </li>

        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/user')"
          (click)="router.navigateByUrl('/user')">
          <i class="pi pi-user group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Profile</button>
        </li>

        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/decks')"
          (click)="router.navigateByUrl('/decks')">
          <i class="pi pi-table group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Decks</button>
        </li>

        <li
          class="hidden xl:flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/rulings')"
          (click)="router.navigateByUrl('/rulings')">
          <i class="pi pi-question-circle group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Rulings</button>
        </li>

        <li
          class="hidden xl:flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="getNavigationBorder('/products')"
          (click)="router.navigateByUrl('/products')">
          <i class="pi pi-tags group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent">Products</button>
        </li>
          <li
            class="flex xl:hidden flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
            [ngClass]="moreActive() ? 'border-b-[3px] border-accent text-accent' : 'text-fg'"
            (click)="moreMenu.toggle($event)">
            <i class="pi pi-ellipsis-h group-hover:text-accent" style="font-size: 1.5rem"></i>
            <button style="font-size:smaller" class="p-2 group-hover:text-accent" aria-haspopup="menu">More</button>
          </li>
      </ul>
      <p-menu #moreMenu [model]="moreItems" [popup]="true" appendTo="body"></p-menu>
      <div class="order-1 ml-3 flex flex-row items-center gap-2">
        <button
          type="button"
          (click)="supportDialog = true"
          aria-label="Support digimoncard.app"
          class="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-ink-2 px-3 text-sm font-semibold text-fg hover:border-pink-400">
          <i class="pi pi-heart-fill text-pink-400"></i><span class="hidden 2xl:inline">Support</span>
        </button>
        <a
          href="/deckbuilder"
          (click)="$event.preventDefault(); router.navigateByUrl('/deckbuilder')"
          class="hidden lg:inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink no-underline">
          <i class="pi pi-plus"></i> Build a deck
        </a>
        <button
          type="button"
          (click)="openSettings()"
          aria-label="Settings"
          class="grid h-10 w-10 place-items-center rounded-full border border-line bg-ink-2 text-fg hover:border-accent">
          <i class="pi pi-cog"></i>
        </button>
        <button
          type="button"
          (click)="loginLogout()"
          [attr.aria-label]="user() ? 'Log out ' + user()?.displayName : 'Log in'"
          [title]="user() ? 'Log out' : 'Log in'"
          class="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line bg-ink-2 text-fg hover:border-accent">
          @if (user(); as u) {
            <img [src]="u.photoUrl" alt="" class="h-full w-full object-cover" />
          } @else {
            <i class="pi pi-user"></i>
          }
        </button>
      </div>
    }

    <p-dialog
      header="Support digimoncard.app"
      [(visible)]="supportDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      appendTo="body"
      styleClass="w-[95vw] max-w-md">
      <div class="flex flex-col gap-4 text-fg">
        <p class="m-0 leading-relaxed">
          digimoncard.app is free, has no ads and is built in my spare time. Hosting, the card image storage and the database are paid out of
          pocket, so every coffee helps keep it running and growing.
        </p>
        <a
          href="https://ko-fi.com/takaotaku"
          target="_blank"
          rel="noopener"
          class="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent font-semibold text-accent-ink no-underline">
          <i class="pi pi-heart-fill"></i> Support on Ko-fi
        </a>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4"
          target="_blank"
          rel="noopener"
          class="flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-ink-2 font-semibold text-fg no-underline hover:border-accent">
          <i class="pi pi-paypal"></i> Donate with PayPal
        </a>
        <p class="m-0 text-sm text-muted">
          Can't donate? Sharing your decks, reporting bugs on Discord or contributing on GitHub helps just as much.
        </p>
      </div>
    </p-dialog>
  `,
  standalone: true,
  imports: [NgClass, NgIf, FontAwesomeModule, ConfirmPopupModule, DialogModule, ButtonModule, MenuModule],
})
export class NavLinksComponent {
  @Input() sidebar = false;
  // Sheet mode: tell the host to close after any action
  @Output() done = new EventEmitter<void>();
  readonly version = '5.0.0';
  supportDialog = false;
  sheetLinks = [
    { url: '/', label: 'Home', icon: 'pi-home' },
    { url: '/cards', label: 'Cards', icon: 'pi-clone' },
    { url: '/deckbuilder', label: 'Build', icon: 'pi-pencil' },
    { url: '/collection', label: 'Collection', icon: 'pi-folder' },
    { url: '/user', label: 'Profile', icon: 'pi-user' },
    { url: '/decks', label: 'Decks', icon: 'pi-table' },
    { url: '/rulings', label: 'Rulings', icon: 'pi-question-circle' },
    { url: '/products', label: 'Products', icon: 'pi-tags' },
  ];
  dialogStore = inject(DialogStore);
  saveStore = inject(SaveStore);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  user: Signal<IUser | null> = this.authService.currentUser;

  mobile = false;
  route: WritableSignal<string> = signal('');
  moreItems: MenuItem[] = [
    { label: 'Rulings', icon: 'pi pi-question-circle', routerLink: '/rulings' },
    { label: 'Products', icon: 'pi pi-tags', routerLink: '/products' },
    { separator: true },
    { label: "What's new", icon: 'pi pi-sparkles', command: () => this.showChangelog() },
  ];
  moreActive = computed(() => ['/rulings', '/products'].includes(this.route()));

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route.set(event.url);
      }
    });
  }

  isActive(url: string): boolean {
    const route = this.route().split('?')[0];
    return url === '/' ? route === '/' : route.startsWith(url);
  }

  go(url: string) {
    this.router.navigateByUrl(url);
    this.done.emit();
  }

  loginLogout() {
    this.authService.currentUser() ? this.authService.logOut() : this.authService.googleAuth();
  }

  getNavigationBorder(route: string): any {
    if (route === '/deckbuilder') {
      const deckOpenOrDeckbuilder = this.route() === '/deckbuilder' || (this.route().includes('/deck/') && this.route().includes('/user/'));
      return {
        'border-l-[3px] border-white': deckOpenOrDeckbuilder && this.sidebar,
        'border-b-[3px] border-accent': deckOpenOrDeckbuilder && !this.sidebar,
        'text-accent': deckOpenOrDeckbuilder,
        'text-fg': !deckOpenOrDeckbuilder,
      };
    } else if (route === '/user') {
      return {
        'border-l-[3px] border-white': this.route().includes(route) && !this.route().includes('deckbuilder') && this.sidebar,
        'border-b-[3px] border-accent':
          this.route().includes(route) && !this.route().includes('deckbuilder') && !this.sidebar,
        'text-accent': this.route().includes(route) && !this.route().includes('deckbuilder'),
        'text-fg': !this.route().includes(route),
      };
    }
    return {
      'border-l-[3px] border-white': this.route() === route && this.sidebar,
      'border-b-[3px] border-accent': this.route() === route && !this.sidebar,
      'text-accent': this.route() === route,
      'text-fg': this.route() !== route,
    };
  }

  openSettings() {
    this.dialogStore.updateSettingsDialog(true);
  }

  showChangelog() {
    this.dialogStore.updateChangelogDialog(true);
  }
}
