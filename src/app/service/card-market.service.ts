import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'https://api.cardmarket.com/ws/v2.0/games';

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  constructor(private http: HttpClient) {}

  getGames(): Observable<any> {
    return of();
  }
}
