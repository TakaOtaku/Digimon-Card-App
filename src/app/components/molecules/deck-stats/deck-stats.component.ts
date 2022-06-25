import { Component, Input } from '@angular/core';
import { IDeckCard } from '../../../../models';

@Component({
  selector: 'digimon-deck-stats',
  templateUrl: './deck-stats.component.html',
})
export class DeckStatsComponent {
  @Input() showStats = false;
  @Input() collectionView = false;
  @Input() mainDeck: IDeckCard[];
}
