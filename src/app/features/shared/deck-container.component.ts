import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ICard, IDeck, ITournamentDeck } from '../../../models';
import { ColorMap } from '../../../models/maps/color.map';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { selectAllCards } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-container',
  template: `
    <div
      class="surface-card relative h-32 w-full cursor-pointer border border-black"
      defaultImage="assets/images/digimon-card-back.webp"
      [lazyLoad]="getCardImage()"
      [ngStyle]="{
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-position-y': '25%'
      }"
    >
      <div
        [ngStyle]="{ background: colorMap.get(deck.color.name) }"
        class="text-shadow-white-xs relative top-[10px] left-[-5px] w-24 border border-black bg-opacity-80 text-center text-xs font-bold uppercase"
      >
        <span *ngIf="mode !== 'Tournament'" class="mr-1">{{
          deck.tags ? deck!.tags![0].name : null
        }}</span>
        <span *ngIf="mode === 'Tournament'" class="mr-1">{{
          getTournamentDeck(deck).format
        }}</span>
      </div>

      <div *ngIf="isIllegal()" class="absolute top-[5px] right-[35px]">
        <span class="text-shadow text-4xl text-[#ef4444]">!</span>
      </div>

      <div
        *ngIf="mode !== 'Basic'"
        class="absolute top-[5px] right-[5px]"
        (click)="changeLike($event)"
      >
        <div class="relative">
          <i
            [ngStyle]="isLiked() ? { color: '#ef4444' } : { color: '#64748b' }"
            class="fa-solid fa-heart h-8 w-8"
          ></i>
          <div
            style="transform: translate(-50%,-50%);"
            class="absolute left-[50%] top-[40%]  text-xs font-bold text-white"
          >
            {{ getDeckLikes() }}
          </div>
        </div>
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
            *ngIf="mode !== 'Tournament'; else tournament"
            class="text-shadow flex w-full flex-row text-xs text-[#e2e4e6]"
          >
            <div *ngIf="mode === 'Community'" class="ml-1 font-bold">
              {{ deck.user }}
            </div>
            <div class="ml-auto font-bold">
              {{ deck.date | date: 'dd.MM.YY' }}
            </div>
          </div>
          <ng-template #tournament>
            <div
              class="text-shadow grid w-full grid-cols-5 text-xs text-[#e2e4e6]"
            >
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
                {{ getTournamentDeck(deck).date | date: 'dd.MM.YY' }}
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckContainerComponent implements OnInit {
  @Input() deck: IDeck | ITournamentDeck;
  @Input() mode = 'Basic';

  colorMap = ColorMap;

  private allCards: ICard[];

  constructor(
    private store: Store,
    private authService: AuthService,
    private backendService: DigimonBackendService
  ) {}

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
          ?.cardImage ?? '../../../assets/images/cards/eng/BT1-001.webp'
      );
    }

    const card = this.allCards.find(
      (card) => card.id === this.deck.cards[0].id
    );

    return card
      ? card.cardImage
      : '../../../assets/images/cards/eng/BT1-001.webp';
  }

  changeLike(event: any) {
    event.stopPropagation();

    const userId = this.authService.userData?.uid;
    if (!userId) {
      return;
    }

    if (this.isLiked()) {
      this.deck.likes = this.deck.likes.filter((like) => userId !== like);
      this.backendService.updateDeck(this.deck).pipe(first()).subscribe();
    } else {
      this.deck.likes.push(userId);
      this.backendService.updateDeck(this.deck).pipe(first()).subscribe();
    }
  }

  isLiked(): boolean {
    if (!this.deck.likes || this.deck.likes.length === 0) {
      return false;
    }
    const foundLike = this.deck.likes.find(
      (likeId) => this.authService.userData?.uid === likeId
    );
    return !!foundLike;
  }

  getDeckLikes(): number {
    if (!this.deck.likes) {
      return 0;
    }
    return this.deck.likes.length;
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
