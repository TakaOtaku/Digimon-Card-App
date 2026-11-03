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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'digimon-products',
  template: `
    <digimon-page>
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 self-start px-4 py-6 md:px-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div class="flex flex-col gap-1">
            <h1 class="m-0 text-3xl font-bold text-fg md:text-4xl">Rulings</h1>
            <p class="m-0 text-sm text-muted">Official Q&amp;A per card. Search by card number or any word in a question.</p>
          </div>
          <p-icon-field class="w-full md:w-96">
            <p-inputicon styleClass="pi pi-search"></p-inputicon>
            <input [(ngModel)]="searchTerm" class="w-full" pInputText placeholder="Search rulings, e.g. BT1-010 or Piercing" type="text" />
          </p-icon-field>
        </div>

        <div class="flex flex-col gap-3">
          @for (cardRulings of Object.entries(digimonRulings); track $index) {
            <article *ngIf="shouldDisplay(cardRulings)" class="flex flex-col gap-4 rounded-xl border border-line bg-ink-1 p-4 md:flex-row">
              <img
                [digimonImgFallback]="cardImageBase + cardRulings[0] + '.webp'"
                alt="{{ cardRulings[0] }}"
                class="w-32 shrink-0 self-start rounded-lg md:w-40" />
              <div class="flex min-w-0 flex-1 flex-col divide-y divide-line">
                <span class="pb-2 font-mono text-sm text-muted">{{ cardRulings[0] }}</span>
                @for (ruling of cardRulings[1]; track $index) {
                  <div class="flex flex-col gap-1 py-3">
                    <p class="m-0 text-fg"><span class="mr-2 font-mono font-semibold text-accent">Q</span>{{ stripPrefix(ruling.question) }}</p>
                    <p class="m-0 text-muted"><span class="mr-2 font-mono font-semibold text-green-400">A</span>{{ stripPrefix(ruling.answer) }}</p>
                  </div>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageComponent, FormsModule, IconField, InputIcon, InputText, NgIf, ImgFallbackDirective],
})
export class RulesComponent {
  // The rulings data already starts with "Q:" / "A:"; the template draws its own labels
  stripPrefix = (text: string) => text.replace(/^\s*[QA]:\s*/, '');

  public router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);

  digimonRulings: DigimonRulings = {};
  searchTerm: WritableSignal<string> = signal('');
  protected readonly cardImageBase = environment.cardImageBaseUrl;

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
