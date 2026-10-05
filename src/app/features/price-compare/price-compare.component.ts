import { CurrencyPipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DigimonCard, PriceMetric } from '@models';
import { DigimonCardStore, SaveStore } from '@store';
import { CardMarketService, ProductCM, ProductCMRaw } from '../../services/card-market.service';
import { PageComponent } from '../shared/page.component';
import { CardImageComponent } from '../shared/card-image.component';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';

interface CardVariant {
    card: DigimonCard;
    price: number;
    product: ProductCM | null;
    assignedProductId: number | null;
}

interface CardVariantGroup {
    cardNumber: string;
    variants: CardVariant[];
    cmProducts: ProductCMRaw[];
    isSuspect: boolean;
    versionsLink: string;
}

@Component({
    selector: 'digimon-price-compare',
    template: `
    <digimon-page flex="col">
      <div class="w-full h-full p-4 flex flex-col gap-3 overflow-hidden">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-xl font-bold text-[var(--text-color)]">Price Mapping Verifier</h1>
          <p-toggleButton
            [(ngModel)]="onlySuspect"
            onLabel="Suspects Only"
            offLabel="Show All"
            (onChange)="applyFilter()">
          </p-toggleButton>
          <p-toggleButton
            [(ngModel)]="hideVerified"
            onLabel="Hide Verified"
            offLabel="Show Verified"
            (onChange)="applyFilter()">
          </p-toggleButton>
          <input
            pInputText
            type="text"
            placeholder="Filter by card number..."
            [(ngModel)]="searchTerm"
            (input)="applyFilter()" />
          <span class="text-sm text-[var(--text-color-secondary)]">
            {{ currentIndex() + 1 }} / {{ filteredGroups().length }}
            ({{ suspectCount() }} suspect)
          </span>
          <span class="text-sm text-green-400">
            ✓ {{ verifiedCount() }} / {{ allGroups().length }} verified
          </span>
          @if (overrideCount() > 0 || verifiedCount() > 0) {
            <button pButton label="Export ({{ overrideCount() }} overrides, {{ verifiedCount() }} verified)" icon="pi pi-download"
              class="p-button-success p-button-sm" (click)="exportOverrides()"></button>
            <button pButton label="Clear Overrides" icon="pi pi-times"
              class="p-button-danger p-button-sm p-button-outlined" (click)="clearOverrides()"></button>
          }
        </div>

        @if (currentGroup(); as group) {
          <!-- Navigation -->
          <div class="flex items-center gap-2">
            <button pButton icon="pi pi-chevron-left" class="p-button-text p-button-lg"
              [disabled]="currentIndex() === 0" (click)="prev()"></button>

            <div class="flex-1 flex items-center gap-3">
              <span class="text-lg font-bold text-[var(--text-color)]">{{ group.cardNumber }}</span>
              @if (group.isSuspect) {
                <span class="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded">⚠ SUSPECT</span>
              }
              @if (isGroupVerified(group)) {
                <button pButton icon="pi pi-check" label="Verified"
                  class="p-button-success p-button-sm p-button-outlined"
                  (click)="toggleGroupVerified(group)"></button>
              } @else {
                <button pButton icon="pi pi-check" label="Mark OK"
                  class="p-button-secondary p-button-sm p-button-text"
                  (click)="toggleGroupVerified(group)"></button>
              }
              <a [href]="group.versionsLink" target="cardmarket" rel="noopener"
                class="text-xs text-blue-400 hover:text-blue-300 underline ml-auto">
                Open in new tab ↗
              </a>
            </div>

            <button pButton icon="pi pi-chevron-right" class="p-button-text p-button-lg"
              [disabled]="currentIndex() >= filteredGroups().length - 1" (click)="next()"></button>
          </div>

          <!-- Main Content: Cards + Products on top, iframe below -->
          <div class="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
            <div class="flex gap-6 flex-wrap lg:flex-nowrap">
              <!-- App Card Variants -->
              <div class="flex flex-col gap-2">
                <span class="text-xs font-semibold text-[var(--text-color-secondary)] uppercase">App Variants ({{ group.variants.length }})</span>
                <div class="flex flex-wrap gap-3">
                  @for (variant of group.variants; track variant.card.id) {
                    <div
                      class="flex flex-col items-center gap-1 w-[160px] p-2 rounded cursor-pointer border-2 transition-all"
                      [ngClass]="{
                        'border-blue-500 bg-blue-500/20': selectedVariant()?.card.id === variant.card.id && selectedGroup() === group.cardNumber,
                        'border-transparent hover:border-[var(--surface-border)]': !(selectedVariant()?.card.id === variant.card.id && selectedGroup() === group.cardNumber)
                      }"
                      (click)="selectVariant(variant, group.cardNumber)">
                      <div class="relative w-full">
                        <digimon-card-image [card]="variant.card"></digimon-card-image>
                        <span
                          class="absolute top-1 left-1 z-[100] rounded bg-black/70 px-1.5 py-0.5 text-sm font-bold"
                          [ngClass]="variant.price > 50 ? 'text-red-400' : variant.price > 10 ? 'text-yellow-400' : 'text-green-400'">
                          {{ variant.price | currency: 'EUR' }}
                        </span>
                      </div>
                      <span class="text-xs text-[var(--text-color-secondary)] text-center truncate w-full" [title]="variant.card.id">
                        {{ variant.card.id }}
                      </span>
                      <span class="text-[10px] text-[var(--text-color-secondary)] text-center truncate w-full">
                        {{ variant.card.version }}
                      </span>
                      @if (getOverrideForVariant(variant.card.id); as ov) {
                        <span class="text-[10px] text-green-400 font-bold">✓ Reassigned</span>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Cardmarket Products -->
              <div class="flex flex-col gap-2 border-l border-[var(--surface-border)] pl-4">
                <span class="text-xs font-semibold text-[var(--text-color-secondary)] uppercase">
                  Cardmarket Products ({{ group.cmProducts.length }})
                  @if (selectedVariant() && selectedGroup() === group.cardNumber) {
                    — Click to assign to <span class="text-blue-400">{{ selectedVariant()!.card.id }}</span>
                  }
                </span>
                <div class="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                  @for (cm of group.cmProducts; track cm.idProduct) {
                    <div
                      class="flex flex-col items-start gap-0.5 p-2 rounded border cursor-pointer transition-all min-w-[180px]"
                      [ngClass]="{
                        'border-green-500 bg-green-500/10': isProductAssignedTo(cm.idProduct, group.cardNumber),
                        'border-[var(--surface-border)] hover:border-blue-400 hover:bg-blue-500/5': !isProductAssignedTo(cm.idProduct, group.cardNumber)
                      }"
                      (click)="assignProduct(cm, group.cardNumber)">
                      <span class="text-sm font-medium text-[var(--text-color)]">
                        id: {{ cm.idProduct }}
                      </span>
                      <span class="text-xs text-[var(--text-color-secondary)]">
                        Exp: {{ cm.idExpansion }}
                      </span>
                      <div class="flex gap-2 text-xs">
                        <span class="text-green-400">Trend: {{ cm.trendPrice | currency: 'EUR' }}</span>
                        <span class="text-yellow-400">Low: {{ cm.lowPrice | currency: 'EUR' }}</span>
                      </div>
                      @if (getAssignedCardId(cm.idProduct); as assignedId) {
                        <span class="text-[10px] text-green-400 font-bold">→ {{ assignedId }}</span>
                      } @else {
                        @if (getMappedCardId(cm.idProduct); as mappedId) {
                          <span class="text-[10px] text-[var(--text-color-secondary)]">mapped: {{ mappedId }}</span>
                        }
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="flex items-center justify-center flex-1 text-[var(--text-color-secondary)]">
            No groups to display. Adjust filters or wait for data to load.
          </div>
        }
      </div>
    </digimon-page>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        PageComponent,
        CardImageComponent,
        CurrencyPipe,
        NgClass,
        FormsModule,
        InputTextModule,
        ToggleButtonModule,
        ButtonModule,
    ],
})
export class PriceCompareComponent {
    private digimonCardStore = inject(DigimonCardStore);
    private saveStore = inject(SaveStore);
    private cardMarketService = inject(CardMarketService);
    private http = inject(HttpClient);

    searchTerm = '';
    onlySuspect = true;
    hideVerified = true;

    // Navigation
    currentIndex = signal(0);
    currentGroup = computed(() => this.filteredGroups()[this.currentIndex()] ?? null);

    // Selection state for reassignment
    selectedVariant = signal<CardVariant | null>(null);
    selectedGroup = signal<string | null>(null);

    // Overrides: idProduct → cardId (user's reassignments)
    overrides = signal<Map<string, string>>(new Map());
    overrideCount = computed(() => this.overrides().size);

    // Verified card IDs (individual variants, not card numbers)
    verifiedCards = signal<Set<string>>(this.loadVerified());
    verifiedCount = computed(() => {
        const verified = this.verifiedCards();
        return this.allGroups().filter((g) => g.variants.every((v) => verified.has(v.card.id))).length;
    });

    allGroups = computed(() => this.buildGroups());
    suspectCount = computed(() => this.allGroups().filter((g) => g.isSuspect).length);
    filteredGroups = signal<CardVariantGroup[]>([]);

    constructor() {
        this.loadVerifiedFromFile();

        effect(() => {
            const groups = this.allGroups();
            if (groups.length > 0) {
                this.applyFilter();
            }
        });

        this.cardMarketService.priceMap$.subscribe(() => {
            this.applyFilter();
        });
    }

    applyFilter(): void {
        let groups = this.allGroups();
        if (this.onlySuspect) {
            groups = groups.filter((g) => g.isSuspect);
        }
        if (this.hideVerified) {
            groups = groups.filter((g) => !this.isGroupVerified(g));
        }
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.trim().toUpperCase();
            groups = groups.filter((g) => g.cardNumber.toUpperCase().includes(term));
        }
        this.filteredGroups.set(groups);
        if (this.currentIndex() >= groups.length) {
            this.currentIndex.set(Math.max(0, groups.length - 1));
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowLeft') {
            this.prev();
        } else if (event.key === 'ArrowRight') {
            this.next();
        }
    }

    prev(): void {
        this.currentIndex.update((i) => Math.max(0, i - 1));
    }

    next(): void {
        this.currentIndex.update((i) => Math.min(this.filteredGroups().length - 1, i + 1));
    }

    selectVariant(variant: CardVariant, groupCardNumber: string): void {
        if (this.selectedVariant()?.card.id === variant.card.id && this.selectedGroup() === groupCardNumber) {
            this.selectedVariant.set(null);
            this.selectedGroup.set(null);
        } else {
            this.selectedVariant.set(variant);
            this.selectedGroup.set(groupCardNumber);
        }
    }

    assignProduct(cm: ProductCMRaw, groupCardNumber: string): void {
        const variant = this.selectedVariant();
        if (!variant || this.selectedGroup() !== groupCardNumber) return;

        const newMap = new Map(this.overrides());

        // Remove any existing assignment for this card variant (1:1 mapping)
        for (const [existingId, existingCardId] of newMap) {
            if (existingCardId === variant.card.id) {
                newMap.delete(existingId);
            }
        }

        // Remove any existing assignment for this product (1:1 mapping)
        newMap.delete(String(cm.idProduct));

        // Set the new assignment
        newMap.set(String(cm.idProduct), variant.card.id);
        this.overrides.set(newMap);

        // Auto-verify the reassigned variant
        const newVerified = new Set(this.verifiedCards());
        newVerified.add(variant.card.id);
        this.verifiedCards.set(newVerified);
        this.saveVerified(newVerified);

        // Deselect
        this.selectedVariant.set(null);
        this.selectedGroup.set(null);
    }

    getOverrideForVariant(cardId: string): string | null {
        for (const [idProduct, cId] of this.overrides()) {
            if (cId === cardId) return idProduct;
        }
        return null;
    }

    getAssignedCardId(idProduct: number): string | null {
        return this.overrides().get(String(idProduct)) ?? null;
    }

    getMappedCardId(idProduct: number): string | null {
        const idMap = this.cardMarketService.getIdMap();
        return idMap[String(idProduct)] ?? null;
    }

    isProductAssignedTo(idProduct: number, _groupCardNumber: string): boolean {
        return this.overrides().has(String(idProduct));
    }

    exportOverrides(): void {
        const obj: Record<string, string | string[]> = {};
        for (const [key, value] of this.overrides()) {
            obj[key] = value;
        }
        const verified = [...this.verifiedCards()];
        if (verified.length > 0) {
            obj['_verified'] = verified.sort();
        }
        const json = JSON.stringify(obj, null, 2);

        // Copy to clipboard and also download
        navigator.clipboard.writeText(json);

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cardmarket-id-overrides.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    clearOverrides(): void {
        this.overrides.set(new Map());
    }

    isGroupVerified(group: CardVariantGroup): boolean {
        const verified = this.verifiedCards();
        return group.variants.every((v) => verified.has(v.card.id));
    }

    toggleGroupVerified(group: CardVariantGroup): void {
        const newSet = new Set(this.verifiedCards());
        const allVerified = this.isGroupVerified(group);
        for (const variant of group.variants) {
            if (allVerified) {
                newSet.delete(variant.card.id);
            } else {
                newSet.add(variant.card.id);
            }
        }
        this.verifiedCards.set(newSet);
        this.saveVerified(newSet);
        this.applyFilter();
    }

    private loadVerified(): Set<string> {
        const stored = localStorage.getItem('price-compare-verified');
        if (stored) {
            return new Set(JSON.parse(stored));
        }
        return new Set();
    }

    private loadVerifiedFromFile(): void {
        this.http.get<Record<string, unknown>>('assets/cardmarket/cardmarket-id-overrides.json').subscribe({
            next: (data) => {
                const fileVerified = data['_verified'];
                if (Array.isArray(fileVerified)) {
                    const merged = new Set(this.verifiedCards());
                    for (const card of fileVerified) {
                        merged.add(card);
                    }
                    this.verifiedCards.set(merged);
                    this.saveVerified(merged);
                    this.applyFilter();
                }
            },
            error: () => { /* file may not exist yet */ },
        });
    }

    private saveVerified(verified: Set<string>): void {
        localStorage.setItem('price-compare-verified', JSON.stringify([...verified]));
    }

    private buildGroups(): CardVariantGroup[] {
        const cards = this.digimonCardStore.cards();
        if (!cards.length || !this.cardMarketService.isLoaded()) return [];

        const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;

        // Group cards by cardNumber
        const groupMap = new Map<string, DigimonCard[]>();
        for (const card of cards) {
            if (!card.cardNumber) continue;
            const existing = groupMap.get(card.cardNumber);
            if (existing) {
                existing.push(card);
            } else {
                groupMap.set(card.cardNumber, [card]);
            }
        }

        const groups: CardVariantGroup[] = [];
        for (const [cardNumber, variants] of groupMap) {
            if (variants.length < 2) continue;

            // Sort: base first, then _P0, _P1, _P2...
            variants.sort((a, b) => {
                const aHasP = a.id.includes('_');
                const bHasP = b.id.includes('_');
                if (!aHasP && bHasP) return -1;
                if (aHasP && !bHasP) return 1;
                return a.id.localeCompare(b.id);
            });

            const variantData: CardVariant[] = variants.map((card) => {
                const product = this.cardMarketService.getPriceData(card.id);
                const price = this.cardMarketService.getPrice(card.id, metric) ?? 0;
                return { card, price, product, assignedProductId: product?.idProduct ?? null };
            });

            // Get all CM products for this card number
            const cmProducts = this.cardMarketService.getProductsByCardNumber(cardNumber);

            // Suspect: base card is more than 5× any alt's price
            const basePrice = variantData[0]?.price ?? 0;
            const altPrices = variantData.slice(1).map((v) => v.price).filter((p) => p > 0);
            const isSuspect = basePrice > 0 && altPrices.length > 0 && basePrice > Math.min(...altPrices) * 5;

            // Build versions link from card name
            const firstProduct = cmProducts[0];
            const slug = firstProduct
                ? firstProduct.name.replace(/[()]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').replace(/-$/, '')
                : cardNumber;
            const versionsLink = `https://www.cardmarket.com/en/Digimon/Cards/${slug}/Versions`;

            groups.push({ cardNumber, variants: variantData, cmProducts, isSuspect, versionsLink });
        }

        // Sort suspects first, then alphabetical
        groups.sort((a, b) => {
            if (a.isSuspect !== b.isSuspect) return a.isSuspect ? -1 : 1;
            return a.cardNumber.localeCompare(b.cardNumber);
        });

        return groups;
    }
}
