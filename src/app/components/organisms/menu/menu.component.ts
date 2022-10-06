import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { IUser } from '../../../../models';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'digimon-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  items: MenuItem[];

  settingsDialog = false;
  creditsDisplay = false;
  showChangelog = false;

  user: IUser | null;

  mobile = false;

  private onDestroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.update();
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.update();
      this.user = this.authService.userData;
    });

    this.primengConfig.ripple = true;
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

  update() {
    const userMenu = {
      label: 'Sites',
      items: [
        {
          label: 'Home',
          icon: 'pi pi-pencil',
          command: () => this.router.navigateByUrl(''),
        },
        {
          label: 'Deckbuilder',
          icon: 'pi pi-pencil',
          command: () => this.router.navigateByUrl('/deckbuilder'),
        },
        {
          label: 'Collection',
          icon: 'pi pi-database',
          command: () => this.router.navigateByUrl('/collection'),
        },
        {
          label: 'Profile',
          icon: 'pi pi-database',
          command: () => this.router.navigateByUrl('/user'),
        },
        {
          label: 'Community',
          icon: 'pi pi-database',
          command: () => this.router.navigateByUrl('/community'),
        },
      ],
    };

    const settingsMenu = {
      label: 'Settings',
      items: [
        {
          label: this.authService.isLoggedIn ? 'Logout' : 'Login',
          icon: 'pi pi-google',
          command: () => {
            this.authService.isLoggedIn
              ? this.authService.LogOut()
              : this.login();
          },
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => (this.settingsDialog = true),
        },
      ],
    };

    const externalMenu = {
      label: 'External',
      items: [
        {
          label: 'What I work on',
          icon: 'pi pi-history',
          url: 'https://github.com/users/TakaOtaku/projects/1/views/3',
        },
        {
          label: 'Feature/Bug Request',
          icon: 'pi pi-plus',
          url: 'https://github.com/TakaOtaku/Digimon-Card-App/issues',
        },
        {
          label: 'Help the Site!',
          icon: 'pi pi-paypal',
          url: 'https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4',
        },
        {
          label: 'Changelog',
          icon: 'pi pi-history',
          command: () => (this.showChangelog = true),
        },
        {
          label: 'Credits',
          icon: 'pi pi-file',
          command: () => (this.creditsDisplay = true),
        },
      ],
    };

    this.items = [userMenu, settingsMenu, externalMenu];
  }

  login() {
    this.authService.GoogleAuth();
  }
}
