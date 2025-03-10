import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import RulingsJson from '../../../assets/cardlists/Rulings.json';
import { PageComponent } from '../shared/page.component';

interface QnA {
  question: string;
  answer: string;
}

@Component({
  selector: 'digimon-rules-page',
  template: `
    <div class="flex flex-col w-screen lg:w-[calc(100vw-8.5rem)]">
      <div class="flex flex-row mx-auto">
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('BT1-001')">
          BT1-001
        </button>
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('EX1-001')">
          EX1-001
        </button>
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('ST1-01')">
          ST1-01
        </button>
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('LM-001')">
          LM-001
        </button>
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('RB1-001')">
          RB1-01
        </button>
        <button
          class="min-w-auto h-8  border border-slate-100 p-0.5 py-2 text-xs font-semibold text-[#e2e4e6]"
          (click)="searchControl.setValue('P-001')">
          P-001
        </button>
      </div>
      <input
        [formControl]="searchControl"
        class="h-6 w-full py-4 my-4"
        pInputText
        placeholder="Search"
        type="text" />

      <div class="h-[calc(100vh-7.5rem)]">
        <cdk-virtual-scroll-viewport
          class="h-full w-full"
          [itemSize]="100"
          [minBufferPx]="200"
          [maxBufferPx]="400">
          <div
            *cdkVirtualFor="
              let rule of filteredRulings();
              trackBy: trackByCardId
            "
            class="grid grid-cols-4 no-wrap border py-2">
            <img
              [ngSrc]="getCardImageUrl(rule[0])"
              [ngStyle]="{ border: cardBorder, 'border-radius': cardRadius }"
              alt="{{ rule[0] }}"
              class="m-auto aspect-auto max-h-52"
              height="268"
              width="192"
              priority="false" />
            <div class="col-span-3">
              @for (qna of rule[1]; track $index) {
                <div class="mb-2">
                  <div
                    class="font-bold text-white"
                    [innerHTML]="qna.question"></div>
                  <div class="text-white" [innerHTML]="qna.answer"></div>
                </div>
              }
            </div>
          </div>

          @if (!filteredRulings().length) {
            <div class="no-results p-4 text-center">
              No matching rules found for "{{ search() }}"
            </div>
          }
        </cdk-virtual-scroll-viewport>
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
    ScrollingModule,
  ],
})
export class RulesPageComponent implements OnInit {
  searchControl = new FormControl('');
  search = signal<string>('');
  rulings: [string, QnA[]][] = Object.entries(RulingsJson);
  cardBorder = '2px solid black';
  cardRadius = '5px';
  // Memoize the search terms for each ruling to avoid recomputing on each filter
  private rulingsSearchData: { cardId: string; searchTerms: string }[] = [];
  filteredRulings = computed(() => {
    const search = this.search().toLowerCase();
    if (!search) return this.rulings;

    const matchingCardIds = new Set(
      this.rulingsSearchData
        .filter((item) => item.searchTerms.includes(search))
        .map((item) => item.cardId),
    );

    return this.rulings.filter(([cardId]) => matchingCardIds.has(cardId));
  });

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit() {
    // Prepare search data once for faster filtering
    this.prepareSearchData();

    // Debounce search input to reduce filtering operations
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.search.set(value || '');
      });
  }

  prepareSearchData() {
    this.rulingsSearchData = this.rulings.map(([cardId, qnas]) => {
      const searchableText = qnas.reduce((acc, qna) => {
        return (
          acc +
          ' ' +
          qna.question.toLowerCase() +
          ' ' +
          qna.answer.toLowerCase()
        );
      }, cardId.toLowerCase());

      return { cardId, searchTerms: searchableText };
    });
  }

  trackByCardId(index: number, item: [string, QnA[]]) {
    return item[0];
  }

  getCardImageUrl(cardId: string): string {
    if (!cardId) return '../../../assets/images/digimon-card-back.webp';
    return `https://digimon-card-app.b-cdn.net/${cardId}.webp`;
  }
}
