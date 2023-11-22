import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCog,
  faFolder,
  faHouseUser,
  faInfoCircle,
  faPen,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { ChangelogDialogComponent } from './dialogs/changelog-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings-dialog.component';
import { FilterButtonComponent } from './filter/filter-button.component';

@Component({
  selector: 'digimon-navbar',
  template: `
    <nav
      class="flex flex-col h-[100vh] w-[6.5rem] border-r border-white items-center max-h-[100vh] relative justify-between py-10"
      style='backdrop-filter: blur(16px); background-color: color-mix(in srgb, var(--surface-ground) 70%, transparent)'
    >
      <a class="z-[5000]" href='https://digimoncard.app'>
        <img alt="Logo" class="mt-[0.25rem] cursor-pointer max-h-[4rem]" src="../../../assets/images/logo.png" />
      </a>

      <ul class='p-0 py-5 justify-between m-0 list-none flex flex-col'>
        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route === '/',
            'text-[#64B5F6]': route === '/',
            'text-[#e2e4e6]': route !== '/'
          }"
          (click)="router.navigateByUrl('')">
          <i class="pi pi-home group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <div
            [ngClass]="{ 'text-[#64B5F6]': route === '/' }"
            style='font-size:smaller'
            class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Home
          </div>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route.includes('deckbuilder'),
            'text-[#64B5F6]': route.includes('deckbuilder'),
            'text-[#e2e4e6]': !route.includes('deckbuilder')
          }"
          (click)="router.navigateByUrl('/deckbuilder')">
          <i class="pi pi-pencil group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Deckbuilder
          </button>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route.includes('collection'),
            'text-[#64B5F6]': route.includes('collection'),
            'text-[#e2e4e6]': !route.includes('collection')
          }"
          (click)="router.navigateByUrl('/collection')">
          <i class="pi pi-folder group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Collection
          </button>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route.includes('user') && !route.includes('deckbuilder'),
            'text-[#64B5F6]': route.includes('user') && !route.includes('deckbuilder'),
            'text-[#e2e4e6]': !route.includes('user')
          }"
          (click)="router.navigateByUrl('/user')"
        >
          <i class="pi pi-user group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Profile
          </button>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white':  route.includes('decks'),
            'text-[#64B5F6]': route.includes('decks'),
            'text-[#e2e4e6]': !route.includes('decks')
          }"
          (click)="router.navigateByUrl('/decks')">
          <i class="pi pi-table group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Decks
          </button>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route.includes('community'),
            'text-[#64B5F6]': route.includes('community'),
            'text-[#e2e4e6]': !route.includes('community')
          }"
          (click)="router.navigateByUrl('/community')">
          <i class="pi pi-users group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Forum
          </button>
        </li>

        <li
          class='flex flex-col items-center group cursor-pointer'
          [ngClass]="{
            'border-l-2 border-white': route.includes('products'),
            'text-[#64B5F6]': route.includes('products'),
            'text-[#e2e4e6]': !route.includes('products')
          }"
          (click)="router.navigateByUrl('/products')">
          <i class="pi pi-tags group-hover:text-[#64B5F6]" style="font-size: 1.5rem"></i>
          <button style='font-size:smaller' class="hidden p-2 group-hover:text-[#64B5F6] lg:block">
            Products
          </button>
        </li>
      </ul>

      <div class='flex flex-col justify-center'>
        <button (click)='loginLogout()' class='group'>
          <ng-container *ngIf="user; else userIcon">
            <div class='min-w-auto mx-auto primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] group-hover:bg-[#64B5F6]"'>
              <img
                  *ngIf="user"
                  alt="{{ this.user.displayName }}"
                  src="{{ this.user.photoURL }}" />
            </div>
            <span class='text-[#e2e4e6] text-xs'>{{ this.user.displayName }}</span>
          </ng-container>
          <ng-template #userIcon>
            <div class='min-w-auto mx-auto flex flex-col justify-center primary-background h-12 w-12 overflow-hidden rounded-full text-[#e2e4e6] hover:bg-[#64B5F6]"'>
              <i class="pi pi-user" style="font-size: 1.5rem"></i>
            </div>
            <span class='text-[#e2e4e6] text-xs group-hover:text-[#64B5F6]'>Press to Login</span>
          </ng-template>
        </button>

        <i
          class="pi pi-ellipsis-h my-5 text-center text-[#e2e4e6] hover:text-[#64B5F6]"
          style="font-size: 1.5rem"
          (click)='settingsDialog = true'
        ></i>

        <div class='grid grid-cols-2 justify-center'>
          <a class='mx-auto'
            href='https://github.com/TakaOtaku/Digimon-Card-App'
            target='_blank'
          >
            <i class="pi pi-github px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
          </a>

          <a class='mx-auto'
            href='https://twitter.com/digimoncardapp'
            target='_blank'
          >
            <i class="pi pi-twitter px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
          </a>

          <a class='mx-auto'
            href='https://discordapp.com/users/189436886744432640'
            target='_blank'
          >
            <i class="pi pi-discord px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
          </a>

          <a class='mx-auto'
            href='https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4'
            target='_blank'
          >
            <i class="pi pi-paypal px-1 text-[#e2e4e6] hover:text-[#64B5F6]" style="font-size: 1rem"></i>
          </a>
        </div>
      </div>
    </nav>

    <p-dialog
      [(visible)]="settingsDialog"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      header="Settings"
      styleClass="w-full h-full max-w-6xl min-h-[500px]">
      <digimon-settings-dialog></digimon-settings-dialog>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FilterButtonComponent,
    FontAwesomeModule,
    ConfirmPopupModule,
    DialogModule,
    SettingsDialogComponent,
    ChangelogDialogComponent,
    NgOptimizedImage
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  settingsDialog = false;

  user: IUser | null;

  mobile = false;
  route = '';

  private onDestroy$ = new Subject();

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.user = this.authService.userData;
    });

    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url;
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  loginLogout() {
    this.authService.isLoggedIn
      ? this.authService.LogOut()
      : this.authService.GoogleAuth();
  }
}
