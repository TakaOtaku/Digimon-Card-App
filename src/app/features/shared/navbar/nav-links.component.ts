import { NgClass, NgIf } from '@angular/common';
import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
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

      @if (sidebar) {
      <li
        class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
        [ngClass]="getNavigationBorder('/rulings')"
        (click)="router.navigateByUrl('/rulings')">
        <i class="pi pi-question-circle group-hover:text-accent" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-accent">Rulings</button>
      </li>

      <li
        class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
        [ngClass]="getNavigationBorder('/products')"
        (click)="router.navigateByUrl('/products')">
        <i class="pi pi-tags group-hover:text-accent" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-accent">Products</button>
      </li>
      } @else {
        <li
          class="flex flex-col items-center justify-center px-1 xl:px-3 group cursor-pointer"
          [ngClass]="moreActive() ? 'border-b-[3px] border-accent text-accent' : 'text-fg'"
          (click)="moreMenu.toggle($event)">
          <i class="pi pi-ellipsis-h group-hover:text-accent" style="font-size: 1.5rem"></i>
          <button style="font-size:smaller" class="p-2 group-hover:text-accent" aria-haspopup="menu">More</button>
        </li>
      }
    </ul>
    <p-menu #moreMenu [model]="moreItems" [popup]="true" appendTo="body"></p-menu>

    <div
      [ngClass]="{
        'order-1 ml-4 flex-row items-center gap-4': !sidebar,
        'flex-col': sidebar,
      }"
      class="flex justify-center">
      <button
        (click)="loginLogout()"
        class="group">
        <ng-container *ngIf="user(); else userIcon">
          <div
            class='min-w-auto mx-auto primary-background h-12 w-12 overflow-hidden rounded-full text-fg group-hover:bg-accent"'>
            <img *ngIf="user()" alt="{{ this.user()?.displayName }}" src="{{ this.user()?.photoUrl }}" />
          </div>
          <span class="text-fg text-xs">{{ this.user()?.displayName }}</span>
        </ng-container>
        <ng-template #userIcon>
          <div
            class='min-w-auto mx-auto flex flex-col justify-center primary-background h-12 w-12 overflow-hidden rounded-full text-fg hover:bg-accent"'>
            <i class="pi pi-user" style="font-size: 1.5rem"></i>
          </div>
          <span class="text-fg text-xs group-hover:text-accent">Press to Login</span>
        </ng-template>
      </button>

      <div
        class="flex flex-col group cursor-pointer"
        [ngClass]="{
          'my-5': sidebar,
        }"
        (click)="openSettings()">
        <i class="pi pi-cog text-center text-fg group-hover:text-accent" style="font-size: 1.5rem"></i>
        <span class="text-xs text-center text-fg group-hover:text-accent">Settings</span>
      </div>

      <div class="justify-center items-center" [ngClass]="sidebar ? 'grid grid-cols-2' : 'hidden xl:flex flex-row'">
        <a class="mx-auto" href="https://github.com/TakaOtaku/Digimon-Card-App" target="_blank">
          <i class="pi pi-github px-1 text-fg hover:text-accent" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://twitter.com/digimoncardapp" target="_blank">
          <i class="pi pi-twitter px-1 text-fg hover:text-accent" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://discordapp.com/users/189436886744432640" target="_blank">
          <i class="pi pi-discord px-1 text-fg hover:text-accent" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank">
          <i class="pi pi-paypal px-1 text-fg hover:text-accent" style="font-size: 1rem"></i>
        </a>
        <div class="col-span-2 flex align-center justify-center">
          <p-button class="mx-auto" [link]="true" size="small" (onClick)="showChangelog()" label="Ver. 5.0.0"></p-button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass, NgIf, FontAwesomeModule, ConfirmPopupModule, DialogModule, ButtonModule, MenuModule],
})
export class NavLinksComponent {
  @Input() sidebar = false;
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
  ];
  moreActive = computed(() => ['/rulings', '/products'].includes(this.route()));

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route.set(event.url);
      }
    });
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
