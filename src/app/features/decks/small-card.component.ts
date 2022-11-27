import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard, IDeckCard } from '../../../models';
import { ColorMap } from '../../../models/maps/color.map';

@Component({
  selector: 'digimon-small-card',
  template: `
    <div class="align-center my-1 ml-2 inline-flex h-[30px]">
      <button
        *ngIf="edit"
        pButton
        pRipple
        type="button"
        icon="pi pi-plus"
        class="p-button-outlined p-button-sm"
        (click)="addCardCount()"
      ></button>
      <span class="primary-color font-bolder px-2 text-3xl"
        >x{{ card.count }}</span
      >
      <button
        *ngIf="edit"
        pButton
        pRipple
        type="button"
        icon="pi pi-minus"
        class="p-button-outlined p-button-sm"
        (click)="reduceCardCount()"
      ></button>

      <div
        class="ml-1 inline-flex w-[300px] min-w-[300px] max-w-[300px] rounded-l-2xl border-2 border-black text-xs"
        (click)="showCardDetails()"
        (contextmenu)="showCardDetails()"
        [ngStyle]="{ 'background-color': colorMap.get(completeCard.color) }"
      >
        <div *ngIf="completeCard.cardLv === 'Lv.2'" class="px-5">
          <div class="egg mt-[4px]"></div>
        </div>
        <div
          *ngIf="completeCard.cardLv !== 'Lv.2'"
          class="text-shadow h-full self-center rounded-full bg-sky-700 px-3 font-semibold leading-6 text-[#e2e4e6]"
        >
          {{ completeCard.playCost }}
        </div>
        <div
          *ngIf="completeCard.cardType === 'Digimon'"
          class="text-shadow self-center px-3 font-semibold text-[#e2e4e6]"
        >
          {{ transformDCost(completeCard.digivolveCost1) }}
        </div>
        <div
          *ngIf="completeCard.cardType === 'Tamer'"
          class="text-shadow self-center px-3 font-semibold text-[#e2e4e6]"
        >
          Tamer
        </div>
        <div
          *ngIf="completeCard.cardType === 'Option'"
          class="text-shadow self-center px-3 font-semibold text-[#e2e4e6]"
        >
          Option
        </div>
        <div
          class="z-10 h-full self-center bg-black px-1 font-bold leading-6 text-[#e2e4e6]"
        >
          {{ completeCard.cardLv }}
        </div>
        <div class="bottom-top-split"></div>
        <div
          class="text-shadow text-md self-center truncate text-center font-semibold text-[#e2e4e6]"
        >
          {{ completeCard.name }}
        </div>
        <div class="top-bottom-split ml-auto"></div>
        <div
          class="h-full self-center truncate bg-black px-1 text-xs font-bold leading-6 text-[#e2e4e6]"
        >
          {{ completeCard.cardNumber }}
        </div>
      </div>
    </div>
  `,
})
export class SmallCardComponent implements OnInit {
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
    this.viewCardDialog = true;
  }
}
