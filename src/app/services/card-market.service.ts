import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, ReplaySubject, shareReplay, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PriceMetric } from '../../models';

export interface PriceGuideEntry {
  idProduct: number;
  idCategory: number;
  avg: number | null;
  low: number | null;
  trend: number | null;
  avg1: number | null;
  avg7: number | null;
  avg30: number | null;
  'avg-foil': number | null;
  'low-foil': number | null;
  'trend-foil': number | null;
  'avg1-foil': number | null;
  'avg7-foil': number | null;
  'avg30-foil': number | null;
}

export interface ProductSingle {
  idProduct: number;
  name: string;
  idCategory: number;
  categoryName: string;
  idExpansion: number;
  idMetacard: number;
  dateAdded: string;
}

export interface ProductCM {
  idProduct: number;
  cardId: string;
  name: string;
  avgSellPrice: number;
  lowPrice: number;
  trendPrice: number;
  germanProLow: number;
  suggestedPrice: number;
  foilSell: number;
  foilLow: number;
  foilTrend: number;
  lowPriceEx: number;
  avg1: number;
  avg7: number;
  avg30: number;
  foil1: number;
  foil7: number;
  foil30: number;
  link: string;
}

export interface ProductCMWithCount extends ProductCM {
  count: number;
}

export interface ProductCMRaw {
  idProduct: number;
  name: string;
  idExpansion: number;
  trendPrice: number;
  lowPrice: number;
  avg1: number;
}

interface PriceGuideFile {
  version: number;
  createdAt: string;
  priceGuides: PriceGuideEntry[];
}

interface ProductsFile {
  version: number;
  createdAt: string;
  products: ProductSingle[];
}

