import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  changeSite(url: string) {
    this.router.navigateByUrl(url);
  }
}
