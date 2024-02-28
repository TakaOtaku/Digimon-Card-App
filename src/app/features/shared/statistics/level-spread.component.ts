import { Component, inject, Input, OnInit } from '@angular/core';
import { DigimonCard, IDeck } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';
import { NgStyle } from '@angular/common';
import { DigimonCardStore } from '../../../store/digimon-card.store';

@Component({
  selector: 'digimon-level-spread',
  template: `
    <div class="no-gap grid h-full w-full grid-cols-6">
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradientEgg()
        }">
        <span class="text-black-outline-xs">{{ levelSpread[0] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(levelSpread[1])
        }">
        <span class="text-black-outline-xs">{{ levelSpread[1] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(levelSpread[2])
        }">
        <span class="text-black-outline-xs">{{ levelSpread[2] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(levelSpread[3])
        }">
        <span class="text-black-outline-xs">{{ levelSpread[3] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(levelSpread[4])
        }">
        <span class="text-black-outline-xs">{{ levelSpread[4] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(levelSpread[5])
        }">
        <span class="text-black-outline-xs">{{ levelSpread[5] }}</span>
      </div>

      <h3 class="h-1/2 text-center text-xs">Lv.2</h3>
      <h3 class="h-1/2 text-center text-xs">Lv.3</h3>
      <h3 class="h-1/2 text-center text-xs">Lv.4</h3>
      <h3 class="h-1/2 text-center text-xs">Lv.5</h3>
      <h3 class="h-1/2 text-center text-xs">Lv.6</h3>
      <h3 class="h-1/2 text-center text-xs">Lv.7</h3>
    </div>
  `,
  standalone: true,
  imports: [NgStyle],
})
export class LevelSpreadComponent implements OnInit {
  @Input() deck: IDeck;

  levelSpread = [0, 0, 0, 0, 0, 0];

  private digimonCardStore = inject(DigimonCardStore);

  ngOnInit(): void {
    this.getLevelSpread();
  }

  getLevelSpread() {
    const cards = mapToDeckCards(
      this.deck.cards,
      this.digimonCardStore.cards(),
    );
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
