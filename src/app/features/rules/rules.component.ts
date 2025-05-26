import { NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImgFallbackDirective } from '@directives';
import { DigimonRulings, QuestionAnswer } from '@models';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { PageComponent } from '../shared/page.component';
import Rulings from '../../../assets/cardlists/Rulings.json';

@Component({
  selector: 'digimon-products',
  template: `
    <digimon-page style="align-items: start !important;">
      <div class="flex flex-col justify-top px-10 w-full" style="align-self: start !important;">
        <h1 class="text-shadow mt-6 pb-1 text-2xl md:text-4xl font-black text-[#e2e4e6]">Digimon Card Rulings</h1>
        <div class="m-1 flex flex-row">
          <p-icon-field class="mr-1 w-full">
            <p-inputicon styleClass="pi pi-search"></p-inputicon>
            <input [(ngModel)]="searchTerm" class="w-full" pInputText placeholder="Search" type="text" />
          </p-icon-field>
        </div>

        <div class="grid grid-cols-1 rulings-container w-full content-start justify-start overflow-y-scroll">
          @for (cardRulings of Object.entries(digimonRulings); track $index) {
            <div *ngIf="shouldDisplay(cardRulings)" class="flex flex-col md:flex-row my-2 border border-slate-300 surface-ground">
              <img
                [digimonImgFallback]="'assets/images/cards/' + cardRulings[0] + '.webp'"
                [ngStyle]="{ border: '2px solid black', 'border-radius': '5px' }"
                alt="{{ cardRulings[0] }}"
                class="ml-0 aspect-auto h-26 md:h-56" />
              <div class="grid grid-cols-1 mx-5">
                @for (ruling of cardRulings[1]; track $index) {
                  <div class="my-2 flex flex-col">
                    <div>{{ ruling.question }}</div>
                    <hr />
                    <div>{{ ruling.answer }}</div>
                  </div>
                }
              </div>
            </div>
          }
          <div></div>
        </div>
      </div>
    </digimon-page>
  `,
  styles: `
    .rulings-container {
      max-height: calc(100vh - 10rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageComponent, FormsModule, IconField, InputIcon, InputText, NgIf, ImgFallbackDirective, NgStyle],
})
export class RulesComponent {
  public router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);

  digimonRulings: DigimonRulings = {};
  searchTerm: WritableSignal<string> = signal('');

  constructor() {
    this.makeGoogleFriendly();
    this.digimonRulings = Rulings;
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Rulings');

    this.meta.addTags([
      {
        name: 'description',
        content: 'See all Official Digimon TCG Rulings in one Place',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Digimon, decks, deck builder, collection,  tournament, TCG, community, friends, share, rules',
      },
    ]);
  }

  protected readonly Object = Object;

  shouldDisplay(cardRulings: [string, QuestionAnswer[]]) {
    if (!this.searchTerm() || this.searchTerm().trim() === '') {
      return true;
    }

    const term = this.searchTerm().toLowerCase().trim();
    const cardId = cardRulings[0].toLowerCase();
    const rulings = cardRulings[1];

    // Check if the search term is in the card ID
    if (cardId.includes(term)) {
      return true;
    }

    // Check if the search term is in any question or answer
    return rulings.some((ruling) => ruling.question.toLowerCase().includes(term) || ruling.answer.toLowerCase().includes(term));
  }
}
