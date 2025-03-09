import { AsyncPipe, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageComponent } from '../shared/page.component';
import RulingsJson from '../../../assets/cardlists/Rulings.json';
import { InputTextModule } from 'primeng/inputtext';

interface QnA {
  question: string;
  answer: string;
}

@Component({
  selector: 'digimon-rules-page',
  template: `
    <div class="flex flex-col max-2xl">
      <input
        [ngModel]="search"
        (ngModelChange)="search.set($event)"
        class="h-6 w-full py-4 my-6"
        pInputText
        placeholder="Search"
        type="text" />

      <div class="flex flex-col py-2">
        @for (rule of filteredRulings(); track rule[0]) {
          <div class="grid grid-cols-4 no-wrap border py-2">
            <img
              [ngSrc]="getCardImageUrl(rule[0])"
              [ngStyle]="{ border: cardBorder, 'border-radius': cardRadius }"
              alt="{{ rule }}"
              class="m-auto aspect-auto max-h-52"
              height="268px"
              width="192px" />
            <div class="col-span-3">
              @for (qna of rule[1]; track $index) {
                <div class="qna-item">
                  <div class="font-bold" [innerHTML]="qna.question"></div>
                  <div class="answer" [innerHTML]="qna.answer"></div>
                </div>
              }
            </div>
          </div>
        }
        @if (!filteredRulings().length) {
          <div class="no-results">
            No matching rules found for "{{ search() }}"
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    PageComponent,
    ReactiveFormsModule,
    FormsModule,
    NgStyle,
    NgOptimizedImage,
    InputTextModule,
  ],
})
export class RulesPageComponent {
  search = signal<string>('');
  rulings: [string, QnA[]][] = Object.entries(RulingsJson);

  cardBorder = '2px solid black';
  cardRadius = '5px';

  filteredRulings = computed(() => {
    const search = this.search().toLowerCase();
    if (!search) return this.rulings;

    return this.rulings.filter(([cardId, qnas]) => {
      const cardMatch = cardId.toLowerCase().includes(search);
      const contentMatch = qnas.some(
        (qna) =>
          qna.question.toLowerCase().includes(search) ||
          qna.answer.toLowerCase().includes(search),
      );

      return cardMatch || contentMatch;
    });
  });

  getCardImageUrl(cardId: string): string {
    if (!cardId) return '../../../assets/images/digimon-card-back.webp';
    return `https://digimon-card-app.b-cdn.net/${cardId}.webp`;
  }
}
