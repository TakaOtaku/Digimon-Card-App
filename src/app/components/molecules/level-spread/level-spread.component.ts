import { Component, Input, OnInit } from '@angular/core';
import { ICard, IDeck } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';

@Component({
  selector: 'digimon-level-spread',
  templateUrl: './level-spread.component.html',
})
export class LevelSpreadComponent implements OnInit {
  @Input() deck: IDeck;
  @Input() allCards: ICard[];

  levelSpread = [0, 0, 0, 0, 0, 0];

  constructor() {}

  ngOnInit(): void {
    this.getLevelSpread();
  }

  getLevelSpread() {
    const cards = mapToDeckCards(this.deck.cards, this.allCards);
    const digieggs = cards.filter((card) => card.cardType === 'Digi-Egg');
    const lv3 = cards.filter((card) => card.cardLv === 'Lv.3');
    const lv4 = cards.filter((card) => card.cardLv === 'Lv.4');
    const lv5 = cards.filter((card) => card.cardLv === 'Lv.5');
    const lv6 = cards.filter((card) => card.cardLv === 'Lv.6');
    const lv7 = cards.filter((card) => card.cardLv === 'Lv.7');

    this.levelSpread[0] = getCountFromDeckCards(digieggs);
    this.levelSpread[1] = getCountFromDeckCards(lv3);
    this.levelSpread[2] = getCountFromDeckCards(lv4);
    this.levelSpread[3] = getCountFromDeckCards(lv5);
    this.levelSpread[4] = getCountFromDeckCards(lv6);
    this.levelSpread[5] = getCountFromDeckCards(lv7);
  }

  linearGradientEgg(): string {
    const eggPercent =
      this.levelSpread[0] !== 0 ? (1 - this.levelSpread[0] / 5) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${eggPercent}%, #08528d 0%)`;
  }

  linearGradient(value: number): string {
    const percent = value !== 0 ? (1 - value / 50) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, #08528d 0%)`;
  }
}
