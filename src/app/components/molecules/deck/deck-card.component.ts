import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ColorMap, ICard, IDeckCard } from '../../../../models';

@Component({
  selector: 'digimon-deck-card',
  template: `
    <ng-template *ngIf="fullCards" [ngTemplateOutlet]="fullCard"></ng-template>
    <ng-template
      *ngIf="!fullCards"
      [ngTemplateOutlet]="smallCard"
    ></ng-template>

    <ng-template #fullCard>
      <div class="relative m-1 flex flex-col">
        <div
          class="group absolute z-[101] flex h-full w-full flex-col rounded xl:opacity-0 xl:hover:opacity-100"
          (click)="showCardDetails()"
          (contextmenu)="showCardDetails()"
        >
          <div
            class="hidden h-1/2 w-full rounded bg-sky-700 bg-opacity-30 xl:block"
          >
            <div class="absolute top-2">
              <button
                *ngIf="edit"
                (click)="addCardCount($event)"
                type="button"
                class="z-[101] mx-auto flex hidden h-8 w-8 rounded border border-black bg-sky-700 group-hover:block"
                [ngClass]="{
                  'btn-center': bigCards,
                  'btn-center-2': !bigCards
                }"
              >
                <span class="text-shadow text-2xl font-black text-white">
                  +
                </span>
              </button>
            </div>
          </div>
          <div
            class="hidden h-1/2 w-full rounded bg-red-500 bg-opacity-30 xl:block"
          >
            <div class="absolute bottom-2">
              <button
                *ngIf="edit"
                (click)="reduceCardCount($event)"
                type="button"
                class="z-[101] mx-auto flex hidden h-8 w-8 rounded border border-black bg-sky-700 group-hover:block"
                [ngClass]="{
                  'btn-center': bigCards,
                  'btn-center-2': !bigCards
                }"
              >
                <span class="text-shadow text-2xl font-black text-white">
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
          class="group z-50 rounded border-2 border-black"
          [ngClass]="{
            'm-auto': fullCards,
            'w-[35vmin] md:w-[16vmin] md:w-[13vmin] lg:w-[10vmin]': !bigCards
          }"
        />

        <div class="flex h-1/2 w-full flex-row rounded xl:hidden">
          <button
            *ngIf="edit"
            (click)="addCardCount($event)"
            type="button"
            class="z-[101] flex h-8 w-1/2 rounded-l border border-black bg-sky-700"
          >
            <span class="text-shadow mx-auto text-2xl font-black text-white">
              +
            </span>
          </button>

          <button
            *ngIf="edit"
            (click)="reduceCardCount($event)"
            type="button"
            class="z-[101] flex h-8 w-1/2 rounded-r border border-black bg-sky-700"
          >
            <span class="text-shadow mx-auto text-2xl font-black text-white">
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
          class="text-red text-black-outline missing absolute z-[100] text-6xl font-bold"
        >
          {{
            (cardHave ?? 0) - card.count > 0 ? 0 : (cardHave ?? 0) - card.count
          }}
        </p>
      </div>
    </ng-template>

    <ng-template #smallCard>
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
            class="text-shadow h-full self-center rounded-full bg-sky-700 px-3 font-semibold leading-6 text-white"
          >
            {{ completeCard.playCost }}
          </div>
          <div
            *ngIf="completeCard.cardType === 'Digimon'"
            class="text-shadow self-center px-3 font-semibold text-white"
          >
            {{ transformDCost(completeCard.digivolveCost1) }}
          </div>
          <div
            *ngIf="completeCard.cardType === 'Tamer'"
            class="text-shadow self-center px-3 font-semibold text-white"
          >
            Tamer
          </div>
          <div
            *ngIf="completeCard.cardType === 'Option'"
            class="text-shadow self-center px-3 font-semibold text-white"
          >
            Option
          </div>
          <div
            class="z-10 h-full self-center bg-black px-1 font-bold leading-6 text-white"
          >
            {{ completeCard.cardLv }}
          </div>
          <div class="bottom-top-split"></div>
          <div
            class="text-shadow text-md self-center truncate text-center font-semibold text-white"
          >
            {{ completeCard.name }}
          </div>
          <div class="top-bottom-split ml-auto"></div>
          <div
            class="h-full self-center truncate bg-black px-1 text-xs font-bold leading-6 text-white"
          >
            {{ completeCard.cardNumber }}
          </div>
        </div>
      </div>
    </ng-template>

    <p-dialog
      [(visible)]="viewCardDialog"
      [baseZIndex]="10000"
      [showHeader]="false"
      class="overflow-x-hidden"
      (close)="viewCardDialog = false"
    >
      <digimon-view-card-dialog
        (onClose)="viewCardDialog = false"
        [card]="viewCard"
      ></digimon-view-card-dialog>
    </p-dialog>
  `,
  styles: [
    `
      .btn-center {
        -webkit-transform: translateX(100%);
        -moz-transform: translateX(100%);
        transform: translateX(100%);
      }

      .btn-center-2 {
        -webkit-transform: translateX(75%);
        -moz-transform: translateX(75%);
        transform: translateX(75%);
      }

      .missing {
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        top: 40px;
        text-align: center;
      }

      p-inputNumber {
        ::ng-deep .p-inputnumber-button {
          padding: 0.1rem 0;
        }
      }

      @media (min-width: 768px) {
        p-inputNumber {
          ::ng-deep .p-inputnumber-button {
            padding: 0.5rem 0;
          }
        }
      }

      .egg {
        width: 14px;
        height: 18px;
        border-radius: 50%/60% 60% 40% 40%;
        background-color: white;
      }

      .top-bottom-split {
        width: 0;
        height: 0;
        border-top: 27px solid black;
        border-left: 15px solid transparent;
      }

      .bottom-top-split {
        width: 0;
        height: 0;
        border-right: 15px solid transparent;
        border-bottom: 27px solid black;
      }
    `,
  ],
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
