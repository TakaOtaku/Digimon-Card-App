import {Component, Input, OnInit} from '@angular/core';
import {ICard} from "../../../models";

@Component({
  selector: 'digimon-small-deck-card',
  templateUrl: './small-deck-card.component.html',
  styleUrls: ['./small-deck-card.component.css']
})
export class SmallDeckCardComponent implements OnInit {
  @Input() public card: ICard;

  constructor() { }

  ngOnInit(): void {
  }

}
