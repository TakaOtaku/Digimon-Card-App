import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// @ts-ignore
import * as crypto from 'crypto-js';

// @ts-ignore
import * as OAuth from 'oauth-1.0a';

import { Observable, of } from 'rxjs';
import * as uuid from 'uuid';
import { environment } from '../../environments/environment.prod';

interface IOAUTH {
  realm: string; // The request URI (without query parameters)
  oauth_consumer_key: string; // This is your App Token
  oauth_token: string; // This is the Access Token you got for the user
  oauth_nonce: string; // A random string you need to generate for each request
  oauth_timestamp: string; // The actual UNIX timestamp of your request
  oauth_signature_method: string; // We use HMAC-SHA1
  oauth_version: string; // We use OAuth v1.0
}

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  appToken = '';
  appSecret = '';

  signatureMethod = 'HMAC-SHA1';

  IOAUTH: IOAUTH;

  oauth: OAuth;

  constructor(private http: HttpClient) {
    this.oauth = new OAuth({
      consumer: {
        key: this.appToken,
        secret: this.appSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: function (base_string, key) {
        return crypto.enc.Base64.stringify(crypto.HmacSHA1(base_string, key));
      },
    });
  }

  getOauthHeader(
    method: 'GET' | 'POST' | 'PUT',
    url: string,
    query: string = ''
  ): HttpHeaders {
    const nonce = uuid.v4();
    const timestamp = Math.floor(new Date().getTime() / 1000);

    const baseString = method + '&' + encodeURIComponent(url) + '&';

    console.log('Base String: ', baseString);

    let parameters = [];
    parameters.push(query);
    parameters.push('oauth_consumer_key=' + this.appToken + '&');
    parameters.push('oauth_nonce=' + nonce + '&');
    parameters.push('oauth_signature_method=HMAC-SHA1&');
    parameters.push('oauth_timestamp=' + timestamp + '&');
    parameters.push('oauth_token=&');
    parameters.push('oauth_version=1.0');

    parameters = parameters.sort();

    let parameterString = '';

    parameters.forEach((parameter) => (parameterString += parameter));

    parameterString = encodeURIComponent(parameterString);

    console.log('Parameter String: ', parameterString);

    const signing_key = encodeURIComponent(this.appSecret) + '&';
    const signature_base_string = baseString + parameterString;

    console.log('Signature String: ', signature_base_string);

    let signature = crypto.HmacSHA1(signature_base_string, signing_key);
    signature = crypto.enc.Base64.stringify(signature);

    let Authorization = '';
    Authorization += 'OAuth realm="' + url + '", ';
    Authorization += 'oauth_consumer_key="' + this.appToken + '", ';
    Authorization += 'oauth_token="", ';
    Authorization += 'oauth_nonce="' + nonce + '", ';
    Authorization += 'oauth_timestamp="' + timestamp + '", ';
    Authorization += 'oauth_signature_method="HMAC-SHA1", ';
    Authorization += 'oauth_version="1.0", ';
    Authorization += 'oauth_signature="' + signature + '"';

    return new HttpHeaders({
      Authorization,
    });
  }

  getGames(): Observable<any> {
    const url = 'https://api.cardmarket.com/ws/v2.0/games';

    const httpHeader = this.getOauthHeader('GET', url);

    return this.http.get(url, { headers: httpHeader, responseType: 'text' });
  }

  getExpansions(): Observable<any> {
    const url = 'https://api.cardmarket.com/ws/v2.0/games/17/expansions';

    const httpHeader = this.getOauthHeader('GET', url);

    return this.http.get(url, { headers: httpHeader, responseType: 'text' });
  }

  getPrizeGuide(): Observable<any> {
    const url = 'https://api.cardmarket.com/ws/v2.0/priceguide';

    const query = 'idGame=17&';

    const httpHeader = this.getOauthHeader('GET', url, query);

    return this.http.get(url + '?idGame=17', {
      headers: httpHeader,
      responseType: 'text',
    });
  }
}
