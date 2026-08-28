import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FilterStore } from '@store';
import { SearchAutocompleteService, SearchSuggestion } from '@services';

@Component({
  selector: 'digimon-advanced-search',
  template: `
    <div class="advanced-search-container">
      <div class="search-input-container">
        <p-autoComplete
          #searchAutocomplete
          [(ngModel)]="searchQuery"
          [suggestions]="suggestions()"
          (onSelect)="onSuggestionSelected($event)"
          (completeMethod)="onSearchChange($event)"
          (ngModelChange)="onQueryChange($event)"
          (keydown.enter)="onEnter()"
          [showEmptyMessage]="false"
          [minLength]="0"
          [forceSelection]="false"
          class="w-full"
          styleClass="w-full"
          field="label"
          placeholder="Search cards... (e.g., Agumon, or cardType == Digimon AND color == Red)"
          aria-label="Search cards">
          
          <ng-template let-item pTemplate="item">
            <div class="flex items-center justify-between p-2">
              <div class="flex flex-col">
                <span class="font-semibold">{{ item.label }}</span>
                <span class="text-xs text-gray-400" *ngIf="item.description">{{ item.description }}</span>
              </div>
              <span class="text-xs px-2 py-1 rounded" [ngClass]="getCategoryClass(item.category)">
                {{ item.category }}
              </span>
            </div>
          </ng-template>
        </p-autoComplete>

        <button
          pButton
          icon="pi pi-question-circle"
          (click)="showHelp = true"
          [text]="true"
          [rounded]="true"
          severity="help"
          pTooltip="Advanced search syntax help"
          tooltipPosition="top">
        </button>
      </div>
    </div>

    <!-- Help Dialog -->
    <p-dialog 
      header="Advanced Search Help" 
      [(visible)]="showHelp"
      [modal]="true"
      [style]="{ width: '50vw', padding: '1rem' }"
      [dismissableMask]="true">
      
      <div class="help-content">
        <h6>Query Syntax:</h6>
        <p class="mt-2">Use MongoDB-style query syntax with field names, operators, and values:</p>
        
        <h6 class="mt-4">Operators:</h6>
        <ul class="list-disc ml-4 mt-2">
          <li><code>==</code> - Equals (case-insensitive for text)</li>
          <li><code>!=</code> - Not equals</li>
          <li><code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, <code>&lt;=</code> - Numeric comparisons</li>
          <li><code>contains</code> - Text contains (case-insensitive)</li>
          <li><code>starts_with</code> - Text starts with</li>
          <li><code>ends_with</code> - Text ends with</li>
        </ul>

        <h6 class="mt-4">Logical Operators:</h6>
        <ul class="list-disc ml-4 mt-2">
          <li><code>AND</code> - All conditions must be true</li>
          <li><code>OR</code> - At least one condition must be true</li>
          <li>Use parentheses <code>()</code> to group conditions</li>
        </ul>

        <h6 class="mt-4">Available Fields:</h6>
        <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div><strong>cardType</strong> - Digimon, Option, Tamer, Digi-Egg</div>
          <div><strong>color</strong> - Red, Blue, Yellow, Green, etc.</div>
          <div><strong>rarity</strong> - C, U, R, SR, SEC</div>
          <div><strong>playCost</strong> - Play cost (number)</div>
          <div><strong>dp</strong> - Digimon Power (number)</div>
          <div><strong>cardLv</strong> - Level (number)</div>
          <div><strong>form</strong> - Rookie, Champion, Ultimate, Mega</div>
          <div><strong>attribute</strong> - Vaccine, Virus, Data, Free</div>
          <div><strong>type</strong> - Digimon type</div>
          <div><strong>effect</strong> - Card effect text</div>
          <div><strong>illustrator</strong> - Artist name</div>
          <div><strong>block</strong> - Block/Set name</div>
        </div>

        <h6 class="mt-4">Examples:</h6>
        <ul class="list-disc ml-4 mt-2">
          <li><code>cardType == Digimon AND color == Red</code></li>
          <li><code>(cardType == Digimon AND color == Red) OR (color == Blue AND cardType == Option)</code></li>
          <li><code>playCost &gt;= 5 AND dp &gt;= 10000</code></li>
          <li><code>effect contains Security AND rarity == SR</code></li>
          <li><code>color == Red AND (form == Mega OR form == Ultimate)</code></li>
        </ul>

        <h6 class="mt-4">Tips:</h6>
        <ul class="list-disc ml-4 mt-2">
          <li>Field names are case-insensitive (Color, color, or colour all work)</li>
          <li>String values are case-insensitive for equality checks</li>
          <li>Use hyphens or spaces in field names (card-type or cardType)</li>
          <li>Always use parentheses to make complex queries clear</li>
        </ul>
      </div>
    </p-dialog>
  `,
  styles: [`
    .advanced-search-container {
      width: 100%;
    }

    .search-input-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }

    .cursor-pointer {
      cursor: pointer;
      color: var(--text-color-secondary);
      transition: color 0.2s;
    }

    .cursor-pointer:hover {
      color: var(--text-color);
    }

    .help-content {
      line-height: 1.6;
    }

    .help-content code {
      background: var(--surface-200);
      padding: 0.125rem 0.375rem;
      border-radius: 3px;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
    }

    .help-content h6 {
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .help-content ul {
      margin-top: 0.5rem;
    }

    .help-content li {
      margin-bottom: 0.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule
  ]
})
export class AdvancedSearchComponent implements OnInit {
  @Output() searchChange = new EventEmitter<string>();
  @ViewChild('searchAutocomplete') autocomplete!: AutoComplete;

  private filterStore = inject(FilterStore);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();
  private autocompleteService = inject(SearchAutocompleteService);

  searchQuery = signal<string>('');
  isSearching = signal(false);
  suggestions = signal<SearchSuggestion[]>([]);
  showHelp = false;

  // Sync input with store (for external updates like URL params or sidebar reset)
  private syncEffect = effect(() => {
    const storeValue = this.filterStore.advancedSearch();
    if (storeValue === null || storeValue === '') {
      this.searchQuery.set('');
    } else if (storeValue !== this.searchQuery()) {
      this.searchQuery.set(storeValue);
    }
  });

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => {
      this.isSearching.set(false);
      this.searchChange.emit(query);
    });
  }

  onQueryChange(query: string) {
    this.searchQuery.set(query);
    this.isSearching.set(true);
    this.searchSubject.next(query.trim());
  }

  onSearchChange(event: any) {
    const query = event.query || '';
    // Get autocomplete suggestions based on current cursor position
    // For simplicity, we'll provide suggestions for the last word being typed
    const suggestions = this.autocompleteService.getSuggestions(query, query.length);
    this.suggestions.set(suggestions);
  }

  onSuggestionSelected(event: any) {
    const suggestion = event as SearchSuggestion;
    if (!suggestion || !suggestion.value) {
      return;
    }

    const currentText = this.searchQuery();
    const cursorPosition = currentText.length;
    
    // Find the start of the current token
    let tokenStart = cursorPosition - 1;
    while (tokenStart >= 0 && currentText[tokenStart] !== ' ' && currentText[tokenStart] !== '(' && currentText[tokenStart] !== ')') {
      tokenStart--;
    }
    tokenStart++;

    // Replace the current token with the suggestion
    const newText = currentText.substring(0, tokenStart) + suggestion.value + ' ';
    this.searchQuery.set(newText);
    this.suggestions.set([]);
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'field':
        return 'bg-blue-200 text-blue-800';
      case 'operator':
        return 'bg-green-200 text-green-800';
      case 'logical':
        return 'bg-purple-200 text-purple-800';
      case 'value':
        return 'bg-orange-200 text-orange-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }

  onEnter() {
    // Immediate search on Enter, bypass debounce
    const query = this.searchQuery().trim();
    this.isSearching.set(false);
    this.searchChange.emit(query);
    this.suggestions.set([]);
  }

  onClear() {
    this.searchQuery.set('');
    this.isSearching.set(false);
    this.searchChange.emit('');
    this.suggestions.set([]);
  }
}
