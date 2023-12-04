import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Store } from '@ngrx/store';
import { Account, Client, Databases, ID, Models } from 'appwrite';
import { DialogModule } from 'primeng/dialog';
import { concat, first, Observable, Subject, switchMap, tap } from 'rxjs';
import {
  ADMINS,
  DigimonCard,
  IDeck,
  ISave,
  ITournamentDeck,
} from '../../../models';
import {
  setColors,
  setDeckImage,
  setTags,
} from '../../functions/digimon-card.functions';
import { AuthService } from '../../services/auth.service';
import { CardMarketService } from '../../services/card-market.service';
import { DatabaseService } from '../../services/database.service';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { selectAllCards } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-test-page',
  template: `
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updateAllSaves()">
      Update all Saves
    </button>
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updatePriceGuideIds()">
      Update PriceGuide Ids
    </button>
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updatePriceGuideIdsAAs()">
      Update PriceGuide Ids AAs
    </button>

    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updateAllDecks()">
      Update all Decks
    </button>

    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updateAllSaves()">
      Update all Save Decks
    </button>

    <p-dialog
      [(visible)]="updateIDDialog"
      [baseZIndex]="100000"
      [dismissableMask]="true"
      [resizable]="false">
      <h1>
        There are still <b>{{ productsWithoutCorrectID.length }}</b> without
        correct ID.
      </h1>

      <a
        class="my-3"
        [href]="productsWithoutCorrectID[0]?.link"
        target="_blank"
        >{{ productsWithoutCorrectID[0]?.link }}</a
      >

      <div class="my-3 flex flex-row">
        <div>Enter a ID:</div>
        <input
          [(ngModel)]="currentID"
          type="number"
          min="1"
          max="10"
          class="text-center font-bold text-black" />
      </div>

      <button (click)="updateFirstObject()">Save and Next</button>
    </p-dialog>
  `,
  standalone: true,
  imports: [NgIf, DialogModule, FormsModule],
})
export class TestPageComponent implements OnInit, OnDestroy {
  updateIDDialog = false;
  productsWithoutCorrectID: any[] = [];
  currentID = 1;

  private allCards: DigimonCard[] = [];
  private onDestroy$ = new Subject();

  constructor(
    private store: Store,
    public authService: AuthService,
    private databaseService: DatabaseService,
    private digimonBackendService: DigimonBackendService,
    private cardMarketService: CardMarketService,
    private fireAuth: AngularFirestore,
  ) {
    //cardTraderService.getCardPrices().subscribe((value) => {
    //  //fs.writeFileSync('./price-data-cardtrader.json', value, {
    //  //  flag: 'w',
    //  //});
    //});
    //cardMarketService.getGames().subscribe((value) => {
    //  debugger;
    //});
  }

