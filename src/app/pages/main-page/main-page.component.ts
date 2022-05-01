import {Component, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {englishCards} from "../../../assets/cardlists/eng/english";
import {ICard, IDeck} from "../../../models";
import {
  setAccessoryDeckDialog,
  setExportDeckDialog,
  setImportDeckDialog,
  setViewCardDialog
} from "../../store/digimon.actions";
import {
  selectAccessoryDeckDialog,
  selectExportDeckDialog,
  selectImportDeckDialog,
  selectSite, selectViewCardDialog
} from "../../store/digimon.selectors";
import {emptyDeck} from "../../store/reducers/digimon.reducers";

export enum SITES {
  'Collection',
  'Decks',
  'DeckBuilder',
  'CommunityDecks'
}

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnDestroy {
  SITES = SITES;
  site: number = SITES.Collection;

  importDeckDialog = false;
  exportDeckDialog = false;
  accessoryDeckDialog = false;
  viewCardDialog = false;

  selectedDeck: IDeck = emptyDeck;
  selectedCard: ICard = englishCards[0];

  private destroy$ = new Subject();

  constructor(public store: Store) {
    this.store.select(selectSite).pipe(takeUntil(this.destroy$)).subscribe(site => this.site = site);

    this.store.select(selectImportDeckDialog).pipe(takeUntil(this.destroy$)).subscribe(dialog => this.importDeckDialog = dialog.show);
    this.store.select(selectExportDeckDialog).pipe(takeUntil(this.destroy$)).subscribe(dialog => {
      this.exportDeckDialog = dialog.show;
      this.selectedDeck = dialog.deck;
    });
    this.store.select(selectAccessoryDeckDialog).pipe(takeUntil(this.destroy$)).subscribe(dialog => {
      this.accessoryDeckDialog = dialog.show;
      this.selectedDeck = dialog.deck;
    });
    this.store.select(selectViewCardDialog).pipe(takeUntil(this.destroy$)).subscribe(dialog => {
      this.viewCardDialog = dialog.show;
      this.selectedCard = dialog.card;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  closeImportDeckDialog() {
    this.store.dispatch(setImportDeckDialog({show: false}));
  }
  closeExportDeckDialog() {
    this.store.dispatch(setExportDeckDialog({show: false, deck: emptyDeck}));
  }
  closeAccessoryDeckDialog() {
    this.store.dispatch(setAccessoryDeckDialog({show: false, deck: emptyDeck}));
  }
  closeViewCardDialog() {
    this.store.dispatch(setViewCardDialog({show: false, card: englishCards[0]}));
  }
}
