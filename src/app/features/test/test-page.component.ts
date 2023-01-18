import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Store } from '@ngrx/store';
import {
  concat,
  filter,
  first,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  ADMINS,
  IBlog,
  IBlogWithText,
  ICard,
  IDeck,
  ISave,
} from '../../../models';
import { setColors, setTags } from '../../functions/digimon-card.functions';
import { AuthService } from '../../service/auth.service';
import { CardMarketService } from '../../service/card-market.service';
import { CardTraderService } from '../../service/card-trader.service';
import { DatabaseService } from '../../service/database.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { selectAllCards } from '../../store/digimon.selectors';
import { emptySettings } from '../../store/reducers/save.reducer';

@Component({
  selector: 'digimon-test-page',
  template: `
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="transferAllDataToSQL()"
    >
      Realtime Database to MySQL
    </button>
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updateAllDecks()"
    >
      Update all Decks
    </button>
    <button
      *ngIf="isAdmin()"
      class="border-2 border-amber-200 bg-amber-400"
      (click)="updatePriceGuideIds()"
    >
      Update PriceGuide Ids
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPageComponent implements OnInit, OnDestroy {
  private allCards: ICard[] = [];
  private onDestroy$ = new Subject();
  constructor(
    private store: Store,
    public authService: AuthService,
    private databaseService: DatabaseService,
    private digimonBackendService: DigimonBackendService,
    private cardTraderService: CardTraderService,
    private cardMarketService: CardMarketService
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

  transferAllDataToSQL() {
    this.transferDecks();
    this.transferUsers();
    this.transferBlogs();
    this.transferBlogsWithText();
    //this.transferFromSQLDecks();
    //this.transferFromSQLUsers();
    //this.transferFromSQLBlogs();
    //this.transferFromSQLBlogsWithText();
  }

  transferDecks() {
    this.databaseService
      .loadCommunityDecks()
      .pipe(filter((value) => value.length > 0))
      .subscribe((decks) => {
        decks.forEach((deck) => {
          this.digimonBackendService
            .updateDeckWithoutUser(deck)
            .pipe(
              first(),
              tap(() => console.log('Update Deck' + deck.id))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferUsers() {
    this.databaseService.loadUsers().subscribe((r) => {
      const value: DataSnapshot = r;
      if (!value) {
        return;
      }
      const keys: any[] = Object.keys(value.val());
      const saves: ISave[] = Object.values(value.val());

      const savesWithID = saves.map((value, index) => {
        if (value.uid) {
          return value;
        } else {
          value.uid = keys[index];
          return value;
        }
      });

      const uniqueIds: any[] = [];
      const duplicatesRemoved = savesWithID.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.uid);

        if (!isDuplicate) {
          uniqueIds.push(element.uid);
          return true;
        }

        return false;
      });

      duplicatesRemoved
        .filter((value1) => value1.uid)
        .forEach((save: ISave) => {
          if (!save.collection) {
            save.collection = [];
          }
          if (!save.decks) {
            save.decks = [];
          }
          if (!save.displayName) {
            save.displayName = '';
          }
          if (!save.photoURL) {
            save.photoURL = '';
          }
          if (!save.settings) {
            save.settings = emptySettings;
          }
          if (!save.version) {
            save.version = 1.3;
          }

          this.digimonBackendService
            .updateSave(save)
            .pipe(
              first(),
              tap(() => console.log('Update Save' + save.uid))
            )
            .subscribe((message) => console.log(message));
        });
    });
  }

  transferBlogs() {
    this.databaseService.loadBlogEntries().subscribe((value: DataSnapshot) => {
      const blogs: IBlog[] = Object.values(value.val());

      blogs.forEach((blog) => {
        this.digimonBackendService
          .updateBlog(blog)
          .pipe(
            first(),
            tap(() => console.log('Update Blog' + blog.uid))
          )
          .subscribe((message) => console.log(message));
      });
    });
  }

  transferBlogsWithText() {
    this.databaseService.loadBlogText().subscribe((value: DataSnapshot) => {
      const blogTexts: IBlogWithText[] = Object.values(value.val());

      blogTexts.forEach((blog) => {
        this.digimonBackendService
          .updateBlogWithText(blog)
          .pipe(
            first(),
            tap(() => console.log('Update BlogWithText' + blog.uid))
          )
          .subscribe((message) => console.log(message));
      });
    });
  }

  transferFromSQLDecks() {
    this.digimonBackendService
      .getDecks('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((decks) => {
        decks.forEach((deck) => {
          this.digimonBackendService
            .updateDeckWithoutUser(deck)
            .pipe(
              first(),
              tap(() => console.log('Update Deck' + deck.id))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLUsers() {
    this.digimonBackendService
      .getSaves('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((saves) => {
        saves.forEach((save) => {
          this.digimonBackendService
            .updateSave(save)
            .pipe(
              first(),
              tap(() => console.log('Update Save' + save.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLBlogs() {
    this.digimonBackendService
      .getBlogEntries('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((blogs) => {
        blogs.forEach((blog) => {
          this.digimonBackendService
            .updateBlog(blog)
            .pipe(
              first(),
              tap(() => console.log('Update Blog' + blog.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLBlogsWithText() {
    this.digimonBackendService
      .getBlogEntriesWithText('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((blogs) => {
        blogs.forEach((blog) => {
          this.digimonBackendService
            .updateBlogWithText(blog)
            .pipe(
              first(),
              tap(() => console.log('Update Blog' + blog.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  updateAllDecks() {
    this.digimonBackendService
      .getSaves()
      .pipe(first())
      .subscribe((saves) => {
        saves.forEach((save) => {
          this.updateDecks(save);
        });
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
      };
    });
    const newSave: ISave = { ...save, decks: newDecks };
    if (save != newSave) {
      this.digimonBackendService.updateSave(newSave).pipe(first()).subscribe();
    }
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
            })
          )
          .subscribe((value) => console.log(value));
      });

      //concat(...observable).subscribe((value) => console.log(value));
    });
  }
}
