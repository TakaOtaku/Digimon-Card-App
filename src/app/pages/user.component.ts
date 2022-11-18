import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, Subject, switchMap, takeUntil } from 'rxjs';
import { ICard, ICountCard, IDeck, ISave } from '../../models';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';
import {
  selectAllCards,
  selectCollection,
  selectDecks,
  selectSave,
  selectShowUserStats,
} from '../store/digimon.selectors';

@Component({
  selector: 'digimon-user',
  template: `
    <div
      class="flex flex-col lg:h-[calc(100vh-50px)] lg:w-screen lg:flex-row lg:overflow-hidden"
    >
      <div *ngIf="showUserStats" class="hidden h-full lg:block lg:w-4/12">
        <digimon-user-stats
          [collection]="collection"
          [save]="save"
        ></digimon-user-stats>
        <digimon-collection
          [allCards]="allCards"
          [collection]="collection"
        ></digimon-collection>
      </div>
      <div
        [ngClass]="{ 'lg:w-8/12': showUserStats, 'w-full': !showUserStats }"
        class="h-full lg:max-h-[calc(100vh-58px)]"
      >
        <digimon-decks [decks]="decks"></digimon-decks>
        <div class="h-24 w-full lg:hidden"></div>
      </div>
    </div>
  `,
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
    private digimonBackendService: DigimonBackendService,
    private store: Store,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.makeGoogleFriendly();

    this.storeSubscriptions();

    this.userChange();

    this.checkURL();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Profil');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'See your Collection and Decks in one view. Share them with your friends, for easy insights in your decks and trading.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Collection, Decks, Share, insights, trading',
      },
    ]);
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
        this.digimonBackendService
          .getSave(this.authService.userData!.uid)
          .pipe(first())
          .subscribe((save) => {
            this.save = save;
          });
      });
  }

  checkURL() {
    this.route.params
      .pipe(
        first(),
        filter((params) => {
          if (!params['id']) {
            this.changeURL();
          }
          return !!params['id'];
        }),
        switchMap((params) =>
          this.digimonBackendService.getSave(params['id']).pipe(first())
        )
      )
      .subscribe((save) => {
        this.save = save;
        this.decks = save?.decks ?? this.decks;
        this.collection = save?.collection ?? this.collection;
      });
  }

  changeURL() {
    if (this.authService.userData?.uid) {
      this.location.replaceState('/user/' + this.authService.userData?.uid);
    } else {
      this.location.replaceState('/user');
    }
  }
}
