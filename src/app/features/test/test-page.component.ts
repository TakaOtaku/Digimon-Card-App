import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { concat, finalize, first, Observable, Subject, switchMap, tap } from 'rxjs';
import { ADMINS, IDeck, ISave, ITournamentDeck } from '../../../models';
import { setColors, setDeckImage, setTags } from '../../functions';
import { AuthService } from '../../services/auth.service';
import { CardMarketService } from '../../services/card-market.service';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { DigimonCardStore } from '../../store/digimon-card.store';
import { DigimonFirebaseService } from '../../services/digimon-firebase.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'digimon-test-page',
  template: `
    <div *ngIf="isAdmin()" class="flex flex-col items-center">
      <button
        class="border-2 border-amber-200 bg-amber-400"
        (click)="updateAllSaves()">
        Update all Saves
      </button>

      <div class="flex items-center gap-4">
        <p-button
          label="Migrate Data to Firebase"
          icon="pi pi-cloud-upload"
          [disabled]="isMigrating"
          (onClick)="migrateData()">
        </p-button>

        <p-progressSpinner
          *ngIf="isMigrating"
          [style]="{ width: '30px', height: '30px' }"></p-progressSpinner>
      </div>
      <div *ngIf="isMigrating" class="mt-4">
        <p>Migration in progress... Please don't close this page.</p>
      </div>

      <div
        *ngIf="migrationComplete"
        class="mt-4 p-3 bg-green-100 text-green-800 rounded">
        <p>
          Migration completed successfully! Your data is now stored in Firebase.
        </p>
      </div>
    </div>

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
  imports: [
    NgIf,
    DialogModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
})
export class TestPageComponent implements OnDestroy {
  isMigrating = false;
  migrationComplete = false;

  firebaseService = inject(DigimonFirebaseService);

  updateIDDialog = false;
  productsWithoutCorrectID: any[] = [];
  currentID = 1;

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject();

  constructor(
    public authService: AuthService,
    private digimonBackendService: DigimonBackendService,
    private cardMarketService: CardMarketService,
  ) {}

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

  updateFirstObject() {
    const id = this.productsWithoutCorrectID[0].cardId + this.currentID;
    const product = this.productsWithoutCorrectID[0];
    this.cardMarketService
      .updateProductId(id, product)
      .pipe(first())
      .subscribe();
    this.productsWithoutCorrectID = this.productsWithoutCorrectID.slice(1);
  }

  private updateDecks(save: ISave) {
    const newDecks: IDeck[] = save.decks.map((deck) => {
      const tags = setTags(deck, this.digimonCardStore.cards());
      const color = setColors(deck, this.digimonCardStore.cards());

      return {
        ...deck,
        tags,
        color,
        imageCardId:
          !deck.imageCardId || deck.imageCardId === 'BT1-001'
            ? setDeckImage(deck, this.digimonCardStore.cards()).id
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
      newDecks = {
        ...deck,
        imageCardId: setDeckImage(deck, this.digimonCardStore.cards()).id,
      };
    }
    if (!deck.date) {
      error = true;
      newDecks = { ...deck, date: new Date().toString() };
    }

    return error
      ? this.digimonBackendService
          .updateDeck(newDecks, null, this.digimonCardStore.cards())
          .pipe(first())
      : null;
  }

  migrateData(): void {
    this.isMigrating = true;
    this.migrationComplete = false;

    this.firebaseService
      .migrateToFirebase()
      .pipe(
        finalize(() => {
          this.isMigrating = false;
        }),
      )
      .subscribe((success) => {
        this.migrationComplete = success;
      });
  }
}
