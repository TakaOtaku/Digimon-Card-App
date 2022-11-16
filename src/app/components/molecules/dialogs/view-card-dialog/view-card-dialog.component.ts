import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../../../assets/cardlists/eng/english';
import { ColorMap, ICard, IDeck } from '../../../../../models';
import { formatId } from '../../../../functions/digimon-card.functions';
import {
  selectAllCards,
  selectDeck,
  selectFilteredCards,
} from '../../../../store/digimon.selectors';

@Component({
  selector: 'digimon-view-card-dialog',
  templateUrl: './view-card-dialog.component.html',
})
export class ViewCardDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() card: ICard = englishCards[0];

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
    ['Stamp', 'Stamped'],
  ]);

  type: string;

  deck: IDeck;

  private onDestroy$ = new Subject();
  constructor(private store: Store) {}

  ngOnInit() {
    if (this.card) {
      this.setupView(this.card);
    }
    this.store
      .select(selectDeck)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((deck) => (this.deck = deck));

    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.allCards = cards));
  }


  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['card']) {
      const card: ICard = changes['card'].currentValue;
      this.setupView(card);
    }
  }

  setupView(card: ICard) {
    this.color = this.colorMap.get(card.color)!;
    this.backgroundColor = this.color;
    this.version = this.versionMap.get(card.version)!;
    this.png = card.cardImage;
    this.imageAlt = card.cardNumber + ' ' + card.name;
    this.type = card?.cardType;
  }

  getPNG(cardSRC: string): string {
    let engRegExp = new RegExp('\\beng\\b');
    let japRegExp = new RegExp('\\bjap\\b');
    let preReleaseRegExp = new RegExp('\\bpre-release\\b');

    if (engRegExp.test(cardSRC)) {
      return cardSRC
        .replace(engRegExp, 'eng/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    } else if (japRegExp.test(cardSRC)) {
      return cardSRC
        .replace(japRegExp, 'jap/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    } else {
      return cardSRC
        .replace(preReleaseRegExp, 'pre-release/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    }
  }

  openWiki() {
    const wikiLink =
      'https://digimoncardgame.fandom.com/wiki/' + formatId(this.card.id);
    window.open(wikiLink, '_blank');
  }

  openWikiIllustrator() {
    const wikiLink =
      'https://digimoncardgame.fandom.com/wiki/' + this.card.illustrator;
    window.open(wikiLink, '_blank');
  }

  inDeck(): boolean {
    return !!this.deck.cards.find((card) => card.id === this.card.id);
  }

  deckCount(): number {
    const card = this.deck.cards.find((card) => card.id === this.card.id);
    return card?.count ?? 0;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.nextCard();
    }
    if (event.key == 'ArrowLeft') {
      this.previousCard();
    }
  }

  previousCard() {
    const id = this.allCards.findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === 0) {
      return;
    }
    const newCard = this.allCards[id - 1];
    if (!newCard) {
      return;
    }
    console.log(newCard);
    this.card = newCard;
    this.setupView(newCard);
  }

  nextCard() {
    const id = this.allCards.findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === this.allCards.length + 1) {
      return;
    }
    const newCard = this.allCards[id + 1];
    if (!newCard) {
      return;
    }
    console.log(newCard);
    this.card = newCard;
    this.setupView(newCard);
  }
}
