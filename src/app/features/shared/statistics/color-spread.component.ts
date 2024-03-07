import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DigimonCard, IDeck } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/digimon-card.functions';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { SingleContainerComponent } from '../single-container.component';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'digimon-color-spread',
  template: `
    <div
      *ngIf="!container"
      class="flex h-full w-full flex-row flex-nowrap items-stretch">
      <div
        *ngIf="colorSpread[0] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[0], '#ef1919')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[0] }}</span>
      </div>
      <div
        *ngIf="colorSpread[1] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[1], '#19a0e3')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[1] }}</span>
      </div>
      <div
        *ngIf="colorSpread[2] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[2], '#ffd619')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[2] }}</span>
      </div>
      <div
        *ngIf="colorSpread[3] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[3], '#19b383')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[3] }}</span>
      </div>
      <div
        *ngIf="colorSpread[4] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[4], '#191919')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[4] }}</span>
      </div>
      <div
        *ngIf="colorSpread[5] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[5], '#8d6fdb')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[5] }}</span>
      </div>
      <div
        *ngIf="colorSpread[6] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[6], '#ffffff')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[6] }}</span>
      </div>
    </div>

    <div *ngIf="container" class="flex w-full flex-row">
      <digimon-single-container
        label="Red"
        color="#ef1919"
        class="w-10"
        [value]="colorSpread[0]"></digimon-single-container>
      <digimon-single-container
        label="Blue"
        color="#19a0e3"
        class="w-10"
        [value]="colorSpread[1]"></digimon-single-container>
      <digimon-single-container
        label="Yellow"
        color="#ffd619"
        class="w-10"
        [value]="colorSpread[2]"></digimon-single-container>
      <digimon-single-container
        label="Green"
        color="#19b383"
        class="w-10"
        [value]="colorSpread[3]"></digimon-single-container>
      <digimon-single-container
        label="Black"
        color="#191919"
        class="w-10"
        [value]="colorSpread[4]"></digimon-single-container>
      <digimon-single-container
        label="Purple"
        color="#8d6fdb"
        class="w-10"
        [value]="colorSpread[5]"></digimon-single-container>
      <digimon-single-container
        label="White"
        color="#ffffff"
        class="w-10"
        [value]="colorSpread[6]"></digimon-single-container>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgStyle, SingleContainerComponent],
})
export class ColorSpreadComponent implements OnInit, OnChanges {
  @Input() deck: IDeck | null;
  @Input() container = false;

  colorSpread = [0, 0, 0, 0, 0, 0, 0];

  private digimonCardStore = inject(DigimonCardStore);

  ngOnInit(): void {
    this.getColorSpread();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getColorSpread();
  }

  getColorSpread() {
    if (!this.deck) {
      return;
    }

    const cards = mapToDeckCards(
      this.deck.cards,
      this.digimonCardStore.cards(),
    );
    const red = cards.filter((card) => card.color.split('/')[0] === 'Red');
    const blue = cards.filter((card) => card.color.split('/')[0] === 'Blue');
    const yellow = cards.filter(
      (card) => card.color.split('/')[0] === 'Yellow',
    );
    const green = cards.filter((card) => card.color.split('/')[0] === 'Green');
    const black = cards.filter((card) => card.color.split('/')[0] === 'Black');
    const purple = cards.filter(
      (card) => card.color.split('/')[0] === 'Purple',
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
