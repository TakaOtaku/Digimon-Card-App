import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import englishJSON from "../../../../assets/cardlists/english.json";
import {ColorMap, ICard, IDeckCard} from "../../../../models";
import {setViewCardDialog} from "../../../store/digimon.actions";

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

  colorMap = ColorMap;

  viewCard: ICard = englishJSON[0];
  viewCardDialog = false;

  constructor(private store: Store) {}

  changeCardCount(event: any): void {
    if (event.value <= 0) {
      this.removeCard.emit(true);
    }
    this.onChange.emit(true);
  }

  addCardCount(): void {
    if(this.card.cardNumber === 'BT6-085') {
      this.card.count = this.card.count >= 50 ? 50 : this.card.count + 1;
      this.onChange.emit(true);
      return;
    }
    this.card.count = this.card.count >= 4 ? 4 : this.card.count + 1;
    this.onChange.emit(true);
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
    this.store.dispatch(setViewCardDialog({show: true, card: this.viewCard}));
  }
}
