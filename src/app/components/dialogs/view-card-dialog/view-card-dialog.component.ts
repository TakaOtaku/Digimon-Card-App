import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColorMap, ICard} from "../../../../models";
import {formatId} from "../../../functions/digimon-card.functions";

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
  colorMap = ColorMap;

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
    let engRegExp = new RegExp('\\beng\\b');
    let japRegExp = new RegExp('\\bjap\\b');
    let preReleaseRegExp = new RegExp('\\bpre-release\\b');

    if(engRegExp.test(cardSRC)) {
      return cardSRC.replace(engRegExp, 'eng/png')
        .replace(new RegExp('\\b.jpg\\b'), '.png')
    } else if(japRegExp.test(cardSRC)) {
      return cardSRC.replace(japRegExp, 'jap/png')
        .replace(new RegExp('\\b.jpg\\b'), '.png')
    } else {
      return cardSRC.replace(preReleaseRegExp, 'pre-release/png')
        .replace(new RegExp('\\b.jpg\\b'), '.png')
    }
  }

  openWiki() {
    const wikiLink = 'https://digimoncardgame.fandom.com/wiki/'+formatId(this.card.id);
    window.open(wikiLink, '_blank');
  }

  openWikiIllustrator() {
    const wikiLink = 'https://digimoncardgame.fandom.com/wiki/'+this.card.illustrator;
    window.open(wikiLink, '_blank');
  }
}
