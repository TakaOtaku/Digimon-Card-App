import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

const baseUrl = 'https://api.cardmarket.com/ws/v2.0/games';

interface Ioath {
  realm: string; // The request URI (without query parameters)
  oauth_consumer_key: string; // This is your App Token
  oauth_token: string; // This is the Access Token you got for the user
  oauth_nonce: string; // A random string you need to generate for each request
  oauth_timestamp: string; // The actual UNIX timestamp of your request
  oauth_signature_method: string; // We use HMAC-SHA1
  oauth_version: string; // We use OAuth v1.0
  oauth_signature: string; // The signature to verify the authenticity of the request
}

@Injectable({
  providedIn: 'root',
})
export class CardMarketService {
  appToken = environment.cardmarket.APPTOKEN;
  appSecret = environment.cardmarket.APPSECRET;

  nonce = '53eb1f44909d6';

  timestamp = '1407917892';
  signatureMethod = 'HMAC-SHA1';
  version = '1.0';

  params: Ioath;

  constructor(private http: HttpClient) {
    this.params = {
      oauth_consumer_key: this.appToken,
      oauth_nonce: this.nonce,
      oauth_timestamp: this.timestamp,
      oauth_signature_method: this.signatureMethod,
      oauth_version: this.version,
    } as Ioath;
  }

  getSignature(url: string): string {
    return '';
    //return (
    //'GET&' + rawurlencode('https://api.cardmarket.com/ws/v1.1/account') + '&'
    //);
  }

  getGames(): Observable<any> {
    this.params['realm'] = baseUrl + '/games';

    const httpHeader: HttpHeaders = new HttpHeaders({
      Authorization: `OAuth realm=${this.params['realm']},
      oauth_consumer_key=${this.params['oauth_consumer_key']},
      oauth_token=${this.params['realm']},
      oauth_nonce=${this.params['oauth_nonce']},
      oauth_timestamp=${new Date().getTime()},
      oauth_signature_method=${this.params['oauth_signature_method']},
      oauth_version=${this.params['oauth_version']},
      oauth_signature=${this.params['oauth_signature']}`,
    });
    return this.http.get(this.params.realm, { headers: httpHeader });
  }
}
