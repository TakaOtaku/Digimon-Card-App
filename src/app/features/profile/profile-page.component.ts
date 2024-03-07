import { AsyncPipe, Location, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntypedFormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
import { SaveStore } from '../../store/save.store';
import { PageComponent } from '../shared/page.component';
import { DeckFilterComponent } from './components/deck-filter.component';
import { DecksComponent } from './components/decks.component';
import { UserStatsComponent } from './components/user-stats.component';

@Component({
  selector: 'digimon-profile-page',
  template: `
    <digimon-page *ngIf="save$ | async as save">
      <div
        class="flex flex-col self-baseline px-5 max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <digimon-user-stats
          *ngIf="showUserStats"
          [save]="save"
          class="mx-auto my-1 w-[calc(100%-3rem)] sm:w-full"></digimon-user-stats>

        <digimon-deck-filter
          [searchFilter]="searchFilter"
          [tagFilter]="tagFilter"
          class="mx-auto w-[calc(100%-3rem)] sm:w-full"></digimon-deck-filter>

        <digimon-decks
          class="mx-auto mt-1 w-full"
          [editable]="editable"
          [decks]="filteredDecks"></digimon-decks>
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DeckFilterComponent,
    DecksComponent,
    UserStatsComponent,
    PageComponent,
  ],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  saveStore = inject(SaveStore);

  save$: Observable<ISave | null>;
  decks: IDeck[];
  filteredDecks: IDeck[];
  showUserStats = this.saveStore.settings().showUserStats;

  searchFilter = new UntypedFormControl('');
  tagFilter = new UntypedFormControl([]);

  editable = true;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public authService: AuthService,
    private digimonBackendService: DigimonBackendService,
    private meta: Meta,
    private title: Title,
  ) {
    effect(() => {
      this.decks = this.saveStore.decks().sort((a, b) => {
        const aTitle = a.title ?? '';
        const bTitle = b.title ?? '';
        return aTitle.localeCompare(bTitle);
      });
      this.filteredDecks = this.decks;
      this.filterChanges();
    });

    this.save$ = merge(
      toObservable(this.saveStore.save),
      this.authService.authChange.pipe(
        tap(() => this.changeURL()),
        switchMap(() => {
          this.editable = true;
          return this.digimonBackendService.getSave(
            this.authService.userData!.uid,
          );
        }),
      ),
      this.route.params.pipe(
        filter((params) => {
          if (!params['id']) {
            this.changeURL();
          }
          return !!params['id'];
        }),
        switchMap((params) =>
          this.digimonBackendService.getSave(params['id']).pipe(first()),
        ),
        tap((save) => {
          this.editable = save.uid === this.authService.userData?.uid;
          this.decks = save?.decks ?? [];
          this.filteredDecks = this.decks;
          this.filterChanges();
        }),
      ),
    );
  }

  ngOnInit() {
    this.makeGoogleFriendly();

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
          card.id.toLocaleLowerCase().includes(search),
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
