import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IUser } from '../../../../models';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  megamenu = false;

  settingsDialog = false;
  creditsDisplay = false;
  showChangelog = false;

  user: IUser | null;

  mobile = false;

  private onDestroy$ = new Subject();

  constructor(public router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.user = this.authService.userData;
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
}
