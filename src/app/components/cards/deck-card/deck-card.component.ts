import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import englishJSON from "../../../../assets/cardlists/english.json";
import {colorMap, ICard, IDeckCard} from "../../../../models";

@Component({
  selector: 'digimon-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent {
  @Input() public card: IDeckCard;
  @Input() public cards: ICard[];
  @Input() public stack: boolean;
  @Input() public missingCards: boolean;
  @Input() public cardHave: number;
  @Input() public fullCards: boolean;

  @Input() public edit?: boolean = true;

  @Output() public removeCard = new EventEmitter<boolean>();
  @Output() public onChange = new EventEmitter<boolean>();

  colorMap = colorMap;

  viewCard: ICard = englishJSON[0];
  viewCardDialog = false;

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


  showCardDetails() {
    this.viewCard = this.cards.find(card => card.cardNumber === this.card.cardNumber)!;
    this.viewCardDialog = true;
  }
}
