import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard, IDeck } from '../../../models';
import { IDialogs } from '../../../models/interfaces/dialogs.interface';
import {
  setAccessoryDeckDialog,
  setExportDeckDialog,
  setImportDeckDialog,
  setViewCardDialog,
} from '../../store/digimon.actions';
import { selectDialogs, selectSite } from '../../store/digimon.selectors';
import { emptyDeck } from '../../store/reducers/digimon.reducers';

export enum SITES {
  'Decks',
  'DeckBuilder',
  'CommunityDecks',
}

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent implements OnDestroy {
  SITES = SITES;
  site: number = SITES.DeckBuilder;

  importDeckDialog = false;
  exportDeckDialog = false;
  accessoryDeckDialog = false;
  viewCardDialog = false;

  selectedDeck: IDeck = emptyDeck;
  selectedCard: ICard = englishCards[0];

  private destroy$ = new Subject();

  constructor(public store: Store) {
    this.store
      .select(selectSite)
      .pipe(takeUntil(this.destroy$))
      .subscribe((site: number) => (this.site = site));

    this.store
      .select(selectDialogs)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dialogs: IDialogs) => {
        this.importDeckDialog = dialogs.importDeck.show;
        this.exportDeckDialog = dialogs.exportDeck.show;
        this.selectedDeck = dialogs.exportDeck.deck;

        this.accessoryDeckDialog = dialogs.accessoryDeck.show;
        this.selectedDeck = dialogs.accessoryDeck.deck;

        this.viewCardDialog = dialogs.viewCard.show;
        this.selectedCard = dialogs.viewCard.card;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  closeImportDeckDialog() {
    this.store.dispatch(setImportDeckDialog({ show: false }));
  }

  closeExportDeckDialog() {
    this.store.dispatch(setExportDeckDialog({ show: false, deck: emptyDeck }));
  }

  closeAccessoryDeckDialog() {
    this.store.dispatch(
      setAccessoryDeckDialog({ show: false, deck: emptyDeck })
    );
  }

  closeViewCardDialog() {
    this.store.dispatch(
      setViewCardDialog({ show: false, card: englishCards[0] })
    );
  }
}
