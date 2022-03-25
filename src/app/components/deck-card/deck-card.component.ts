import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDeckCard} from "../../../models";

@Component({
  selector: 'digimon-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.css']
})
export class DeckCardComponent implements OnInit {
  @Input() public card: IDeckCard;
  @Input() public stack: boolean;

  @Output() public removeCard = new EventEmitter<boolean>();
  @Output() public onChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

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
}
