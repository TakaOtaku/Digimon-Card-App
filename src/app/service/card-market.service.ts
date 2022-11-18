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
  appToken = environment.cardmarket.APPTOKEN;
  appSecret = environment.cardmarket.APPSECRET;

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

  getOauthHeader(method: 'GET' | 'POST' | 'PUT', url: string): HttpHeaders {
    const nonce = uuid.v4();
    const timestamp = Math.floor(new Date().getTime() / 1000);

    const baseString = method + '&' + encodeURIComponent(url) + '&';

    let parameters = 'oauth_consumer_key=' + this.appToken + '&';
    parameters += 'oauth_nonce=' + nonce + '&';
    parameters += 'oauth_signature_method=' + 'HMAC-SHA1' + '&';
    parameters += 'oauth_timestamp=' + timestamp + '&';
    parameters += 'oauth_token=""' + '&';
    parameters += 'oauth_version=1.0';

    parameters = encodeURIComponent(parameters);

    const signing_key = encodeURIComponent(this.appSecret) + '&';
    const signature_base_string = baseString + parameters;

    let signature = crypto.HmacSHA1(signature_base_string, signing_key);
    signature = crypto.enc.Base64.stringify(signature);

    const Authorization =
      'OAuth realm=' +
      url +
      ', oauth_consumer_key=' +
      this.appToken +
      ', oauth_token=""' +
      ', oauth_nonce=' +
      nonce +
      ', oauth_timestamp=' +
      timestamp +
      ', oauth_signature_method=HMAC-SHA1' +
      ', oauth_version=1.0' +
      ', oauth_signature=' +
      signature;

    return new HttpHeaders({
      Authorization,
    });
  }

  getGames(): Observable<any> {
    const url = 'https://api.cardmarket.com/ws/v2.0/games';

    const httpHeader = this.getOauthHeader('GET', url);

    this.http.get(url, { headers: httpHeader }).subscribe((value) => {
      debugger;
    });

    const request_data = {
      url: 'https://api.cardmarket.com/ws/v2.0/games',
      method: 'GET',
    };
    const test1 = this.oauth.toHeader(this.oauth.authorize(request_data));

    //this.http
    //  .get(url, { headers: { Authorization: test1.Authorization } })
    //  .subscribe((value) => {
    //    debugger;
    //  });

    return of();
  }
}
