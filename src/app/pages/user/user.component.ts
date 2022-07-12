import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ICard, ICountCard, IDeck, IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import {
  selectAllCards,
  selectCollection,
  selectDecks,
} from '../../store/digimon.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'digimon-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  collection: ICountCard[];
  user: IUser | null;
  decks: IDeck[];
  allCards: ICard[];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private store: Store
  ) {
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.changeURL();
      });

    route.params.subscribe((params: Params) => {
      //this.databaseService.loadUser(params['id']).subscribe((user) => {
      //  this.store.dispatch(
      //    setUser({
      //      user: user,
      //    })
      //  );
      //});
      if (!params['id']) {
        this.changeURL();
      }
    });
  }

  ngOnInit() {
    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => (this.collection = collection));
    this.store
      .select(selectDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => (this.decks = decks));
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.allCards = cards));

    this.user = this.authService.userData;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  changeURL() {
    if (this.authService.userData?.uid) {
      this.location.replaceState('/user/' + this.authService.userData?.uid);
    } else {
      this.location.replaceState('');
    }
  }
}
