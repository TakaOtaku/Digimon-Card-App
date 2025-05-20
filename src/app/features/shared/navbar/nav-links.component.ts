import { NgClass, NgIf } from '@angular/common';
import { Component, effect, inject, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUser } from '@models';
import { AuthService } from '@services';
import { DialogStore, SaveStore } from '@store';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'digimon-nav-links',
  template: `
    <ul
      [ngClass]="{
        'h-[5rem] lg:h-auto lg:w-[6.5rem] lg:py-5 flex-row lg:flex-col pt-5': !sidebar,
        'w-[6.5rem] py-5 flex-col': sidebar,
      }"
      class="p-0 ml-auto list-none flex justify-between">
      <li class="flex flex-col items-center group cursor-pointer" [ngClass]="getNavigationBorder('/')" (click)="router.navigateByUrl('')">
        <i class="pi pi-home group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <div [ngClass]="{ 'text-[#64B5F6]': route() === '/' }" style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Home</div>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/deckbuilder')"
        (click)="router.navigateByUrl('/deckbuilder')">
        <i class="pi pi-pencil group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Deckbuilder</button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/collection')"
        (click)="router.navigateByUrl('/collection')">
        <i class="pi pi-folder group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Collection</button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/user')"
        (click)="router.navigateByUrl('/user')">
        <i class="pi pi-user group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Profile</button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/decks')"
        (click)="router.navigateByUrl('/decks')">
        <i class="pi pi-table group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Decks</button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/rulings')"
        (click)="router.navigateByUrl('/rulings')">
        <i class="pi pi-question-circle group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Rulings</button>
      </li>

      <li
        class="flex flex-col items-center group cursor-pointer"
        [ngClass]="getNavigationBorder('/products')"
        (click)="router.navigateByUrl('/products')">
        <i class="pi pi-tags group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
        <button style="font-size:smaller" class="p-2 group-hover:text-[#64B5F6]">Products</button>
      </li>
    </ul>

    <div
      [ngClass]="{
        'max-lg:ml-auto flex-row lg:flex-col': !sidebar,
        'flex-col': sidebar,
      }"
      class="flex justify-center">
      <button
        (click)="loginLogout()"
        [ngClass]="{
          'max-lg:mr-5': !sidebar,
        }"
        class="group">
        <ng-container *ngIf="user(); else userIcon">
          <div
            class='min-w-auto mx-auto primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] group-hover:bg-[#64B5F6]"'>
            <img *ngIf="user()" alt="{{ this.user()?.displayName }}" src="{{ this.user()?.photoURL }}" />
          </div>
          <span class="text-[#e2e4e6] text-xs">{{ this.user()?.displayName }}</span>
        </ng-container>
        <ng-template #userIcon>
          <div
            class='min-w-auto mx-auto flex flex-col justify-center primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] hover:bg-[#64B5F6]"'>
            <i class="pi pi-user" style="font-size: 1.5rem"></i>
          </div>
          <span class="text-[#e2e4e6] text-xs group-hover:text-[#64B5F6]">Press to Login</span>
        </ng-template>
      </button>

      <i
        [ngClass]="{
          'max-lg:mr-5': !sidebar,
        }"
        class="pi pi-ellipsis-h my-5 text-center text-[#e2e4e6] hover:text-[#64B5F6]"
        style="font-size: 1.5rem"
        (click)="openSettings()"></i>

      <div class="grid grid-cols-2 justify-center items-center">
        <a class="mx-auto" href="https://github.com/TakaOtaku/Digimon-Card-App" target="_blank">
          <i class="pi pi-github px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://twitter.com/digimoncardapp" target="_blank">
          <i class="pi pi-twitter px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://discordapp.com/users/189436886744432640" target="_blank">
          <i class="pi pi-discord px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
        </a>

        <a class="mx-auto" href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank">
          <i class="pi pi-paypal px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
        </a>
        <div class="col-span-2 flex align-center justify-center">
          <p-button class="mx-auto" [link]="true" size="small" (onClick)="showChangelog()" label="Ver. 4.2.0"></p-button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass, NgIf, FontAwesomeModule, ConfirmPopupModule, DialogModule, ButtonModule],
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
        'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white': deckOpenOrDeckbuilder && !this.sidebar,
        'text-[#64B5F6]': deckOpenOrDeckbuilder,
        'text-[#e2e4e6]': !deckOpenOrDeckbuilder,
      };
    } else if (route === '/user') {
      return {
        'border-l-[3px] border-white': this.route().includes(route) && !this.route().includes('deckbuilder') && this.sidebar,
        'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white':
          this.route().includes(route) && !this.route().includes('deckbuilder') && !this.sidebar,
        'text-[#64B5F6]': this.route().includes(route) && !this.route().includes('deckbuilder'),
        'text-[#e2e4e6]': !this.route().includes(route),
      };
    }
    return {
      'border-l-[3px] border-white': this.route() === route && this.sidebar,
      'border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-white': this.route() === route && !this.sidebar,
      'text-[#64B5F6]': this.route() === route,
      'text-[#e2e4e6]': this.route() !== route,
    };
  }

  openSettings() {
    this.dialogStore.updateSettingsDialog(true);
  }

  showChangelog() {
    this.dialogStore.updateChangelogDialog(true);
  }
}
