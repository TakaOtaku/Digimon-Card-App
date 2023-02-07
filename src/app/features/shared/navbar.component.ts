import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { first, Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'digimon-navbar',
  template: `
    <nav
      class="navbar navbar-expand-lg relative flex w-full flex-col items-center justify-between border-b border-slate-100 shadow-2xl"
    >
      <a #link class="hidden" href="https://digimoncard.app"></a>
      <a
        class="absolute top-0 left-4 z-[5000] flex flex-row"
        (click)="refresh(link)"
      >
        <img
          alt="Logo"
          class="mt-[0.25rem] max-h-[3.25rem] cursor-pointer md:mt-[-0.5rem] md:max-h-[5.5rem]"
          src="../../../assets/images/logo.png"
        />
      </a>

      <div class="surface-ground flex max-h-12 w-full flex-row p-0">
        <button
          (click)="router.navigateByUrl('')"
          [ngClass]="{ 'text-[#64B5F6]': route === '/' }"
          class="min-w-auto mt-1 ml-auto hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          HOME
        </button>
        <button
          (click)="router.navigateByUrl('/deckbuilder')"
          [ngClass]="{
            'text-[#64B5F6]': route.includes('deckbuilder')
          }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          DECKBUILDER
        </button>
        <button
          (click)="router.navigateByUrl('/collection')"
          [ngClass]="{ 'text-[#64B5F6]': route.includes('collection') }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          COLLECTION
        </button>
        <button
          (click)="router.navigateByUrl('/user')"
          [ngClass]="{
            'text-[#64B5F6]':
              route.includes('user') && !route.includes('deckbuilder')
          }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          PROFILE
        </button>
        <button
          (click)="router.navigateByUrl('/decks')"
          [ngClass]="{ 'text-[#64B5F6]': route.includes('decks') }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          DECKS
        </button>
        <button
          (click)="router.navigateByUrl('/community')"
          [ngClass]="{ 'text-[#64B5F6]': route.includes('community') }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          COMMUNITY
        </button>
        <button
          (click)="router.navigateByUrl('/products')"
          [ngClass]="{ 'text-[#64B5F6]': route.includes('products') }"
          class="min-w-auto mt-1 ml-2 hidden h-8 p-2 font-bold text-[#e2e4e6] hover:text-[#64B5F6] lg:block"
        >
          PRODUCTS
        </button>

        <digimon-filter-button
          *ngIf="showCardList"
          class="ml-auto mr-4 md:hidden"
        ></digimon-filter-button>
        <div *ngIf="!showCardList" class="m-auto md:hidden"></div>

        <div
          [ngClass]="{ 'ml-auto': !showCardList, 'ml-2': showCardList }"
          class="my-1 mx-2 flex flex-row lg:ml-4"
        >
          <button
            (click)="changeMenu()"
            class="min-w-auto primary-background mx-2 h-9 w-9 overflow-hidden rounded-full text-xs font-semibold text-[#e2e4e6] hover:bg-[#64B5F6]"
          >
            <fa-icon *ngIf="!user" [icon]="faUser"></fa-icon>
            <img
              *ngIf="user"
              alt="{{ this.user.displayName }}"
              src="{{ this.user.photoURL }}"
            />
          </button>
        </div>
      </div>

      <div
        [ngClass]="{ show: megamenu, collapse: !megamenu }"
        class="navbar-collapse grow items-center"
        id="navbarSupportedContentX"
      >
        <ul class="navbar-nav mr-auto flex flex-row">
          <li class="dropdown nav-item static">
            <div
              [ngClass]="{ hidden: !megamenu }"
              class="surface-ground dropdown-menu absolute left-0 top-full mt-0 w-full shadow-lg"
              aria-labelledby="dropdownMenuButtonX"
            >
              <div class="px-6 py-5 lg:px-8">
                <div class="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
                  <div class="hidden lg:block"></div>
                  <div class="surface-ground text-[#e2e4e6]">
                    <p
                      class="block w-full border-b border-gray-200 px-6 py-2 font-bold uppercase text-[#e2e4e6]"
                    >
                      Sites
                    </p>
                    <a
                      (click)="router.navigateByUrl(''); this.megamenu = false"
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faHouse" class="mr-2 w-5"></fa-icon>
                      Home</a
                    >
                    <a
                      (click)="
                        router.navigateByUrl('/deckbuilder');
                        this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faDeckbuilder" class="mr-2"></fa-icon>
                      Deckbuilder
                    </a>
                    <a
                      (click)="
                        router.navigateByUrl('/collection');
                        this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faCollection" class="mr-2 w-5"></fa-icon>
                      Collection</a
                    >
                    <a
                      (click)="
                        router.navigateByUrl('/user'); this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faUser" class="mr-2 w-5"></fa-icon>
                      Profile</a
                    >
                    <a
                      (click)="
                        router.navigateByUrl('/decks'); this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faCommunity" class="mr-2 w-5"></fa-icon>
                      Decks</a
                    >
                    <a
                      (click)="
                        router.navigateByUrl('/community');
                        this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faCommunity" class="mr-2 w-5"></fa-icon>
                      Community</a
                    >
                    <a
                      (click)="
                        router.navigateByUrl('/products'); this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faInfo" class="mr-1 w-5"></fa-icon>
                      Products</a
                    >
                  </div>
                  <div class="surface-ground text-[#e2e4e6]">
                    <p
                      class="block w-full border-b border-gray-200 px-6 py-2 font-bold uppercase text-[#e2e4e6]"
                    >
                      Miscellaneous
                    </p>
                    <a
                      (click)="showChangelogModal()"
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faInfo" class="mr-1 w-5"></fa-icon>
                      Changelog</a
                    >
                    <a
                      (click)="
                        this.settingsDialog = true; this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faCog" class="mr-1 w-5"></fa-icon>
                      Settings</a
                    >
                    <a
                      (click)="
                        this.authService.isLoggedIn
                          ? this.authService.LogOut()
                          : this.login();
                        this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <i class="fa-solid fa-right-from-bracket"></i>
                      {{ this.authService.isLoggedIn ? 'Logout' : 'Login' }}</a
                    >
                    <a
                      (click)="
                        this.creditsDisplay = true; this.megamenu = false
                      "
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                    >
                      <fa-icon [icon]="faInfo" class="mr-1 w-5"></fa-icon>
                      Credits</a
                    >
                  </div>
                  <div class="surface-ground text-[#e2e4e6]">
                    <p
                      class="block w-full border-b border-gray-200 px-6 py-2 font-bold uppercase text-[#e2e4e6]"
                    >
                      External
                    </p>
                    <a
                      href="https://github.com/TakaOtaku/Digimon-Card-App/issues"
                      target="_blank"
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                      ><i class="fa-solid fa-bug mr-1"></i>Feature/Bug
                      Request</a
                    >
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4"
                      target="_blank"
                      aria-current="true"
                      class="block w-full cursor-pointer border-b border-gray-200 px-6 py-2 transition duration-150 ease-in-out hover:text-[#64B5F6] hover:backdrop-brightness-150"
                      ><i class="fa-brands fa-cc-paypal mr-1"></i>Help the
                      Site!</a
                    >
                  </div>
                  <div class="hidden lg:block"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <p-confirmPopup></p-confirmPopup>

    <p-dialog
      [(visible)]="settingsDialog"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      header="Settings"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
    >
      <digimon-settings-dialog></digimon-settings-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="showChangelog"
      [closeOnEscape]="true"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      header="Changelog"
    >
      <digimon-changelog-dialog
        [loadChangelog]="loadChangelog"
      ></digimon-changelog-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="creditsDisplay"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      header="Credits"
      styleClass="w-screen lg:max-h-[600px] lg:max-w-3xl"
    >
      <div class="flex w-full flex-col">
        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]"
          >A huge thanks goes to tari101190 who helps me with all the new card
          releases and tests the website completly so I don't have to worry to
          much!</span
        >

        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]"
          >Another big thank you goes to
          <a
            class="primary-color"
            href="https://www.instagram.com/oscstudios/"
            target="_blank"
            >TheOSC</a
          >
          he send me a cool new design which I took much inspiration from and
          helped with other design questions! Go Check him out he makes great
          art!</span
        >

        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]">
          Another big thank you goes to Yondaime, he posted the Adventure Series
          Post, helps promote the site and gives general good feedback!</span
        >

        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]"
          >Credits for the Pre-Release Cards go to
          <a
            class="primary-color"
            href="https://digimoncardgame.fandom.com/"
            target="_blank"
            >https://digimoncardgame.fandom.com/</a
          >
          and all the wonderful people who maintain it!</span
        >

        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]">
          Another Thank you to mr_pyro for creating the tierlist and helping me
          with it!</span
        >

        <span class="mt-5 w-full text-center font-bold text-[#e2e4e6]"
          >Please support the official releases! Akiyoshi Hongo, Bandai, and
          Toei Animation respectively own Digimon images, copyrights and
          trademarks.</span
        >
      </div>
    </p-dialog>
  `,
})
export class NavbarComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faHouse = faHouseUser;
  faDeckbuilder = faPen;
  faCollection = faFolder;
  faCommunity = faUsers;
  faInfo = faInfoCircle;
  faCog = faCog;

  megamenu = false;

  settingsDialog = false;
  creditsDisplay = false;
  showChangelog = false;

  loadChangelog = new EventEmitter<boolean>();

  user: IUser | null;
  showCardList = false;

  mobile = false;
  route = '';

  private onDestroy$ = new Subject();

  constructor(
    public router: Router,
    public authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.user = this.authService.userData;
    });

    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showCardList = event.url.includes('deckbuilder');
        this.route = event.url;
      }
    });

    this.onResize();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    let screenWidth = window.innerWidth;
    this.mobile = screenWidth <= 1024;
  }

  login() {
    this.authService.GoogleAuth();
  }

  changeMenu() {
    this.megamenu = !this.megamenu;
  }

  showChangelogModal() {
    this.showChangelog = true;
    this.megamenu = false;
    this.loadChangelog.emit(true);
  }

  refresh(link: HTMLAnchorElement) {
    this.confirmationService.confirm({
      message: 'You are about to refresh to the home page. Are you sure?',
      accept: () => {
        link.click();
      },
    });
  }
}
