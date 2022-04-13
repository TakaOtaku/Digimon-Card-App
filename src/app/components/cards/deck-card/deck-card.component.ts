import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {colorMap, IDeckCard} from "../../../../models";

@Component({
  selector: 'digimon-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent {
  @Input() public card: IDeckCard;
  @Input() public stack: boolean;
  @Input() public missingCards: boolean;
  @Input() public cardHave: number;
  @Input() public fullCards: boolean;

  @Input() public edit?: boolean = true;

  @Output() public removeCard = new EventEmitter<boolean>();
  @Output() public onChange = new EventEmitter<boolean>();

  colorMap = colorMap;

  changeCardCount(event: any): void {
    this.onChange.emit(true);
    this.card.count = event.value;
    if (this.card.count <= 0) {
      this.card.count = 0;
      this.removeCard.emit(true);
      return;
    }
  }

  addCardCount(): void {
    this.onChange.emit(true);
    this.card.count += 1;
  }

  reduceCardCount(): void {
    this.onChange.emit(true);
    this.card.count -= 1;
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
