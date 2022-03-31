import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ICard} from "../../../models";

@Component({
  selector: 'digimon-view-card-dialog',
  templateUrl: './view-card-dialog.component.html'
})
export class ViewCardDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() width?: string = '50vw';
  @Input() card: ICard;
  @Input() cards: ICard[];

  @Output() onClose = new EventEmitter<boolean>();

  index: number;
  aaCards: ICard[] = [];

  png: string;
  imageAlt: string;

  color: string;
  backgroundColor: string;
  colorMap = new Map<string, string>([
    ['Red', '#e7002c'],
    ['Blue', '#0097e1'],
    ['Yellow', '#fee100'],
    ['Green', '#009c6b'],
    ['Black', '#211813'],
    ['Purple', '#6555a2'],
    ['White', '#ffffff'],
  ]);

  version: string;
  versionMap = new Map<string, string>([
    ['Normal', 'Normal'],
    ['AA', 'Alternative Art'],
    ['Stamp', 'Stamped']
  ]);

  constructor(private changeDetector: ChangeDetectorRef) {}

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
    this.getAACards(card);
    this.index = this.aaCards.indexOf(this.card);
  }

  getAACards(card: ICard) {
    this.aaCards = [];
    this.cards.forEach(value => {
      if (value.id.includes(card.cardNumber)) {
        this.aaCards.push(value);
      }
    });
  }

  get previousDisabled(): boolean {
    if(this.aaCards.length === 1) {return true;}
    return this.index === 0;
  }
  get nextDisabled(): boolean {
    if(this.aaCards.length === 1) {return true;}
    return this.index === this.aaCards.length - 1;
  }

  previous() {
    this.card = this.aaCards[this.index - 1];
    this.changeDetector.detectChanges();
  }
  next() {
    this.card = this.aaCards[this.index + 1];
    this.changeDetector.detectChanges();
  }

  getPNG(cardSRC: string): string {
    return cardSRC.replace(new RegExp('\\bcards\\b'), 'cards/png')
      .replace(new RegExp('\\b.jpg\\b'), '.png')
  }
}
