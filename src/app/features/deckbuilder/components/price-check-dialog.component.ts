import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { ProductCM } from '../../../service/card-market.service';
import { DeckBuilderViewModel } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-price-check-dialog',
  template: `
    <p-table [value]="products" styleClass="p-datatable-sm p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
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
          <td>{{ product?.cardId }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product?.lowPrice | currency: 'EUR' }}</td>
          <td>{{ product?.avgSellPrice | currency: 'EUR' }}</td>
          <td>{{ product?.trendPrice | currency: 'EUR' }}</td>
          <td>{{ product?.avg1 | currency: 'EUR' }}</td>
          <td>{{ product?.avg7 | currency: 'EUR' }}</td>
          <td>{{ product?.avg30 | currency: 'EUR' }}</td>
          <td>
            <a [href]="product.link" target="_blank">
              <img
                class="max-h-[2rem]"
                src="assets/icons/CardmarketLogo.png"
                alt="Link to CardMarket"
              />
            </a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="footer">
        <tr>
          <td colspan="2">Totals</td>
          <td>{{ totalProducts?.lowPrice | currency: 'EUR' }}</td>
          <td>{{ totalProducts?.avgSellPrice | currency: 'EUR' }}</td>
          <td>{{ totalProducts?.trendPrice | currency: 'EUR' }}</td>
          <td>{{ totalProducts?.avg1 | currency: 'EUR' }}</td>
          <td>{{ totalProducts?.avg7 | currency: 'EUR' }}</td>
          <td>{{ totalProducts?.avg30 | currency: 'EUR' }}</td>
          <td></td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [
    `
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 1rem;
      }

      :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > th {
        position: -webkit-sticky;
        position: sticky;
        bottom: 1rem;
      }
    `,
  ],
})
export class PriceCheckDialogComponent implements OnInit, OnDestroy {
  @Input() deckBuilderViewModel: DeckBuilderViewModel;
  @Input() checkPrice: BehaviorSubject<boolean>;

  products: ProductCM[] = [];

  totalProducts: ProductCM;

  onDestroy$ = new Subject();

  ngOnInit() {
    this.checkPrice
      .pipe(
        filter((value) => value),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => this.updatePrice());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  updatePrice() {
    const all = this.deckBuilderViewModel.deck.cards.map((card) => {
      const foundProduct = this.deckBuilderViewModel.priceGuideCM.find(
        (product) => card.id === product.cardId
      );
      return foundProduct ?? null;
    });

    this.products = (all.filter((value) => value) as ProductCM[]) ?? [];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalProducts = {
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
}
