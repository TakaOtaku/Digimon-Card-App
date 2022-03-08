import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {IDeck} from "../../models";
import {ImportDeckComponent} from "../import-deck/import-deck.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.css']
})
export class DecksComponent implements OnInit {
  public decks: IDeck[] = [{
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: '[P] Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: 'purple',
    image: 'assets/images/cards/BT6-081_P1.png'
  }];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openImportDialog(): void  {
    this.dialog.open(ImportDeckComponent, {width: '70%', height: '50%'});
  }
}
