import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { async, BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { ICountCard } from '../../../../models';
import {
  CardMarketService,
  ProductCM,
  ProductCMWithCount,
} from '../../../services/card-market.service';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';

@Component({
  selector: 'digimon-price-check-dialog',
  template: `
    <div class="flex flex-col">
      <span>All Price-Information is from <b>CardMarket</b>.</span>
    </div>

    <div>Switch between Missing Cards and complete deck.</div>
    <div class="flex flex-col">
      <p-selectButton
        [(ngModel)]="onlyMissing"
        (ngModelChange)="showOnlyMissing()"
        [options]="[
          { label: 'Missing Cards', value: true },
          { label: 'All Cards', value: false }
        ]"
        class="mx-auto"
        optionLabel="label"
        optionValue="value"></p-selectButton>
    </div>

    <div *ngIf="notFound.length > 0" class="flex flex-row flex-wrap">
      Couldn't find a price for:
      <span *ngFor="let card of notFound" class="mx-1 font-bold">{{
        card.cardId
      }}</span>
    </div>

    <p-table
      [value]="filteredProducts"
      [breakpoint]="'0px'"
      styleClass="p-datatable-sm p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
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
          <td colspan="9" class="py-1 text-center">No missing cards found!</td>
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
    SelectButtonModule,
    FormsModule,
    NgIf,
    NgFor,
    TableModule,
    SharedModule,
    CurrencyPipe,
    AsyncPipe,
  ],
})
export class PriceCheckDialogComponent implements OnInit, OnDestroy {
  @Input() checkPrice: BehaviorSubject<boolean>;
  websiteStore = inject(WebsiteStore);
  saveStore = inject(SaveStore);

  getPriceGuide$ = this.cardMarketService.getPrizeGuide();

  onlyMissing = false;

  products: ProductCMWithCount[] = [];
  filteredProducts: ProductCMWithCount[] = [];
  notFound: ProductCMWithCount[] = [];

  totalProducts: ProductCMWithCount;

  onDestroy$ = new Subject();
  protected readonly async = async;

  constructor(private cardMarketService: CardMarketService) {}

  ngOnInit() {
    this.getPriceGuide$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((priceGuide) => {
        this.websiteStore.updatePriceGuideCM(priceGuide);
        this.updatePrice();
      });

    this.checkPrice
      .pipe(
        filter((value) => value),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.updatePrice());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  updatePrice() {
    const all: ProductCMWithCount[] = this.websiteStore
      .deck()
      .cards.map((card) => {
        const foundProduct: ProductCM =
          this.websiteStore
            .priceGuideCM()
            .find((product) => card.id === product.cardId) ??
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
  }

  showOnlyMissing() {
    this.filteredProducts = this.onlyMissing
      ? this.getMissingCards()
      : this.products;
  }

  getMissingCards = (): ProductCMWithCount[] => {
    return this.products
      .map((product) => {
        const foundCard = this.saveStore
          .collection()
          .find((collectionCard) => collectionCard.id === product.cardId);
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
}
