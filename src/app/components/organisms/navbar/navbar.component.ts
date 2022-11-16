import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  faCog,
  faFolder,
  faHouseUser,
  faInfoCircle,
  faPen,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../../models';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
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

  private onDestroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.user = this.authService.userData;
    });

    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
      event instanceof NavigationEnd
        ? (this.showCardList = event.url.includes('deckbuilder'))
        : null;
    });

    this.onResize();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
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
}
