import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectDeck} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-deck-builder',
  templateUrl: './deck-builder.component.html',
  styleUrls: ['./deck-builder.component.css']
})
export class DeckBuilderComponent implements OnInit {

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(selectDeck);
  }
}
