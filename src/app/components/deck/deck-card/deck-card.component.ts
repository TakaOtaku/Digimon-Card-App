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

  @Output() public countChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  increaseCardCount(): void {
    if (this.card.count === 4) {
      return;
    }
    this.countChange.emit(++this.card.count);
  }

  decreaseCardCount(): void {
    if (this.card.count === 0) {
      return;
    }
    this.countChange.emit(--this.card.count);
  }
}
