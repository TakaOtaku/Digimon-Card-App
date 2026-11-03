import { AsyncPipe, DatePipe, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BehaviorSubject, first } from 'rxjs';
import { ColorMap, IDeck } from '../../../models';
import { setDeckImage } from '../../functions';
import { ImageService } from '../../services/image.service';
import { DigimonCardStore } from '../../store/digimon-card.store';

@Component({
  selector: 'digimon-deck-container',
  template: `
    <div class="relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-ink-1 hover:border-accent">
      <div
        class="relative h-32 w-full"
        defaultImage="assets/images/digimon-card-back.webp"
        [lazyLoad]="(cardImageSubject$ | async) ?? '../../../assets/images/digimon-card-back.webp'"
        [ngStyle]="{
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'background-position': 'center 25%',
        }">
        @if (getTags(deck); as tag) {
          <span class="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-xs font-semibold text-fg">{{ tag }}</span>
        }
        <span *ngIf="isIllegal()" class="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">Illegal</span>
      </div>

      <div class="flex flex-col gap-1 p-3">
        <span class="truncate font-display text-lg font-semibold text-fg">{{ deck.title || 'Untitled deck' }}</span>
        <span class="min-h-[1rem] truncate text-xs text-muted">{{ deck.description }}</span>
        <span class="flex items-center gap-2 text-xs text-muted">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" [ngStyle]="{ background: colorMap.get(deck?.color?.name ?? '') }"></span>
          <span *ngIf="mode === 'Community'" class="truncate">{{ deck.user }}</span>
          <span class="ml-auto font-mono">{{ deck.date | date: 'dd.MM.yy' }}</span>
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LazyLoadImageModule, NgStyle, NgIf, DatePipe, AsyncPipe],
  providers: [ImageService],
})
export class DeckContainerComponent implements OnChanges {
  @Input() deck: IDeck;
  @Input() mode = 'Basic';
  cardImageSubject$ = new BehaviorSubject<string>('../../../assets/images/digimon-card-back.webp');

  colorMap = ColorMap;

  private digimonCardStore = inject(DigimonCardStore);

  constructor(private imageService: ImageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setCardImage();
  }

  setCardImage() {
    const digimonCardMap = this.digimonCardStore.cardsMap();
    let imagePath = '';
    // If there is a valid ImageCardId (not the default BT1-001), use it
    if (this.deck.imageCardId && this.deck.imageCardId !== 'BT1-001') {
      const imageCard = digimonCardMap.get(this.deck.imageCardId);
      imagePath = imageCard?.cardImage ?? '../../../assets/images/digimon-card-back.webp';
    } else if (this.deck.cards && this.deck.cards.length > 0) {
      // Compute image from the deck's cards
      const imageCard = setDeckImage(this.deck, this.digimonCardStore.cards());
      imagePath = imageCard?.cardImage ?? '';
    }

    this.imageService
      .checkImagePath(imagePath)
      .pipe(first())
      .subscribe((imagePath: string) => this.cardImageSubject$.next(imagePath));
  }

  isIllegal(): boolean {
    return this.deck.tags ? !!this.deck.tags.find((tag) => tag.name === 'Illegal') : false;
  }

  getTags(deck: IDeck): string {
    if (deck.tags && deck.tags.length > 0) {
      // Prioritize showing set tags (BT, EX, ST) over other tags
      const setTag = deck.tags.find(tag =>
        tag.name.match(/^(BT|EX|ST|RB)\d+$/) || tag.name === 'LM' || tag.name === 'P'
      );

      if (setTag) {
        return setTag.name;
      }

      // Fall back to first tag if no set tag found
      return deck.tags[0] ? deck.tags[0].name : '';
    }
    return '';
  }
}
