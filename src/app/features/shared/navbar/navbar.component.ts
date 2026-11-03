import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { GlobalSearchComponent } from './global-search.component';
import { NavLinksComponent } from './nav-links.component';

@Component({
  selector: 'digimon-navbar',
  template: `
    <nav class="flex flex-row h-[3.5rem] md:h-[5rem] w-[100vw] max-w-[100vw] border-b border-line bg-ink-1 px-5 items-center">
      <a class="z-[5000]" [href]="appUrl">
        <img alt="Logo" class="mt-[0.25rem] cursor-pointer max-h-[2.5rem] md:max-h-[3.25rem]" src="../../../../assets/images/logo.png" />
      </a>

      <!-- display: contents lets the search sit between the links and the account cluster -->
      <digimon-nav-links class="hidden md:contents"></digimon-nav-links>

      <digimon-global-search class="ml-auto"></digimon-global-search>
    </nav>

    <nav aria-label="Main" class="md:hidden fixed bottom-0 inset-x-0 z-[400] h-16 flex bg-ink-1 border-t border-line">
      @for (link of mobileLinks; track link.url) {
        <a
          [routerLink]="link.url"
          routerLinkActive
          #rla="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: link.url === '/' }"
          [ngClass]="rla.isActive ? 'text-accent' : 'text-fg'"
          class="flex-1 flex flex-col items-center justify-center gap-1 text-[11px] no-underline">
          <i [class]="'pi ' + link.icon" style="font-size: 1.25rem"></i>
          {{ link.label }}
        </a>
      }
      <button type="button" (click)="openSideNav.emit(true)" class="flex-1 flex flex-col items-center justify-center gap-1 text-[11px] text-fg">
        <i class="pi pi-bars" style="font-size: 1.25rem"></i>
        More
      </button>
    </nav>
  `,
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, NavLinksComponent, GlobalSearchComponent],
})
export class NavbarComponent {
  @Output() openSideNav = new EventEmitter<boolean>();
  protected readonly appUrl = environment.appUrl;
  protected readonly mobileLinks = [
    { url: '/cards', label: 'Cards', icon: 'pi-search' },
    { url: '/deckbuilder', label: 'Build', icon: 'pi-pencil' },
    { url: '/decks', label: 'Decks', icon: 'pi-table' },
    { url: '/collection', label: 'Collection', icon: 'pi-folder' },
  ];
}
