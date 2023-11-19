import { AsyncPipe, DatePipe, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BehaviorSubject, first } from 'rxjs';
import { DigimonCard, IDeck, ITournamentDeck } from '../../../models';
import { ColorMap } from '../../../models/maps/color.map';
import { setDeckImage } from '../../functions/digimon-card.functions';
import { ImageService } from '../../services/image.service';
import {
  selectAllCards,
  selectDigimonCardMap,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-container',
  template: `
    <div
      class="surface-card relative h-32 w-full cursor-pointer border border-black"
      defaultImage="assets/images/digimon-card-back.webp"
      [lazyLoad]="
        (cardImageSubject$ | async) ??
        '../../../assets/images/digimon-card-back.webp'
      "
      [ngStyle]="{
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-position-y': '25%'
      }">
      <div
        [ngStyle]="{ background: colorMap.get(deck.color.name) }"
        class="text-shadow-white-xs relative left-[-5px] top-[10px] w-24 border border-black bg-opacity-80 text-center text-xs font-bold uppercase">
        <span *ngIf="mode !== 'Tournament'" class="mr-1">{{
          deck.tags ? deck!.tags[0].name : null
        }}</span>
        <span *ngIf="mode === 'Tournament'" class="mr-1">{{
          getTournamentDeck(deck).format
        }}</span>
      </div>

      <div *ngIf="isIllegal()" class="absolute right-[35px] top-[5px]">
        <span class="text-shadow text-4xl text-[#ef4444]">!</span>
      </div>

      <div
        class="absolute bottom-0 h-16 w-full justify-center bg-black bg-opacity-80">
        <div class="my-auto flex w-full flex-col p-1">
          <div class="text-shadow truncate font-bold text-[#e2e4e6]">
            {{ deck.title }}
          </div>
          <div class="text-shadow min-h-[16px] truncate text-xs text-[#e2e4e6]">
            {{ deck.description }}
          </div>

          <div
            *ngIf="mode !== 'Tournament'; else tournament"
            class="text-shadow flex w-full flex-row text-xs text-[#e2e4e6]">
            <div *ngIf="mode === 'Community'" class="ml-1 font-bold">
              {{ deck.user }}
            </div>
            <div class="ml-auto font-bold">
              {{ deck.date | date : 'dd.MM.YY' }}
            </div>
          </div>
          <ng-template #tournament>
            <div
              class="text-shadow grid w-full grid-cols-5 text-xs text-[#e2e4e6]">
              <div class="ml-1 font-bold">
                {{ placementString(getTournamentDeck(deck).placement) }}
              </div>
              <div class="col-span-2 ml-1 truncate font-bold">
                {{ getTournamentDeck(deck).user }}
              </div>
              <div class="mx-auto font-bold">
                {{ getTournamentDeck(deck).size }}
              </div>
              <div class="ml-auto font-bold">
                {{ getTournamentDeck(deck).date | date : 'dd.MM.YY' }}
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LazyLoadImageModule, NgStyle, NgIf, DatePipe, AsyncPipe],
  providers: [ImageService],
})
export class DeckContainerComponent implements OnInit {
  @Input() deck: IDeck | ITournamentDeck;
  @Input() mode = 'Basic';
  cardImageSubject$ = new BehaviorSubject<string>(
    '../../../assets/images/digimon-card-back.webp'
  );

  digimonCardMap$ = this.store.select(selectDigimonCardMap);

  colorMap = ColorMap;

  allCards: DigimonCard[] = [];

  constructor(private store: Store, private imageService: ImageService) {}

  ngOnInit() {
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((cards) => {
        this.allCards = cards;
      });
    this.digimonCardMap$
      .pipe(first())
      .subscribe((digimonCardMap) => this.setCardImage(digimonCardMap));
  }

  setCardImage(digimonCardMap: Map<string, DigimonCard>) {
    let imagePath = '';
    // If there is an ImageCardId set it
    if (this.deck.imageCardId) {
      const imageCard = digimonCardMap.get(this.deck.imageCardId);
      imagePath =
        imageCard?.cardImage ?? '../../../assets/images/digimon-card-back.webp';
    } else if (this.deck.cards && this.deck.cards.length < 0) {
      // If there are cards in the deck, set it to the first card
      const imageCard = setDeckImage(this.deck, this.allCards); // Replace setDeckImage with the appropriate function
      imagePath = imageCard?.cardImage ?? '';
    }

    this.imageService
      .checkImagePath(imagePath)
      .pipe(first())
      .subscribe((imagePath: string) => this.cardImageSubject$.next(imagePath));
  }

  getTournamentDeck(deck: IDeck | ITournamentDeck): ITournamentDeck {
    return deck as ITournamentDeck;
  }

  isIllegal(): boolean {
    return this.deck.tags
      ? !!this.deck.tags.find((tag) => tag.name === 'Illegal')
      : false;
  }

  placementString(placement: number): string {
    if (placement === 1) {
      return '1st';
    } else if (placement === 2) {
      return '2nd';
    } else if (placement === 3) {
      return '3th';
    }
    return placement + 'th';
  }
}
