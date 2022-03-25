import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDeckCard} from "../../../models";

@Component({
  selector: 'digimon-small-deck-card',
  templateUrl: './small-deck-card.component.html',
  styleUrls: ['./small-deck-card.component.scss']
})
export class SmallDeckCardComponent implements OnInit {
  @Input() public card: IDeckCard;

  @Output() onChange = new EventEmitter<boolean>();
  @Output() removeCard = new EventEmitter<boolean>();

  colorMap = new Map<string, string>([
    ['Red', '#e7002c'],
    ['Blue', '#0097e1'],
    ['Yellow', '#fee100'],
    ['Green', '#009c6b'],
    ['Black', '#211813'],
    ['Purple', '#6555a2'],
    ['White', '#ffffff'],
  ]);

  constructor() { }

  ngOnInit(): void {
  }

  increaseCardCount(): void {
    this.onChange.emit(true);
    this.card.count = this.card.count + 1;
    if (this.card.count >= 4) {
      this.card.count = 4;
      return;
    }
  }

  decreaseCardCount(): void {
    this.onChange.emit(true);
    this.card.count = this.card.count - 1;
    if (this.card.count <= 0) {
      this.card.count = 0;
      this.removeCard.emit(true);
      return;
    }
  }

  transformDCost(dCost: string): string {
    return dCost.split(' ')[0];
  }

  getColSpan(card: IDeckCard): any {
    if(card.cardLv === 'Lv.2') return {'col-span-11': true};
    if(card.cardType === 'Digimon') return {'col-span-9': true};
    return {'col-span-11': true};
  }
}
