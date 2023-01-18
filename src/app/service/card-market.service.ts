import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl_inactiv = 'https://backend.digimoncard.app/api/';
const baseUrl = 'http://localhost:8080/api/card-market';

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  constructor(private http: HttpClient) {}

  getPrizeGuide(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/price-guide`);
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
