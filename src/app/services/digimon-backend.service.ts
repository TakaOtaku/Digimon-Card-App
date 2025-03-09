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

  getDeck(id: any): Observable<IDeck> {
    return this.http.get<any>(`${baseUrl}decks/${id}`).pipe(
      map((deck) => {
        const cards: ICountCard = JSON.parse(deck.cards);
        const sideDeck: ICountCard = JSON.parse(
          deck.sideDeck !== '' ? deck.sideDeck : '[]',
        );
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
      }),
    );
  }

  getSave(id: any): Observable<ISave> {
    return this.http.get<any>(`${baseUrl}users/${id}`).pipe(
      map((save) => {
        const collection: ICountCard[] = JSON.parse(save.collection);
        const decks: IDeck[] = JSON.parse(save.decks);
        const settings: ISettings = JSON.parse(save.settings);
        const newSave = {
          ...save,
          collection,
          decks,
          settings,
        } as ISave;

        newSave.settings.aaCollectionMinimum =
          newSave.settings.aaCollectionMinimum !== undefined
            ? newSave.settings.aaCollectionMinimum
            : 1;

        newSave.settings.countMax =
          newSave.settings.countMax !== undefined
            ? newSave.settings.countMax
            : 5;

        newSave.settings.cardSet =
          newSave.settings.cardSet === 'Both'
            ? 'English'
            : newSave.settings.cardSet;

        return newSave;
      }),
    );
  }
  updateDeck(
    deck: IDeck,
    user: IUser | null = null,
    allCards: DigimonCard[],
  ): Observable<any> {
    let newDeck: any;
    if (user) {
      newDeck = {
        ...deck,
        user: user.displayName ?? 'Unknown',
        userId: user.uid ?? 'Unknown',
        date: new Date(),
      };
    } else {
      newDeck = deck;
    }

    if (!newDeck.imageCardId || newDeck.imageCardId === 'BT1-001') {
      newDeck.imageCardId = setDeckImage(newDeck, allCards).id;
    }

    return this.http.put(`${baseUrl}decks/${deck.id}`, newDeck);
  }
  updateSave(save: ISave): Observable<any> {
    return this.http.put(`${baseUrl}users/${save.uid}`, save);
  }

  deleteDeck(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}decks/${id}`);
  }

  checkSaveValidity(save: any, user?: any): ISave {
    let changedSave = false;
    if (user) {
      if (!save.collection) {
        save = { ...save, collection: user.save.collection };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: user.save.decks };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: user.save.settings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: user.uid };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: user.displayName };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: user.photoURL };
        changedSave = true;
      }
    } else {
      if (!save.collection) {
        save = { ...save, collection: [] };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: [] };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: emptySettings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: '' };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: '' };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: '' };
        changedSave = true;
      }
    }

    if (
      save.settings.cardSet === undefined ||
      save.settings.cardSet === 'Overwrite' ||
      +save.settings.cardSet >>> 0
    ) {
      save = {
        ...save,
        settings: { ...save.settings, cardSet: CARDSET.English },
      };
      changedSave = true;
    }
    if (save.settings.collectionMinimum === undefined) {
      save = { ...save, settings: { ...save.settings, collectionMinimum: 1 } };
      changedSave = true;
    }
    if (save.settings.showPreRelease === undefined) {
      save = { ...save, settings: { ...save.settings, showPreRelease: true } };
      changedSave = true;
    }
    if (save.settings.showStampedCards === undefined) {
      save = {
        ...save,
        settings: { ...save.settings, showStampedCards: true },
      };
      changedSave = true;
    }
    if (save.settings.showAACards === undefined) {
      save = { ...save, settings: { ...save.settings, showAACards: true } };
      changedSave = true;
    }
    if (save.settings.showUserStats === undefined) {
      save = { ...save, settings: { ...save.settings, showUserStats: true } };
      changedSave = true;
    }

    if (changedSave && user?.uid) {
      this.updateSave(save).pipe(first()).subscribe();
    }
    return save;
  }
}
