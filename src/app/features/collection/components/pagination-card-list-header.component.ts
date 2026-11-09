import { CurrencyPipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PriceMetric } from '@models';
import { PaginatorModule } from 'primeng/paginator';
import { SliderModule } from 'primeng/slider';
import { SaveStore } from '@store';
import { DigimonCardStore } from '@store';
import { CardMarketService } from '../../../services/card-market.service';

@Component({
  selector: 'digimon-pagination-card-list-header',
  template: `
    <!-- Phones wrap the slider onto its own row: centered between absolute side groups it covered their buttons -->
    <div class="relative flex w-full flex-row flex-wrap items-center justify-between gap-2 px-2 py-1 sm:min-h-10 sm:flex-nowrap sm:justify-between sm:gap-3 sm:px-2 sm:py-0">
      <div class="flex flex-row items-center justify-center gap-3">
        <ng-content select="[headerStart]"></ng-content>
        <div *ngIf="!viewOnly" class="flex flex-row justify-center items-center">
        @if (showCollectionMode) {
        <span class="text-xs hidden sm:block font-bold text-fg">Collection Mode:</span>
        <span class="text-xs sm:hidden font-bold text-fg">Owned:</span>
        <input type="checkbox" class="my-auto ml-1 h-5 w-5" [ngModel]="collectionMode()" (ngModelChange)="changeCollectionMode($event)" />
        }
        <span class="text-xs font-bold text-fg" [class.ml-6]="showCollectionMode"> Cards: <span class="font-mono">{{ cardCount() | number }}</span> </span>
        @if (saveStore.showPrices() && collectionValue() !== null) {
          <span class="ml-4 text-xs font-bold text-green-400"><span class="font-mono">{{ collectionValue() | currency: 'EUR' }}</span></span>
        }
        </div>
      </div>

      <p-slider class="order-last mx-auto w-48 sm:order-none sm:mx-0 sm:w-32 sm:min-w-0 sm:flex-1 sm:max-w-56" [formControl]="widthForm" [step]="0.1" [min]="3" [max]="14"></p-slider>

      <div class="flex flex-row items-center justify-center gap-2">
        <ng-content select="[headerEnd]"></ng-content>
        <button
          [ngClass]="{ 'xl:hidden': !filterButton }"
          (click)="closeFilterSidebox()"
          class="flex flex-row sm:justify-center min-w-auto primary-background h-8 w-8 sm:w-24 rounded p-2 text-xs font-semibold text-fg">
          <i class="pi pi-filter-fill mr-3"></i>
          <span class="hidden sm:block">Filter</span>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PaginatorModule, FormsModule, NgIf, SliderModule, ReactiveFormsModule, NgClass, CurrencyPipe, DecimalPipe],
})
export class PaginationCardListHeaderComponent {
  @Input() widthForm!: FormControl;
  @Input() viewOnly!: boolean;
  @Input() showCollectionMode = true;
  @Input() filterButton: boolean | null = true;
  @Output() filterBox = new EventEmitter<boolean>();

  saveStore = inject(SaveStore);
  digimonCardStore = inject(DigimonCardStore);
  private cardMarketService = inject(CardMarketService);
  private pricesLoaded = toSignal(this.cardMarketService.priceMap$);

  collectionMode = this.saveStore.collectionMode;

  cardCount = computed(() => {
    return this.digimonCardStore.filteredCards().length;
  });

  collectionValue = computed(() => {
    if (!this.pricesLoaded()) return null;
    const collection = this.saveStore.collection();
    if (!collection.length) return null;
    const metric = (this.saveStore.settings().priceMetric as PriceMetric) || PriceMetric.Trend;
    return this.cardMarketService.calculateTotalValue(collection, metric);
  });

  changeCollectionMode(collectionMode: boolean) {
    const settings = this.saveStore.settings();
    this.saveStore.updateSettings({ ...settings, collectionMode });
  }

  closeFilterSidebox() {
    this.filterBox.emit(true);
  }
}
