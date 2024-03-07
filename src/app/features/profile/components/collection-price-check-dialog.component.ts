import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import {
  DigimonCard,
  dummyCard,
  GroupedSets,
  ICountCard,
  ISave,
} from '../../../../models';
import {
  ProductCM,
  ProductCMWithCount,
} from '../../../services/card-market.service';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { CardImageComponent } from '../../shared/card-image.component';

@Component({
  selector: 'digimon-collection-price-check-dialog',
  template: `
    <ng-container>
      <p-blockUI [blocked]="spinner"></p-blockUI>
      <p-progressSpinner
        *ngIf="spinner"
        class="absolute left-1/2 top-1/2 z-[5000] -translate-x-1/2 -translate-y-1/2 transform"></p-progressSpinner>

      <div class="mb-2 flex flex-col">
        <span>All Price-Information is from <b>CardMarket</b>.</span>
        <span class="text-xs"
          >Calculating the Card-Prices may take a while if you have a big
          collection.</span
        >
      </div>

      <div class="flex flex-row">
        <!--p-selectButton
          [(ngModel)]="onlyMissing"
          (ngModelChange)="showOnlyMissing()"
          [options]="[
            { label: 'Missing Cards', value: true },
            { label: 'All Cards', value: false }
          ]"
          class="mr-2 h-8"
          styleClass="h-8"
          optionLabel="label"
          optionValue="value"
        ></p-selectButton-->
        <p-multiSelect
          [filter]="false"
          [(ngModel)]="setFilter"
          [group]="true"
          [options]="groupedSets"
          [showHeader]="false"
          [showToggleAll]="false"
          placeholder="Select a Set"
          display="chip"
          scrollHeight="250px"
          class="mb-2 mr-2 w-full max-w-[250px]"
          styleClass="w-full max-w-[250px] h-8 text-sm">
          <ng-template let-group pTemplate="group">
            <div class="align-items-center flex">
              <span>{{ group.label }}</span>
            </div>
          </ng-template>
        </p-multiSelect>
        <button
          (click)="updatePrice()"
          class="surface-ground hover:primary-background text-shadow h-8 border border-black px-1 font-bold text-[#e2e4e6]">
          Check Price
        </button>
      </div>

      <div *ngIf="notFound.length > 0" class="flex flex-row flex-wrap">
        <span class="w-full">Couldn't find a price for: </span>
        <div *ngFor="let card of notFound">
          <digimon-card-image
            [card]="getCard(card.cardId)"></digimon-card-image>
        </div>
      </div>

      <p-table
        [value]="filteredProducts"
        [breakpoint]="'0px'"
        styleClass="p-datatable-sm p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>Img</th>
            <th>Count</th>
            <th>ID</th>
            <th>Name</th>
            <th>Low Price</th>
            <th>Avg. Sell Price</th>
            <th>Trend Price</th>
            <th>AVG1</th>
            <th>AVG7</th>
            <th>AVG30</th>
            <th>CM</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <th>
              <digimon-card-image
                [card]="getCard(product.cardId)"></digimon-card-image>
            </th>
            <th>{{ product.count }}</th>
            <td>{{ product.cardId }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.lowPrice | currency: 'EUR' }}</td>
            <td>{{ product.avgSellPrice | currency: 'EUR' }}</td>
            <td>{{ product.trendPrice | currency: 'EUR' }}</td>
            <td>{{ product.avg1 | currency: 'EUR' }}</td>
            <td>{{ product.avg7 | currency: 'EUR' }}</td>
            <td>{{ product.avg30 | currency: 'EUR' }}</td>
            <td class="bg-white">
              <a [href]="product.link" target="_blank">
                <img
                  class="max-h-[2rem]"
                  src="assets/icons/CardmarketLogo.png"
                  alt="Link to CardMarket" />
              </a>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="footer">
          <tr *ngIf="filteredProducts.length > 0; else noEntry">
            <td colspan="3">Totals</td>
            <td>{{ totalProducts.lowPrice | currency: 'EUR' }}</td>
            <td>{{ totalProducts.avgSellPrice | currency: 'EUR' }}</td>
            <td>{{ totalProducts.trendPrice | currency: 'EUR' }}</td>
            <td>{{ totalProducts.avg1 | currency: 'EUR' }}</td>
            <td>{{ totalProducts.avg7 | currency: 'EUR' }}</td>
            <td>{{ totalProducts.avg30 | currency: 'EUR' }}</td>
            <td></td>
          </tr>
          <ng-template #noEntry>
            <td colspan="9" class="py-1 text-center">No cards found!</td>
          </ng-template>
        </ng-template>
      </p-table>

      <div class="flex flex-col text-xs">
        <span><b>Disclaimer:</b></span>
        <span>
          Not all cards may have a price or they could be linked wrong.</span
        >
        <span> The Prices are updated once a day.</span>
        <span> TCGPlayer doesn't give out access to their API anymore.</span>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
      }

      :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > th {
        position: -webkit-sticky;
        position: sticky;
        bottom: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [
    NgIf,
    BlockUIModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    FormsModule,
    SharedModule,
    NgFor,
    CardImageComponent,
    TableModule,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class CollectionPriceCheckDialogComponent {
  @Input() save: ISave;

  websiteStore = inject(WebsiteStore);

  prizeGuide = this.websiteStore.priceGuideCM();
  onlyMissing = false;
  spinner = false;

  products: ProductCMWithCount[] = [];
  filteredProducts: ProductCMWithCount[] = [];
  notFound: ProductCMWithCount[] = [];

  totalProducts: ProductCMWithCount;

  setFilter: string[] = [];
  groupedSets = GroupedSets;

  private digimonCardStore = inject(DigimonCardStore);

  updatePrice() {
    this.spinner = true;
    const filteredCollection = this.filterCollection();
    const all: ProductCMWithCount[] = filteredCollection
      .map((card) => {
        const foundProduct: ProductCM =
          this.prizeGuide.find((product) => card.id === product.cardId) ??
          this.emptyProduct(card);

        return { ...foundProduct, count: card.count } as ProductCMWithCount;
      })
      .map((product) => ({
        ...product,
        avgSellPrice: product.avgSellPrice * product.count,
        lowPrice: product.lowPrice * product.count,
        trendPrice: product.trendPrice * product.count,
        suggestedPrice: product.suggestedPrice * product.count,
        avg1: product.avg1 * product.count,
        avg7: product.avg7 * product.count,
        avg30: product.avg30 * product.count,
      }));

    this.products = all.filter((value) => value.idProduct !== 0);
    this.filteredProducts = this.products;
    this.notFound = all.filter((value) => value.idProduct === 0);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalProducts = {
      count: 0,
      idProduct: 0,
      name: '',
      cardId: '',
      link: '',
      avgSellPrice: 0,
      lowPrice: 0,
      trendPrice: 0,
      germanProLow: 0,
      suggestedPrice: 0,
      foilSell: 0,
      foilLow: 0,
      foilTrend: 0,
      lowPriceEx: 0,
      avg1: 0,
      avg7: 0,
      avg30: 0,
      foil1: 0,
      foil7: 0,
      foil30: 0,
    };

    this.products.forEach((product) => {
      this.totalProducts.avgSellPrice += product.avgSellPrice;
      this.totalProducts.lowPrice += product.lowPrice;
      this.totalProducts.trendPrice += product.trendPrice;
      this.totalProducts.avg1 += product.avg1;
      this.totalProducts.avg7 += product.avg7;
      this.totalProducts.avg30 += product.avg30;
    });
    this.spinner = false;
  }

  getMissingCards = (): ProductCMWithCount[] => {
    return this.products
      .map((product) => {
        const foundCard = this.filterCollection().find(
          (collectionCard) => collectionCard.id === product.cardId,
        );
        if (foundCard) {
          return { ...product, count: product.count - foundCard.count };
        } else {
          return product;
        }
      })
      .filter((product) => product.count > 0);
  };

  emptyProduct(card: ICountCard): ProductCM {
    return {
      idProduct: 0,
      cardId: card.id,
      name: card.id,
      avgSellPrice: 0,
      lowPrice: 0,
      trendPrice: 0,
      germanProLow: 0,
      suggestedPrice: 0,
      foilSell: 0,
      foilLow: 0,
      foilTrend: 0,
      lowPriceEx: 0,
      avg1: 0,
      avg7: 0,
      avg30: 0,
      foil1: 0,
      foil7: 0,
      foil30: 0,
      link: '',
    };
  }

  getCard = (cardId: string): DigimonCard => {
    const card = this.digimonCardStore.cardsMap().get(cardId);
    return card ? card : JSON.parse(JSON.stringify(dummyCard));
  };

  private filterCollection(): ICountCard[] {
    if (this.setFilter.length === 0) {
      return this.save.collection;
    }

    return this.save.collection.filter((card) => {
      for (let set of this.setFilter) {
        if (card.id.includes(set + '-')) {
          return true;
        }
      }
      return false;
    });
  }
}
