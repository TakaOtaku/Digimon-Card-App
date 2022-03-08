import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {IDeck} from "../../models";
import {ImportDeckComponent} from "../import-deck/import-deck.component";

@Component({
  selector: 'digimon-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit {
  public decks: IDeck[] = [
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: 'Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#6256a5',
    image: 'assets/images/cards/BT6-081_P1.png'
    },
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: 'Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#fee000',
    image: 'assets/images/cards/BT6-081_P1.png'
    },
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: '[P] Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#009c6b',
    image: 'assets/images/cards/BT6-081_P1.png'
    },
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: '[P] Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#e70530',
    image: 'assets/images/cards/BT6-081_P1.png'
    },
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: '[P] Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#0096e0',
    image: 'assets/images/cards/BT6-081_P1.png'
    },
    {
    cards: [{count: 4, name: 'Titamon', id: 'BT6-81'}],
    title: '[P] Titamon Deck',
    description: '[P] Titamon Deck for BT7',
    color: '#201813',
    image: 'assets/images/cards/BT6-081_P1.png'
    }];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openImportDialog(): void  {
    this.dialog.open(ImportDeckComponent, {width: '600px', height: '700px'});
  }
}
