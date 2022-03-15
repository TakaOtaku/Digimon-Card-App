import {Component, Input, OnInit} from '@angular/core';
import {ICard} from "../../../models";

@Component({
  selector: 'digimon-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.css']
})
export class DeckCardComponent implements OnInit {
  @Input() public card: ICard;
  @Input() public stack: boolean;

  constructor() { }

  ngOnInit(): void {}
}
