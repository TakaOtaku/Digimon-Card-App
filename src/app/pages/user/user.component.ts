import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Store} from '@ngrx/store';
import {first, Subject, takeUntil} from 'rxjs';
import {ICard, ICountCard, IDeck, ISave} from '../../../models';
import {AuthService} from '../../service/auth.service';
import {DatabaseService} from '../../service/database.service';
import {
  selectAllCards,
  selectCollection,
  selectDecks,
  selectSave,
  selectShowUserStats,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  collection: ICountCard[];
  save: ISave | null;
  decks: IDeck[];
  allCards: ICard[];
  showUserStats = true;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.storeSubscriptions();

    this.userChange();

    this.checkURL();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  storeSubscriptions() {
    this.store
      .select(selectSave)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((save) => (this.save = save));
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
    this.store
      .select(selectShowUserStats)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((showUserStats) => (this.showUserStats = showUserStats));
  }

  userChange() {
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.changeURL();
        this.databaseService.loadSave(this.authService.userData!.uid).pipe(first()).subscribe((save) => {
          this.save = save;
        });
      });
  }

  checkURL() {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe((params: Params) => {
      this.databaseService.loadSave(params['id']).pipe(first()).subscribe((save) => {
        this.save = save;
        this.decks = save?.decks ?? this.decks;
        this.collection = save?.collection ?? this.collection;
      });
      if (!params['id']) {
        this.changeURL();
      }
    });
  }

  changeURL() {
    if (this.authService.userData?.uid) {
      this.location.replaceState('/user/' + this.authService.userData?.uid);
    } else {
      this.location.replaceState('');
    }
  }
}
