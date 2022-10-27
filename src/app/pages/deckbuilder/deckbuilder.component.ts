import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, of, Subject, switchMap, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { IDeck, ISave } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { setDeck } from '../../store/digimon.actions';
import { selectMobileCollectionView } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-deckbuilder',
  templateUrl: './deckbuilder.component.html',
})
export class DeckbuilderComponent implements OnInit, OnDestroy {
  //region Accordions
  deckView = true;
  collectionView = true;
  showAccordionButtons = true;
  showStats = true;
  //endregion

  mobileCollectionView = false;
  hideStats = false;

  private deckId = '';

  private screenWidth: number;
  private onDestroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private meta: Meta,
    private title: Title,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.makeGoogleFriendly();

    this.store
      .select(selectMobileCollectionView)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (mobileCollectionView) =>
          (this.mobileCollectionView = mobileCollectionView)
      );

    this.checkURL();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Deck Builder');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Build tournament winning decks with the best deck builder for the Digimon TCG and share them with the community or your friends.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, decks, deck builder, tournament, TCG, community, friends, share',
      },
    ]);
  }

  checkURL() {
    this.route.params
      .pipe(
        first(),
        filter((params) => {
          return !!params['id'] || (!!params['userId'] && !!params['deckId']);
        }),
        switchMap((params) => {
          if (params['userId'] && params['deckId']) {
            this.deckId = params['deckId'];
            return this.databaseService
              .loadSave(params['userId'])
              .pipe(first());
          } else {
            this.databaseService.loadDeck(params['id']).subscribe((deck) => {
              this.store.dispatch(
                setDeck({
                  deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
                })
              );
            });
            return of(false);
          }
        })
      )
      .subscribe((save) => {
        //http://localhost:4200/user/S3rWXPtCYRN8vSrxY3qE6aeewy43/deck/160a3fb2-3703-4183-9f52-65411dfd080e
        if (!save) {
          return;
        }
        const iSave = save as unknown as ISave;

        const foundDeck = iSave.decks.find((deck) => deck.id === this.deckId);
        if (!foundDeck) {
          return;
        }

        const iDeck = foundDeck as unknown as IDeck;
        const sameUser = iSave.uid === this.authService.userData?.uid;

        this.store.dispatch(
          setDeck({
            deck: {
              ...iDeck,
              id: sameUser ? iDeck.id : uuid.v4(),
            },
          })
        );
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 768) {
      this.deckView = true;
      this.collectionView = false;

      this.showStats = true;

      this.showAccordionButtons = false;
    } else if (this.screenWidth >= 768 && this.screenWidth < 1024) {
      this.deckView = false;
      this.collectionView = true;

      this.showStats = false;

      this.showAccordionButtons = true;
    } else {
      this.deckView = true;
      this.collectionView = true;

      this.showStats = true;

      this.showAccordionButtons = true;
    }
  }

  changeView(view: string) {
    if (view === 'Deck') {
      this.deckView = !this.deckView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.collectionView = false;
          this.showStats = true;
          return;
        }
      }

      if (!this.collectionView) {
        this.collectionView = true;
      }
    } else if (view === 'Collection') {
      this.collectionView = !this.collectionView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.deckView = false;
          this.showStats = false;
          return;
        }
      }

      if (!this.deckView) {
        this.deckView = true;
      }
    }

    this.showStats = !(this.collectionView && !this.deckView);
  }
}
