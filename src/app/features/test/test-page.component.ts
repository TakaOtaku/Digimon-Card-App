import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { concat, first, Observable, Subject, switchMap, tap } from 'rxjs';
import { ADMINS, IDeck, ISave } from '../../../models';
import { setColors, setDeckImage, setTags } from '../../functions';
import { AuthService } from '../../services/auth.service';
import { MongoBackendService } from '../../services/mongo-backend.service';
import { DigimonCardStore } from '../../store/digimon-card.store';

@Component({
  selector: 'digimon-test-page',
  template: `
    <button *ngIf="isAdmin()" class="border-2 border-amber-200 bg-amber-400" (click)="updateAllSaves()">Update all Saves</button>
    <button class="border-2 border-amber-200 bg-amber-400" (click)="getSave()">Get Save</button>
    <button *ngIf="isAdmin()" class="border-2 border-amber-200 bg-amber-400" (click)="updateAllDecks()">Update all Decks</button>
    <button *ngIf="isAdmin()" class="border-2 border-amber-200 bg-amber-400" (click)="updateAllSaves()">Update all Save Decks</button>
  `,
  standalone: true,
  imports: [NgIf],
})
export class TestPageComponent implements OnDestroy {

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject();

  constructor(
    public authService: AuthService,
    private mongoBackendService: MongoBackendService,
  ) { }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  isAdmin(): boolean {
    return !!ADMINS.find((user) => {
      if (this.authService.currentUser()?.uid === user.id) {
        return user.admin;
      }
      return false;
    });
  }

  updateAllSaves() {
    this.mongoBackendService
      .getSaves()
      .pipe(first())
      .subscribe((saves) => {
        saves.forEach((save) => {
          this.updateDecks(save);
        });
      });
  }

  updateAllDecks() {
    const obsArray$: Observable<any>[] = [];

    this.mongoBackendService
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
      )
      .subscribe((decks) => {
        concat(...obsArray$).subscribe();
      });
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
          !deck.imageCardId || deck.imageCardId === 'BT1-001' ? setDeckImage(deck, this.digimonCardStore.cards()).id : deck.imageCardId,
        date: !deck.date ? new Date().toString() : deck.date,
      };
    });
    const newSave: ISave = { ...save, decks: newDecks };
    if (save != newSave) {
      this.mongoBackendService.updateSave(newSave).pipe(first()).subscribe();
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

    return error ? this.mongoBackendService.updateDeck(newDecks, null, this.digimonCardStore.cards()).pipe(first()) : null;
  }

  getSave() {
    this.mongoBackendService
      .getSave('i49olCvVfANnLm5lCh8oufr3ytR2')
      .pipe(first())
      .subscribe((save) => {
        console.log(save);
      });
  }
}
