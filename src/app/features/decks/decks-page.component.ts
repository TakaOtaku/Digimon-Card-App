import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subject, takeUntil } from "rxjs";
import * as uuid from "uuid";
import { ICard, IDeck, TAGS } from "../../../models";
import { AuthService } from "../../service/auth.service";
import { DigimonBackendService } from "../../service/digimon-backend.service";
import { importDeck } from "../../store/digimon.actions";
import { selectAllCards, selectCommunityDecks, selectCommunityDeckSearch } from "../../store/digimon.selectors";
import { emptyDeck } from "../../store/reducers/digimon.reducers";

@Component({
  selector: "digimon-decks-page",
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]"
    >
      <div class="mx-auto w-full max-w-6xl">
        <div class="flex flex-row">
          <button>
            <h1
              [ngClass]="{ 'text-[#64B5F6]': mode === 'Community' }"
              (click)="mode = 'Community'"
              class="raise-xs surface-card text-shadow mt-6 border border-slate-200 p-1 text-4xl font-black text-[#e2e4e6] transition-all xl:mt-2"
            >
              Community Decks
            </h1>
          </button>

          <button class="ml-auto">
            <h1
              [ngClass]="{ 'text-[#64B5F6]': mode === 'Tournament' }"
              (click)="mode = 'Tournament'"
              class="raise-xs surface-card text-shadow mt-6 border border-slate-200 p-1 text-4xl font-black text-[#e2e4e6] transition-all xl:mt-2"
            >
              Tournament Decks
            </h1>
          </button>
        </div>

        <div
          class="my-1 mx-auto flex max-w-6xl flex-row border border-slate-200"
        >
          <div class="my-1 flex w-full flex-col px-2">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search h-3"></i>
              <input
                [formControl]="searchFilter"
                class="w-full text-xs"
                pInputText
                placeholder="Search (Title, Description, Card-Ids, Color)"
                type="text"
              />
            </span>
          </div>
          <p-multiSelect
            [formControl]="tagFilter"
            [options]="tags"
            [showToggleAll]="false"
            defaultLabel="Select a Tag"
            display="chip"
            scrollHeight="250px"
            class="my-1 mx-auto w-full max-w-[250px]"
            styleClass="w-full h-[34px] text-sm max-w-[250px]"
          >
          </p-multiSelect>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <digimon-deck-container
            *ngFor="let deck of filteredDecks"
            (click)="showDeckDetails(deck)"
            (contextmenu)="showDeckDetails(deck)"
            [deck]="deck"
            [community]="true"
          ></digimon-deck-container>
        </div>
      </div>
    </div>

    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000"
    >
      <digimon-deck-dialog
        [deck]="selectedDeck ?? emptyDeck"
        [editable]="false"
        (closeDialog)="deckDialog = false"
      ></digimon-deck-dialog>
    </p-dialog>
  `,
})
export class DecksPageComponent implements OnInit, OnDestroy {
  mode: "Community" | "Tournament" = "Community";
  decks: IDeck[] = [];
  filteredDecks: IDeck[] = [];
  selectedDeck: IDeck;

  searchFilter = new FormControl("");
  tagFilter = new FormControl([]);

  tags = TAGS;

  deckDialog = false;
  emptyDeck = emptyDeck;

  public allCards: ICard[] = [];
  private allDecks: IDeck[] = [];

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private meta: Meta,
    private title: Title
  ) {
  }

  ngOnInit(): void {
    this.makeGoogleFriendly();

    this.store
      .select(selectCommunityDecks)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((decks) => {
        this.allDecks = [...decks].sort((a, b) => {
          const aTime = new Date(a.date!).getTime();
          const bTime = new Date(b.date!).getTime();
          return bTime - aTime;
        });
        this.decks = this.allDecks;
        this.filteredDecks = this.decks;
        this.filterChanges();
      });
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));

    this.store
      .select(selectCommunityDeckSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((search) => {
        this.searchFilter.setValue(search);
        this.filterChanges();
      });

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

  copyDeck(deck: IDeck) {
    this.confirmationService.confirm({
      message: "You are about to copy this deck. Are you sure?",
      accept: () => {
        this.store.dispatch(
          importDeck({
            deck: { ...deck, id: uuid.v4() }
          })
        );
        this.messageService.add({
          severity: "success",
          summary: "Deck copied!",
          detail: "Deck was copied successfully!"
        });
      }
    });
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
      const aTime = new Date(a.date!).getTime();
      const bTime = new Date(b.date!).getTime();
      return bTime - aTime;
    });
  }

  showDeckDetails(deck: IDeck) {
    this.selectedDeck = deck;
    this.deckDialog = true;
  }

  private makeGoogleFriendly() {
    this.title.setTitle("Digimon Card Game - Community");

    this.meta.addTags([
      {
        name: "description",
        content:
          "Meta decks, fun decks, tournament decks and many more, find new decks for every set."
      },
      { name: "author", content: "TakaOtaku" },
      {
        name: "keywords",
        content: "Meta, decks, tournament, fun"
      }
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
