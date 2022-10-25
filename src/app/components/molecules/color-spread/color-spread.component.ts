import { Component, Input, OnInit } from '@angular/core';
import { ICard, IDeck } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';

@Component({
  selector: 'digimon-color-spread',
  templateUrl: './color-spread.component.html',
})
export class ColorSpreadComponent implements OnInit {
  @Input() deck: IDeck;
  @Input() allCards: ICard[];

  colorSpread = [0, 0, 0, 0, 0, 0, 0];

  constructor() {}

  ngOnInit(): void {
    this.getColorSpread();
  }

  getColorSpread() {
    const cards = mapToDeckCards(this.deck.cards, this.allCards);
    const red = cards.filter((card) => card.color.split('/')[0] === 'Red');
    const blue = cards.filter((card) => card.color.split('/')[0] === 'Blue');
    const yellow = cards.filter(
      (card) => card.color.split('/')[0] === 'Yellow'
    );
    const green = cards.filter((card) => card.color.split('/')[0] === 'Green');
    const black = cards.filter((card) => card.color.split('/')[0] === 'Black');
    const purple = cards.filter(
      (card) => card.color.split('/')[0] === 'Purple'
    );
    const white = cards.filter((card) => card.color.split('/')[0] === 'White');

    this.colorSpread[0] = getCountFromDeckCards(red);
    this.colorSpread[1] = getCountFromDeckCards(blue);
    this.colorSpread[2] = getCountFromDeckCards(yellow);
    this.colorSpread[3] = getCountFromDeckCards(green);
    this.colorSpread[4] = getCountFromDeckCards(black);
    this.colorSpread[5] = getCountFromDeckCards(purple);
    this.colorSpread[6] = getCountFromDeckCards(white);
  }

  linearGradient(value: number, color: string): string {
    const percent = value !== 0 ? (1 - value / 50) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, ${color} 0%)`;
  }
}
