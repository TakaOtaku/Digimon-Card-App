import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'https://backend.digimoncard.app/api/card-market';
const baseUrl_inactiv = 'http://localhost:8080/api/card-market';

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

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  constructor(private http: HttpClient) {}

  getPrizeGuide(): Observable<ProductCM[]> {
    return this.http.get<ProductCM[]>(`${baseUrl}/price-guide`);
  }

  getProductId(uid: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/product/${uid}`);
  }

  updateProductId(id: string, product: any): Observable<any> {
    debugger;
    const newProduct = { ...product, cardId: id };
    return this.http.put<any>(`${baseUrl}/price-guide`, newProduct);
  }
}
