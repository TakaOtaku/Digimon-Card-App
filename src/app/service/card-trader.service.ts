import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DIGIMON_GAME_ID = 8;
const HOST_URL = 'https://api.cardtrader.com';

const BEARER_TOKEN =
  'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6NDM4NSIsImF1ZCI6ImFwcDo0Mzg1IiwiZXhwIjo0ODI0Mjc0NTI1LCJqdGkiOiJkMjYwYWZhMi1iNzNlLTQ3MTMtYmZkZi1hZDY2OWVlMTdiNzkiLCJpYXQiOjE2Njg2MDA5MjUsIm5hbWUiOiJUYWthT3Rha3UgQXBwIDIwMjIwNTIwMDgzMjEwIn0.P5I1FP8EJIQ7AhvnROwsOTYliQIw9Jde1KPZ_un7Ks1OtLdgV9HDKnYTzR_T7EYfS-MdRjisEHZgJsyXGP3UCXkRplnxTUzpQE1gpQ5sZfJY_UBw3XuGcayefGJXCRX3cJN887jNpaAqdCcw7SP38IZsfTp6SoJmp8cYyDg5nCrSXavYgIoDYKKaFnnPDvoG6wEbrEzZ2ty8N-h5Eq6t6_z1-UG5PAAbv_A2OO1wFzvUw-crYJTAxtAaPJKCmf3IBha1PlOgET51U6_nEtR96XqcnJBn3JePOx38q6kIdXcJymThzO86RxabU9tWtmySwrJcCAU2-A0xE8PHwk-FSQ';

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
      Authorization: `Bearer ${BEARER_TOKEN}`,
    });

    return this.http.get<IExpansion_CT[]>(url, { headers });
  }

  getMarketPlaceItems(expansion: number): Observable<any> {
    const url =
      HOST_URL + '/api/v2/marketplace/products?expansion_id=' + expansion;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    });

    return this.http.get<any>(url, { headers });
  }
}
