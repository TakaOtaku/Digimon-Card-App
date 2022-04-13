import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {colorMap, ICard} from "../../../../models";

@Component({
  selector: 'digimon-view-card-dialog',
  templateUrl: './view-card-dialog.component.html'
})
export class ViewCardDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() card: ICard;

  @Input() width?: string = '50vw';

  @Output() onClose = new EventEmitter<boolean>();

  allCards: ICard[] = [];

  png: string;
  imageAlt: string;

  color: string;
  backgroundColor: string;
  colorMap = colorMap;

  version: string;
  versionMap = new Map<string, string>([
    ['Normal', 'Normal'],
    ['AA', 'Alternative Art'],
    ['Stamp', 'Stamped']
  ]);

  type: string ;

  ngOnInit() {
    this.setupView(this.card);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes['card']) {
      const card: ICard = changes['card'].currentValue;
      this.setupView(card);
    }
  }

  setupView(card: ICard) {
    this.color = this.colorMap.get(card.color)!;
    this.backgroundColor = this.color;
    this.version = this.versionMap.get(card.version)!;
    this.png = this.getPNG(card.cardImage);
    this.imageAlt = card.cardNumber + ' ' + card.name;
    this.type = card?.cardType;
  }

  getPNG(cardSRC: string): string {
    return cardSRC.replace(new RegExp('\\bcards\\b'), 'cards/png')
      .replace(new RegExp('\\b.jpg\\b'), '.png')
  }
}
