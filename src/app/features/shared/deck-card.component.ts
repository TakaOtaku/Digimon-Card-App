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
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard, IDeckCard } from '../../../models';
import { ColorMap } from '../../../models/maps/color.map';
import { addCardToDeck, removeCardFromDeck } from '../../store/digimon.actions';

@Component({
  selector: 'digimon-deck-card',
  template: `
    <div class="relative m-1 flex flex-col">
      <div
        class="group absolute z-[101] flex h-full w-full flex-col rounded xl:opacity-0 xl:hover:opacity-100"
        (click)="showCardDetails()"
        (contextmenu)="showCardDetails()"
      >
        <div
          *ngIf="edit"
          class="hidden h-1/2 w-full rounded bg-sky-700 bg-opacity-30 xl:block"
        >
          <div class="absolute top-2">
            <button
              (click)="addCardCount($event)"
              type="button"
              class="z-[101] mx-auto flex hidden h-8 w-8 translate-x-full rounded border border-black bg-sky-700 group-hover:block"
            >
              <span class="text-shadow text-2xl font-black text-[#e2e4e6]">
                +
              </span>
            </button>
          </div>
        </div>
        <div
          *ngIf="edit"
          class="hidden h-1/2 w-full rounded bg-red-500 bg-opacity-30 xl:block"
        >
          <div class="absolute bottom-2">
            <button
              (click)="reduceCardCount($event)"
              type="button"
              class="z-[101] mx-auto flex hidden h-8 w-8 translate-x-full rounded border border-black bg-sky-700 group-hover:block"
            >
              <span class="text-shadow text-2xl font-black text-[#e2e4e6]">
                -
              </span>
            </button>
          </div>
        </div>
      </div>

      <img
        [src]="card.cardImage"
        loading="lazy"
        alt="Digimon Card"
        class="group z-50 m-auto rounded border-2 border-black"
      />

      <div *ngIf="edit" class="flex h-1/2 w-full flex-row rounded xl:hidden">
        <button
          (click)="addCardCount($event)"
          type="button"
          class="z-[101] flex h-8 w-1/2 rounded-l border border-black bg-sky-700"
        >
          <span class="text-shadow mx-auto text-2xl font-black text-[#e2e4e6]">
            +
          </span>
        </button>

        <button
          (click)="reduceCardCount($event)"
          type="button"
          class="z-[101] flex h-8 w-1/2 rounded-r border border-black bg-sky-700"
        >
          <span class="text-shadow mx-auto text-2xl font-black text-[#e2e4e6]">
            -
          </span>
        </button>
      </div>

      <span
        class="text-shadow-white absolute bottom-8 right-1 z-[100] text-2xl font-black text-orange-500 sm:text-3xl lg:text-2xl xl:bottom-1"
      >
        <span class="text-sky-700">x</span>{{ card.count }}
      </span>

      <p
        *ngIf="missingCards"
        class="text-red text-black-outline absolute left-0 right-0 top-[40px] z-[100] mx-auto text-center text-6xl font-bold"
      >
        {{
          (cardHave ?? 0) - card.count > 0 ? 0 : (cardHave ?? 0) - card.count
        }}
      </p>
    </div>

    <p-dialog
      [(visible)]="viewCardDialog"
      [showHeader]="false"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="overflow-x-hidden"
      (close)="viewCardDialog = false"
    >
      <digimon-view-card-dialog
        (onClose)="viewCardDialog = false"
        [card]="viewCard"
      ></digimon-view-card-dialog>
    </p-dialog>
  `,
})
export class DeckCardComponent implements OnChanges, OnInit {
  @Input() public card: IDeckCard;
  @Input() public cards: ICard[];
  @Input() public missingCards?: boolean = false;
  @Input() public cardHave?: number = 0;
  @Input() public edit? = true;

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

  addCardCount(event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.store.dispatch(addCardToDeck({ addCardToDeck: this.card.id }));
  }

  reduceCardCount(event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.store.dispatch(removeCardFromDeck({ cardId: this.card.id }));
  }

  transformDCost(dCost: string): string {
    return dCost.split(' ')[0];
  }

  showCardDetails() {
    this.viewCard = this.cards.find((card) => card.id === this.card.id)!;
    this.viewCardDialog = true;
  }
}
