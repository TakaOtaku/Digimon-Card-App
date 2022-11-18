import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, Subject } from 'rxjs';

const DIGIMON_GAME_ID = 8;
const HOST_URL = 'https://api.cardtrader.com';

export interface IExpansion_CT {
  id: number;
  game_id: number;
  code: string;
  name: string;
}

export interface IMarket_Place_Item_CT {
  id: number;
  blueprint_id: number;
  name_en: string;
  quantity: number;
  price: IPrice_CT;
  description: string;
  properties_hash: any;
  expansion: IExpansion_CT;
  user: IUser_CT;
  graded: boolean;
  on_vacation: boolean;
  bundle_size: number;
}

export interface IPrice_CT {
  cents: number;
  currency: string;
  formatted: string;
  currency_symbol: string;
}

export interface IUser_CT {
  id: number;
  username: string;
  can_sell_via_hub: boolean;
  country_code: string;
  user_type: string;
  max_sellable_in24h_quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CardTraderService {
  constructor(private http: HttpClient) {}

  getExpansions(): Observable<IExpansion_CT[]> {
    const url = HOST_URL + '/api/v2/expansions';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      //Authorization: `Bearer ${BEARER_TOKEN}`,
    });

    return this.http.get<IExpansion_CT[]>(url, { headers });
  }

  getMarketPlaceItems(expansion: number): Observable<any> {
    const url =
      HOST_URL + '/api/v2/marketplace/products?expansion_id=' + expansion;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      //Authorization: `Bearer ${BEARER_TOKEN}`,
    });

    return this.http.get<any>(url, { headers });
  }

  getCardPrices(): Observable<any> {
    const subject = new Subject();
    let array = [];
    this.getExpansions()
      .pipe(
        map(
          (expansions) =>
            expansions.filter((expansion) => expansion.game_id === 8) ?? []
        )
      )
      .subscribe((expansions) => {
        const observables = expansions.map((expansion) =>
          this.getMarketPlaceItems(expansion.id)
        );
        const fork = forkJoin(observables)
          .pipe(map((items) => items.flat()))
          .subscribe((marketPlaceItems) => {
            for (let [key, value] of Object.entries(marketPlaceItems)) {
              const items = value as IMarket_Place_Item_CT[];

              items.reduce(function (prev, curr) {
                return prev.price.cents < curr.price.cents ? prev : curr;
              });

              if (
                !items[0].properties_hash.collector_number ||
                !items[0].properties_hash.collector_number.includes('-')
              ) {
                return;
              }

              const cardId =
                items[0].properties_hash.collector_number.includes('P') &&
                !items[0].properties_hash.collector_number.startsWith('P')
                  ? this.correctParallelArt(
                      items[0].properties_hash.collector_number
                    ).trim()
                  : items[0].properties_hash.collector_number.trim();

              subject.next({
                cardId: cardId,
                price: items[0].price.formatted,
              });
              array.push({
                cardId: cardId,
                price: items[0].price.formatted,
              });
            }
            debugger;
          });
      });
    return subject;
  }

  correctParallelArt(id: string): string {
    const p = id.search('P');
    return id.slice(0, p) + '_' + id.slice(p);
  }
}
