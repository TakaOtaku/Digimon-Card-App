import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, first, map, Observable } from 'rxjs';
import {
  DigimonCard,
  IColor,
  ICountCard,
  IDeck,
  ISave,
  ISettings,
  ITournamentDeck,
  IUser,
} from 'src/models';
import { CARDSET, IBlog, IBlogWithText, ITag } from '../../models';
import { sortByReleaseOrder } from '../../models';
import { emptySettings } from '../../models';
import { IUserAndDecks } from '../../models';
import { setDeckImage } from '../functions';

const baseUrl = 'https://backend.digimoncard.app/api/';
const baseUrl_inactiv = 'http://localhost:8080/api/';
const baseUrl_inactiv2 = 'https://179.61.219.98:8090/preview/digimoncard.app/';

@Injectable({
  providedIn: 'root',
})
export class DigimonBackendService {
  constructor(private http: HttpClient) {}

  getDecks(url: string = baseUrl): Observable<IDeck[]> {
    return this.http.get<any[]>(url + 'decks').pipe(
      map((decks) => {
        return decks
          .map((deck) => {
            const cards: ICountCard[] = JSON.parse(deck.cards);
            let sideDeck: ICountCard[];
            if (deck.sideDeck) {
              sideDeck = JSON.parse(
                deck.sideDeck !== '' ? deck.sideDeck : '[]',
              );
            } else {
              sideDeck = [];
            }

            const color: IColor = JSON.parse(deck.color);
            const tags: ITag[] = JSON.parse(deck.tags);
            const likes: string[] = deck.likes ? JSON.parse(deck.likes) : [];
            return {
              ...deck,
              likes,
              cards,
              sideDeck,
              color,
              tags,
            } as IDeck;
          })
          .sort(sortByReleaseOrder);
      }),
    );
  }

  getSaves(url: string = baseUrl): Observable<ISave[]> {
    return this.http.get<any[]>(url + 'users').pipe(
      map((saves) => {
        return saves.map((save) => {
          const collection: ICountCard[] = JSON.parse(save.collection);
          const decks: IDeck[] = JSON.parse(save.decks);
          const settings: ISettings = JSON.parse(save.settings);
          return {
            ...save,
            collection,
            decks,
            settings,
          } as ISave;
        });
      }),
    );
  }
}