  ngOnInit() {
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((allCards) => (this.allCards = allCards));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  isAdmin(): boolean {
    return !!ADMINS.find((user) => {
      if (this.authService.userData?.uid === user.id) {
        return user.admin;
      }
      return false;
    });
  }

  updateAllSaves() {
    this.digimonBackendService
      .getSaves()
      .pipe(first())
      .subscribe((saves) => {
        saves.forEach((save) => {
          this.updateDecks(save);
        });
      });
  }

  updatePriceGuideIds() {
    this.cardMarketService.getPrizeGuide().subscribe((priceGuide: any[]) => {
      const observable: Observable<any>[] = [];
      priceGuide.forEach((entry) => {
        this.cardMarketService
          .getProductId(entry.idProduct)
          .pipe(
            switchMap((id) => {
              return this.cardMarketService.updateProductId(id, entry);
            }),
          )
          .subscribe();
      });

      //concat(...observable).subscribe((value) => console.log(value));
    });
  }

  updatePriceGuideIdsAAs() {
    //Get Price Guide
    //Get all _P and Cards without correct ID
    //If one ID got only one match it is the only one so set it to _P1
    //If there are more open the link in a window and let the user enter a number
    //Change _PX the X to the entered number
    this.productsWithoutCorrectID = [];

    this.cardMarketService
      .getPrizeGuide()
      .pipe(first())
      .subscribe((products) => {
        const wrongIDs = products
          .filter((product) => product.cardId.endsWith('_P'))
          .sort((a, b) =>
            b.cardId
              .toLocaleLowerCase()
              .localeCompare(a.cardId.toLocaleLowerCase()),
          );

        const ArrayObject: any = {};
        wrongIDs.forEach((product) => {
          if (ArrayObject[product.cardId]) {
            ArrayObject[product.cardId] = [
              ...ArrayObject[product.cardId],
              product,
            ];
          } else {
            ArrayObject[product.cardId] = [product];
          }
        });

        const ofArray$: Observable<any>[] = [];
        Object.entries(ArrayObject).forEach((entry) => {
          const [key, value] = entry;

          if ((value as any[]).length === 0) {
            delete ArrayObject[key];
          } else if ((value as any[]).length === 1) {
            ofArray$.push(
              this.cardMarketService
                .updateProductId(
                  ArrayObject[key][0].cardId + `1`,
                  ArrayObject[key][0],
                )
                .pipe(first()),
            );
            delete ArrayObject[key];
          }
        });

        concat(...ofArray$).subscribe();

        Object.entries(ArrayObject).forEach((entry) => {
          const [key, value] = entry;
          this.productsWithoutCorrectID = [
            ...this.productsWithoutCorrectID,
            value,
          ];
        });

        this.productsWithoutCorrectID = this.productsWithoutCorrectID.flat();
        this.updateIDDialog = true;
      });
  }

  updateFirstObject() {
    const id = this.productsWithoutCorrectID[0].cardId + this.currentID;
    const product = this.productsWithoutCorrectID[0];
    this.cardMarketService
      .updateProductId(id, product)
      .pipe(first())
      .subscribe();
    this.productsWithoutCorrectID = this.productsWithoutCorrectID.slice(1);
  }

  updateAllDecks() {
    const obsArray$: Observable<any>[] = [];

    this.digimonBackendService
      .getDecks()
      .pipe(
        tap((decks) => {
          decks.forEach((deck) => {
            const of = this.updateDeck(deck);
            if (of) {
              obsArray$.push(of);
            }
          });
        }),
        switchMap(() => this.digimonBackendService.getTournamentDecks()),
        tap((tournamentDecks) => {
          tournamentDecks.forEach((deck) => {
            const of = this.updateTournamentDeck(deck);
            if (of) {
              obsArray$.push(of);
            }
          });
        }),
      )
      .subscribe((decks) => {
        concat(...obsArray$).subscribe();
      });
  }

  private updateDecks(save: ISave) {
    const newDecks: IDeck[] = save.decks.map((deck) => {
      const tags = setTags(deck, this.allCards);
      const color = setColors(deck, this.allCards);

      return {
        ...deck,
        tags,
        color,
        imageCardId:
          !deck.imageCardId || deck.imageCardId === 'BT1-001'
            ? setDeckImage(deck, this.allCards).id
            : deck.imageCardId,
        date: !deck.date ? new Date().toString() : deck.date,
      };
    });
    const newSave: ISave = { ...save, decks: newDecks };
    if (save != newSave) {
      this.digimonBackendService.updateSave(newSave).pipe(first()).subscribe();
    }
  }

  private updateDeck(deck: IDeck): Observable<any> | null {
    let error = false;
    let newDecks: IDeck = deck;
    if (!deck.imageCardId || deck.imageCardId === 'BT1-001') {
      error = true;
      newDecks = { ...deck, imageCardId: setDeckImage(deck, this.allCards).id };
    }
    if (!deck.date) {
      error = true;
      newDecks = { ...deck, date: new Date().toString() };
    }

    return error
      ? this.digimonBackendService
          .updateDeck(newDecks, null, this.allCards)
          .pipe(first())
      : null;
  }

  private updateTournamentDeck(deck: ITournamentDeck): Observable<any> | null {
    let error = false;
    let newDecks: ITournamentDeck = deck;
    if (!deck.imageCardId || deck.imageCardId === 'BT1-001') {
      error = true;
      newDecks = {
        ...deck,
        imageCardId: setDeckImage(deck, this.allCards).id,
      };
    }
    if (!deck.date) {
      error = true;
      newDecks = { ...deck, date: new Date().toString() };
    }

    return error
      ? this.digimonBackendService.updateTournamentDeck(newDecks).pipe(first())
      : null;
  }
}
