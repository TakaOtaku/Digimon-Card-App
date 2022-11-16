import { Component, Input, OnInit } from '@angular/core';
import { ICard, IDeck } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';

@Component({
  selector: 'digimon-ddto-spread',
  templateUrl: './ddto-spread.component.html',
})
export class DdtoSpreadComponent implements OnInit {
  @Input() deck: IDeck;
  @Input() allCards: ICard[];
  @Input() container = false;

  ddto = [0, 0, 0, 0];

  ngOnInit(): void {
    this.getDDTO();
  }

  getDDTO() {
    const cards = mapToDeckCards(this.deck.cards, this.allCards);
    const digieggs = cards.filter((card) => card.cardType === 'Digi-Egg');
    const digimon = cards.filter((card) => card.cardType === 'Digimon');
    const tamer = cards.filter((card) => card.cardType === 'Tamer');
    const options = cards.filter((card) => card.cardType === 'Option');

    this.ddto[0] = getCountFromDeckCards(digieggs);
    this.ddto[1] = getCountFromDeckCards(digimon);
    this.ddto[2] = getCountFromDeckCards(tamer);
    this.ddto[3] = getCountFromDeckCards(options);
  }

  linearGradientEgg(): string {
    const eggPercent = this.ddto[0] !== 0 ? (1 - this.ddto[0] / 5) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${eggPercent}%, #08528d 0%)`;
  }

  linearGradient(value: number): string {
    const percent = value !== 0 ? (1 - value / 50) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, #08528d 0%)`;
  }
}
