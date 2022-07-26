import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ColorMap, ICard, IDeckCard } from '../../../../models';
import { setViewCardDialog } from '../../../store/digimon.actions';

@Component({
  selector: 'digimon-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss'],
})
export class DeckCardComponent implements OnChanges, OnInit {
  @Input() public card: IDeckCard;
  @Input() public cards: ICard[];
  @Input() public stack?: boolean = false;
  @Input() public edit?: boolean = false;
  @Input() public missingCards?: boolean = false;
  @Input() public cardHave?: number = 0;
  @Input() public fullCards?: boolean = false;
  @Input() public bigCards?: boolean = false;

  @Output() public removeCard = new EventEmitter<boolean>();
  @Output() public onChange = new EventEmitter<boolean>();

  completeCard: ICard = englishCards[0];

  colorMap = ColorMap;

  viewCard: ICard = englishCards[0];
  viewCardDialog = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.mapCard();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mapCard();
  }

  mapCard(): void {
    this.completeCard =
      this.cards.find((card) => this.card.id === card.id) ??
      (englishCards[0] as ICard);
  }

  changeCardCount(event: any): void {
    if (event.value <= 0) {
      this.removeCard.emit(true);
    }
    this.onChange.emit(true);
  }

  addCardCount(event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.card.cardNumber === 'BT6-085') {
      this.card.count = this.card.count >= 50 ? 50 : this.card.count + 1;
      this.onChange.emit(true);
      return;
    }
    this.card.count = this.card.count >= 4 ? 4 : this.card.count + 1;
    this.onChange.emit(true);
  }

  reduceCardCount(event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.card.count -= 1;
    this.onChange.emit(true);
    if (this.card.count <= 0) {
      this.card.count = 0;
      this.removeCard.emit(true);
      return;
    }
  }

  transformDCost(dCost: string): string {
    return dCost.split(' ')[0];
  }

  showCardDetails() {
    this.viewCard = this.cards.find((card) => card.id === this.card.id)!;
    this.store.dispatch(setViewCardDialog({ show: true, card: this.viewCard }));
  }
}
