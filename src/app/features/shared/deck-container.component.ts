import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { first } from "rxjs";
import { ICard, IDeck } from "../../../models";
import { ColorMap } from "../../../models/maps/color.map";
import { selectAllCards } from "../../store/digimon.selectors";

@Component({
  selector: "digimon-deck-container",
  template: `
    <div
      class="surface-card relative h-32 w-full border border-black"
      [ngStyle]="{
        background: 'url(' + getCardImage() + ') no-repeat center',
        'background-position-y': '25%'
      }"
    >
      <div
        [ngStyle]="{ background: colorMap.get(deck.color.name) }"
        class="text-shadow-white-xs relative top-[10px] left-[-5px] w-24 border border-black bg-opacity-80 text-center text-xs font-bold uppercase"
      >
        <span class="mr-1">{{ deck!.tags![0].name }}</span>
      </div>

      <div
        class="absolute bottom-0 h-16 w-full justify-center bg-black bg-opacity-80"
      >
        <div class="my-auto flex w-full flex-col p-1">
          <div class="text-shadow truncate font-bold text-[#e2e4e6]">
            {{ deck.title }}
          </div>
          <div class="text-shadow min-h-[16px] truncate text-xs text-[#e2e4e6]">
            {{ deck.description }}
          </div>
          <div
            class="text-shadow flex w-full flex-row truncate text-xs text-[#e2e4e6]"
          >
            <div *ngFor="let tag of deck.tags" class="mr-1">{{ tag.name }}</div>
            <div *ngIf="community" class="ml-1 font-bold">{{ deck.user }}</div>
            <div class="ml-auto font-bold">
              {{ deck.date | date: 'dd.MM.YYYY' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeckContainerComponent implements OnInit {
  @Input() deck: IDeck;
  @Input() community = false;

  colorMap = ColorMap;

  private allCards: ICard[];

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((allCards) => {
        this.allCards = allCards;
      });
  }

  getCardImage(): string {
    if (this.deck.imageCardId) {
      return (
        this.allCards.find((card) => card.id === this.deck.imageCardId)
          ?.cardImage ?? "../../../assets/images/cards/eng/BT1-001.webp"
      );
    }

    const card = this.allCards.find(
      (card) => card.id === this.deck.cards[0].id
    );

    return card
      ? card.cardImage
      : "../../../assets/images/cards/eng/BT1-001.webp";
  }
}
