import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { environment } from '../../../../environments/environment';
import { NavLinksComponent } from './nav-links.component';

@Component({
  selector: 'digimon-navbar',
  template: `
    <nav
      class="flex flex-row h-[3.5rem] md:h-[5rem] w-[100vw] max-w-[100vw] border-b border-line bg-ink-1 px-5 items-center">
      <a class="z-[5000]" [href]="appUrl">
        <img alt="Logo" class="mt-[0.25rem] cursor-pointer max-h-[2.5rem] md:max-h-[3.25rem]" src="../../../../assets/images/logo.png" />
      </a>

      <i
        (click)="openSideNav.emit(true)"
        class="block md:hidden ml-3 pi pi-bars px-1 text-fg hover:text-accent"
        style="font-size: 1.25rem"></i>

      <digimon-nav-links class="hidden md:flex flex-row w-full h-full items-center"></digimon-nav-links>
    </nav>
  `,
  standalone: true,
  imports: [FontAwesomeModule, ConfirmPopupModule, DialogModule, NavLinksComponent, DrawerModule],
})
export class NavbarComponent {
  @Output() openSideNav = new EventEmitter<boolean>();
  protected readonly appUrl = environment.appUrl;
}
