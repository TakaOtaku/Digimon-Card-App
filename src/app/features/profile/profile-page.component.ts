import { AsyncPipe, Location, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  filter,
  first,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { IDeck, ISave } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import {
  selectDecks,
  selectSave,
  selectShowUserStats,
} from '../../store/digimon.selectors';
import { DeckFilterComponent } from './deck-filter.component';
import { DecksComponent } from './decks.component';
import { UserStatsComponent } from './user-stats.component';

@Component({
  selector: 'digimon-profile-page',
  template: `
    <div
      *ngIf="save$ | async as save"
      class="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <digimon-user-stats
        *ngIf="showUserStats$ | async"
        class="mx-auto my-2 h-[150px] w-full max-w-6xl"
        [save]="save"></digimon-user-stats>

      <digimon-deck-filter
        [searchFilter]="searchFilter"
        [tagFilter]="tagFilter"></digimon-deck-filter>

      <digimon-decks
        class="mx-auto mt-2 w-full max-w-6xl"
        [editable]="editable"
        [decks]="filteredDecks"></digimon-decks>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    UserStatsComponent,
    DeckFilterComponent,
    DecksComponent,
    AsyncPipe,
  ],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  save$: Observable<ISave | null>;
  decks: IDeck[];
  filteredDecks: IDeck[];
  showUserStats$ = this.store.select(selectShowUserStats);

  searchFilter = new UntypedFormControl('');
  tagFilter = new UntypedFormControl([]);

  editable = true;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public authService: AuthService,
    private digimonBackendService: DigimonBackendService,
    private store: Store,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.makeGoogleFriendly();

    this.save$ = merge(
      this.store.select(selectSave),
      this.authService.authChange.pipe(
        tap(() => this.changeURL()),
        switchMap(() => {
          this.editable = true;
          return this.digimonBackendService.getSave(
            this.authService.userData!.uid
          );
        })
      ),
      this.route.params.pipe(
        filter((params) => {
          if (!params['id']) {
            this.changeURL();
          }
          return !!params['id'];
        }),
        switchMap((params) =>
          this.digimonBackendService.getSave(params['id']).pipe(first())
        ),
        tap((save) => {
          this.editable = save.uid === this.authService.userData?.uid;
          this.decks = save?.decks ?? [];
          this.filteredDecks = this.decks;
          this.filterChanges();
        })
      )
    );

    this.storeSubscriptions();

    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
    this.tagFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.filterChanges());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  storeSubscriptions() {
    this.store
      .select(selectDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        this.decks = decks.sort((a, b) => {
          const aTitle = a.title ?? '';
          const bTitle = b.title ?? '';
          return aTitle.localeCompare(bTitle);
        });
        this.filteredDecks = this.decks;
        this.filterChanges();
      });
  }

  changeURL() {
    if (this.authService.userData?.uid) {
      this.location.replaceState('/user/' + this.authService.userData?.uid);
    } else {
      this.location.replaceState('/user');
    }
  }

  filterChanges() {
    this.filteredDecks = this.searchFilter.value
      ? this.applySearchFilter()
      : this.decks;
    this.filteredDecks =
      this.tagFilter.value.length > 0
        ? this.applyTagFilter()
        : this.filteredDecks;
    this.filteredDecks = this.filteredDecks.sort((a, b) => {
      const aTitle = a.title ?? '';
      const bTitle = b.title ?? '';
      return aTitle.localeCompare(bTitle);
    });
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

  private applySearchFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      const search = this.searchFilter.value.toLocaleLowerCase();

      const titleInText =
        deck.title?.toLocaleLowerCase().includes(search) ?? false;
      const descriptionInText =
        deck.description?.toLocaleLowerCase().includes(search) ?? false;
      const cardsInText =
        deck.cards.filter((card) =>
          card.id.toLocaleLowerCase().includes(search)
        ).length > 0;
      const colorInText =
        deck.color?.name.toLocaleLowerCase().includes(search) ?? false;

      return titleInText || descriptionInText || cardsInText || colorInText;
    });
  }

  private applyTagFilter(): IDeck[] {
    return this.decks.filter((deck) => {
      let isTrue = false;
      deck.tags?.forEach((tag) => {
        isTrue = this.tagFilter.value.includes(tag.name);
      });
      return isTrue;
    });
  }
}
