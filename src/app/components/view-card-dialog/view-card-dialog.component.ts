import {Component, Input, OnInit} from '@angular/core';
import {ICard} from "../../../models";

@Component({
  selector: 'digimon-view-card-dialog',
  templateUrl: './view-card-dialog.component.html'
})
export class ViewCardDialogComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() width?: string = '50vw';
  @Input() card: ICard;

  constructor() { }

  ngOnInit(): void {
  }

  getPNG(cardSRC: string): string {
    const newSRC = '' + cardSRC;
    newSRC.replace('/cards/', '/cards/png/');
    newSRC.replace('.jpg', '.png');
    return newSRC;
  }
}
