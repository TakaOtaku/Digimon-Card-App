import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, EventEmitter, inject, OnInit, Output, signal, untracked, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FilterStore } from '@store';
import { SearchAutocompleteService, SearchSuggestion } from '@services';

@Component({
  selector: 'digimon-advanced-search',
  template: `
    <div class="advanced-search-container">
      <div class="search-input-container">
        <div class="search-field">
          <i class="pi pi-search search-field-icon"></i>
          <input
            #searchInput
            type="text"
            pInputText
            autocomplete="off"
            class="w-full search-field-input"
            (input)="onInput($event)"
            (keydown)="onKeyDown($event)"
            (focus)="onFocus()"
            (blur)="onBlur()"
            placeholder="Search cards... (e.g., Agumon, or cardType == Digimon AND color == Red)"
            aria-label="Search cards" />

          @if (showSuggestions() && suggestions().length > 0) {
            <ul class="suggestions-panel" role="listbox">
              @for (item of suggestions(); track item.value; let i = $index) {
                <li
                  role="option"
                  [attr.aria-selected]="i === activeIndex()"
                  class="suggestion-item"
                  [class.active]="i === activeIndex()"
                  (mousedown)="selectSuggestion(item, $event)"
                  (mouseenter)="activeIndex.set(i)">
                  <div class="flex flex-col">
                    <span class="font-semibold">{{ item.label }}</span>
                    <span class="text-xs text-gray-400" *ngIf="item.description">{{ item.description }}</span>
                  </div>
                  <span class="text-xs px-2 py-1 rounded category-badge" [ngClass]="getCategoryClass(item.category)">
                    {{ item.category }}
                  </span>
                </li>
              }
            </ul>
          }
        </div>

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

    /* The input plus its floating suggestion panel */
    .search-field {
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
    }

    .search-field-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-color-secondary);
      pointer-events: none;
      z-index: 1;
    }

    .search-field-input {
      width: 100%;
      padding-left: 2.25rem;
    }

    .suggestions-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      z-index: 1100;
      margin: 0;
      padding: 0.25rem;
      list-style: none;
      max-height: 320px;
      overflow-y: auto;
      background: var(--surface-overlay, #1f2937);
      border: 1px solid var(--surface-border, #374151);
      border-radius: 6px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      color: var(--text-color, #e5e7eb);
    }

    .suggestion-item:hover,
    .suggestion-item.active {
      background: var(--surface-hover, #374151);
    }

    .category-badge {
      white-space: nowrap;
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
    TooltipModule
  ]
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  @Output() searchChange = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private filterStore = inject(FilterStore);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();
  private autocompleteService = inject(SearchAutocompleteService);

  searchQuery = signal<string>('');
  isSearching = signal(false);
  suggestions = signal<SearchSuggestion[]>([]);
  showSuggestions = signal(false);
  activeIndex = signal(-1);
  showHelp = false;

  // Tracks the last query we emitted so store echoes don't clobber local edits.
  private lastEmitted = '';

  // Sync input with store (for external updates like URL params or sidebar reset)
  private syncEffect = effect(() => {
    const storeValue = this.filterStore.advancedSearch() ?? '';
    // Ignore echoes of our own emissions.
    if (storeValue.trim() === this.lastEmitted) {
      return;
    }
    const current = untracked(() => this.searchQuery());
    if (storeValue.trim() === current.trim()) {
      return;
    }
    this.searchQuery.set(storeValue);
    const el = this.searchInput?.nativeElement;
    if (el && el.value !== storeValue) {
      el.value = storeValue;
    }
  });

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      map(value => (value ?? '').trim()),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => {
      this.isSearching.set(false);
      this.lastEmitted = query;
      this.searchChange.emit(query);
    });
  }

  ngAfterViewInit(): void {
    const el = this.searchInput?.nativeElement;
    if (el && this.searchQuery()) {
      el.value = this.searchQuery();
    }
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.searchQuery.set(value);
    this.updateSuggestions(value);
    this.showSuggestions.set(true);
    this.isSearching.set(true);
    this.searchSubject.next(value);
  }

  onFocus() {
    this.updateSuggestions(this.searchQuery());
    this.showSuggestions.set(true);
  }

  onBlur() {
    // Delay so a suggestion click (mousedown) can register before closing.
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  onKeyDown(event: KeyboardEvent) {
    const items = this.suggestions();
    const open = this.showSuggestions() && items.length > 0;

    if (event.key === 'ArrowDown' && open) {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() + 1) % items.length);
      return;
    }
    if (event.key === 'ArrowUp' && open) {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() - 1 + items.length) % items.length);
      return;
    }
    if (event.key === 'Escape') {
      this.showSuggestions.set(false);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (open && this.activeIndex() >= 0) {
        this.selectSuggestion(items[this.activeIndex()], event);
      } else {
        this.onEnter();
      }
    }
  }

  selectSuggestion(item: SearchSuggestion, event?: Event) {
    event?.preventDefault();
    if (!item || !item.value) {
      return;
    }

    const base = this.searchQuery();

    // Replace only the token currently being typed, keeping everything before it.
    let tokenStart = base.length;
    while (tokenStart > 0 && !/[\s()]/.test(base[tokenStart - 1])) {
      tokenStart--;
    }

    const newText = base.substring(0, tokenStart) + item.value + ' ';
    this.searchQuery.set(newText);

    const el = this.searchInput?.nativeElement;
    if (el) {
      el.value = newText;
      el.focus();
      el.setSelectionRange(newText.length, newText.length);
    }

    // Immediately offer suggestions for the next token in the query.
    this.updateSuggestions(newText);
    this.showSuggestions.set(true);

    this.isSearching.set(true);
    this.searchSubject.next(newText);
  }

  private updateSuggestions(query: string) {
    const value = query ?? '';
    this.suggestions.set(this.autocompleteService.getSuggestions(value, value.length));
    this.activeIndex.set(-1);
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
    this.lastEmitted = query;
    this.searchChange.emit(query);
    this.showSuggestions.set(false);
  }

  onClear() {
    this.searchQuery.set('');
    const el = this.searchInput?.nativeElement;
    if (el) {
      el.value = '';
    }
    this.isSearching.set(false);
    this.lastEmitted = '';
    this.searchChange.emit('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
  }
}
