import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getPrizeGuide(): Observable<ProductCM[]> {
    return this.http.get<ProductCM[]>(this.baseUrl + 'price-guide');
  }
}