type IdMap = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  private priceMapSubject = new ReplaySubject<Map<string, ProductCM>>(1);
  private priceMap = new Map<string, ProductCM>();
  private productsByCardNumber = new Map<string, ProductCMRaw[]>();
  private idMap: IdMap = {};
  private loaded = false;
  private createdAt: string | null = null;

  /** Observable emitting the full price map once loaded */
  priceMap$ = this.priceMapSubject.asObservable();

  /** Observable emitting the full list of ProductCM (for backward compat with dialogs) */
  priceGuide$: Observable<ProductCM[]>;

  constructor(private http: HttpClient) {
    this.priceGuide$ = this.priceMap$.pipe(
      map((m) => Array.from(m.values())),
      shareReplay(1),
    );
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      priceGuide: this.http.get<PriceGuideFile>('assets/cardmarket/price_guide_17.json'),
      products: this.http.get<ProductsFile>('assets/cardmarket/products_singles_17.json'),
      idMap: this.http.get<IdMap>('assets/cardmarket/cardmarket-id-map.json'),
      overrides: this.http.get<Record<string, unknown>>('assets/cardmarket/cardmarket-id-overrides.json').pipe(
        catchError(() => of({})),
      ),
    }).subscribe(({ priceGuide, products, idMap, overrides }) => {
      this.createdAt = priceGuide.createdAt;
      // Apply overrides: override entries replace existing mappings
      for (const [key, value] of Object.entries(overrides)) {
        if (key.startsWith('_') || typeof value !== 'string') continue;
        // Remove any existing entry that maps to the same cardId (1:1)
        for (const [existingKey, existingVal] of Object.entries(idMap)) {
          if (existingVal === value) {
            delete idMap[existingKey];
          }
        }
        idMap[key] = value;
      }
      this.idMap = idMap;
      this.buildPriceMap(priceGuide.priceGuides, products.products, idMap);
      this.loaded = true;
      this.priceMapSubject.next(this.priceMap);
    });
  }

  private buildPriceMap(prices: PriceGuideEntry[], products: ProductSingle[], idMap: IdMap): void {
    // Build price lookup by idProduct
    const priceLookup = new Map<number, PriceGuideEntry>();
    for (const price of prices) {
      priceLookup.set(price.idProduct, price);
    }

    // Build product lookup by idProduct
    const productLookup = new Map<number, ProductSingle>();
    for (const product of products) {
      productLookup.set(product.idProduct, product);
    }

    // Build productsByCardNumber for admin/compare view
    const cardNumRegex = /\(([A-Z0-9]+-\d+[a-z]?)\)\s*$/;
    for (const product of products) {
      const match = cardNumRegex.exec(product.name);
      if (!match) continue;
      const cardNumber = match[1];
      const price = priceLookup.get(product.idProduct);
      const raw: ProductCMRaw = {
        idProduct: product.idProduct,
        name: product.name,
        idExpansion: product.idExpansion,
        trendPrice: price?.trend ?? 0,
        lowPrice: price?.low ?? 0,
        avg1: price?.avg1 ?? 0,
      };
      const existing = this.productsByCardNumber.get(cardNumber);
      if (existing) {
        existing.push(raw);
      } else {
        this.productsByCardNumber.set(cardNumber, [raw]);
      }
    }

    // For each mapped idProduct → cardId, merge price + product info
    for (const [idProductStr, cardId] of Object.entries(idMap)) {
      const idProduct = parseInt(idProductStr, 10);
      const price = priceLookup.get(idProduct);
      const product = productLookup.get(idProduct);

      if (!price || !product) continue;

      const productCM: ProductCM = {
        idProduct,
        cardId,
        name: product.name,
        avgSellPrice: price.avg ?? 0,
        lowPrice: price.low ?? 0,
        trendPrice: price.trend ?? 0,
        germanProLow: 0,
        suggestedPrice: 0,
        foilSell: 0,
        foilLow: price['low-foil'] ?? 0,
        foilTrend: price['trend-foil'] ?? 0,
        lowPriceEx: 0,
        avg1: price.avg1 ?? 0,
        avg7: price.avg7 ?? 0,
        avg30: price.avg30 ?? 0,
        foil1: price['avg1-foil'] ?? 0,
        foil7: price['avg7-foil'] ?? 0,
        foil30: price['avg30-foil'] ?? 0,
        link: this.buildCardmarketUrl(product.name) + '/Versions',
      };

      this.priceMap.set(cardId, productCM);
    }
  }

  /** Get the price for a specific card ID using the given metric */
  getPrice(cardId: string, metric: PriceMetric): number | null {
    const product = this.priceMap.get(cardId);
    if (!product) return null;
    return this.extractPrice(product, metric);
  }

  /** Get the full price data for a card */
  getPriceData(cardId: string): ProductCM | null {
    return this.priceMap.get(cardId) ?? null;
  }

  /** Check if data has been loaded */
  isLoaded(): boolean {
    return this.loaded;
  }

  /** Get the date the price data was generated */
  getCreatedAt(): string | null {
    return this.createdAt;
  }

  /** Calculate total value for a list of cards with counts */
  calculateTotalValue(cards: { id: string; count: number }[], metric: PriceMetric): number {
    let total = 0;
    for (const card of cards) {
      const price = this.getPrice(card.id, metric);
      if (price !== null) {
        total += price * card.count;
      }
    }
    return total;
  }

  /** Extract the numeric price for a given metric from a ProductCM */
  private extractPrice(product: ProductCM, metric: PriceMetric): number {
    switch (metric) {
      case PriceMetric.Low:
        return product.lowPrice;
      case PriceMetric.Avg:
        return product.avgSellPrice;
      case PriceMetric.Trend:
        return product.trendPrice;
      case PriceMetric.Avg1:
        return product.avg1;
      case PriceMetric.Avg7:
        return product.avg7;
      case PriceMetric.Avg30:
        return product.avg30;
      case PriceMetric.FoilLow:
        return product.foilLow;
      case PriceMetric.FoilTrend:
        return product.foilTrend;
      case PriceMetric.FoilAvg1:
        return product.foil1;
      case PriceMetric.FoilAvg7:
        return product.foil7;
      case PriceMetric.FoilAvg30:
        return product.foil30;
      default:
        return product.trendPrice;
    }
  }

  /** Backward-compatible method for existing dialog components */
  getPrizeGuide(): Observable<ProductCM[]> {
    return this.priceGuide$;
  }

  /** Get all raw Cardmarket products for a given card number (for admin compare view) */
  getProductsByCardNumber(cardNumber: string): ProductCMRaw[] {
    return this.productsByCardNumber.get(cardNumber) ?? [];
  }

  /** Get the current idProduct→cardId mapping */
  getIdMap(): IdMap {
    return this.idMap;
  }

  /** Build a Cardmarket card page URL from the product name */
  private buildCardmarketUrl(productName: string): string {
    // "Yokomon (BT1-001)" → "Yokomon-BT1-001"
    const slug = productName
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/, '');
    return `https://www.cardmarket.com/en/Digimon/Cards/${slug}`;
  }
}
