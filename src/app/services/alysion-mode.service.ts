import { inject, Injectable, untracked } from '@angular/core';
import { DeckFormat, IDeck } from '../../models';
import { deckFormat } from '../functions/alysion.functions';
import { DigimonCardStore } from '../store/digimon-card.store';
import { FilterStore } from '../store/filter.store';
import { SaveStore } from '../store/save.store';
import { WebsiteStore } from '../store/website.store';

@Injectable({ providedIn: 'root' })
export class AlysionModeService {
  private cardStore = inject(DigimonCardStore);
  private filterStore = inject(FilterStore);
  private saveStore = inject(SaveStore);
  private websiteStore = inject(WebsiteStore);
  private synced = false;

  readonly mode = this.cardStore.format;

  setMode(format: DeckFormat): void {
    const alysionMode = format === 'alysion';
    const settings = this.saveStore.settings();
    if (!!settings.alysionMode !== alysionMode) {
      this.saveStore.updateSettings({ ...settings, alysionMode });
    }
    this.apply(format);
  }

  /** Loads a saved deck into the builder, in that deck's mode. */
  openDeck(deck: IDeck): void {
    this.setMode(deckFormat(deck));
    this.websiteStore.updateDeck(deck);
  }

  /** Called when the saved settings load or change; untracked so a calling effect does not follow the deck. */
  syncFromSave(): void {
    untracked(() => {
      const saved: DeckFormat = this.saveStore.settings().alysionMode ? 'alysion' : 'paper';
      const deck = this.websiteStore.deck();
      const first = !this.synced;
      this.synced = true;
      // A deck opened before the save loaded wins over the remembered mode
      if (first && deck.cards.length > 0 && deckFormat(deck) !== saved) {
        this.setMode(deckFormat(deck));
      } else {
        this.apply(saved);
      }
    });
  }

  private apply(format: DeckFormat): void {
    this.cardStore.updateFormat(format);
    this.filterStore.switchFormat(format);
    this.websiteStore.switchFormat(format);
  }
}
