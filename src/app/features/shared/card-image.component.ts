import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../assets/cardlists/eng/english';
import { ICard } from '../../../models';
import { addCardToDeck, changeCardCount } from '../../store/digimon.actions';
import {
  selectCollectionMinimum,
  selectDeck,
  selectSettings,
} from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-card-image',
  template: `
  <div class="absolute top-1 z-10 grid w-full grid-cols-5 gap-0">
    <div></div>
    <img
      *ngIf="card.version === 'AA' || card.version === 'Foil'"
      [src]="
        aa.get(this.card.color) ??
        'assets/images/banner/ico_card_detail_multi.png'
      "
      alt="AA-Banner"
      class="col-span-3 w-full"
    />
    <img
      *ngIf="card.version === 'Reprint'"
      [src]="
        reprint.get(this.card.color) ??
        'assets/images/banner/reprint_multi.png'
      "
      alt="Reprint-Banner"
      class="col-span-3 w-full"
    />
    <img
      *ngIf="card.version === 'Stamp' || card.version === 'Pre-Release'"
      [src]="
        stamped.get(this.card.color) ??
        'assets/images/banner/stamped_multi.png'
      "
      alt="Stamped-Banner"
      class="col-span-3 w-full"
    />
  </div>

  <img
    [lazyLoad]="card.cardImage"
    [ngClass]="{ grayscale: setGrayScale() }"
    [ngStyle]="{ border: cardBorder, 'border-radius': cardRadius }"
    alt="{{ card.cardNumber + ' ' + card.name }}"
    onerror="this.onerror=null; this.src='assets/images/card_placeholder.png'"
    class="m-auto"
    defaultImage="assets/images/digimon-card-back.webp"
  />
  `,
  styleUrls: ['./card-image.component.scss'],
})
export class CardImageComponent {
  @Input() card: ICard = englishCards[0];

  aa = new Map<string, string>([
    ['Red', 'assets/images/banner/ico_card_detail_red.png'],
    ['Blue', 'assets/images/banner/ico_card_detail_blue.png'],
    ['Yellow', 'assets/images/banner/ico_card_detail_yellow.png'],
    ['Green', 'assets/images/banner/ico_card_detail_green.png'],
    ['Black', 'assets/images/banner/ico_card_detail_black.png'],
    ['Purple', 'assets/images/banner/ico_card_detail_purple.png'],
    ['White', 'assets/images/banner/ico_card_detail_white.png'],
    ['Multi', 'assets/images/banner/ico_card_detail_multi.png'],
  ]);

  reprint = new Map<string, string>([
    ['Red', 'assets/images/banner/reprint_red.png'],
    ['Blue', 'assets/images/banner/reprint_blue.png'],
    ['Yellow', 'assets/images/banner/reprint_yellow.png'],
    ['Green', 'assets/images/banner/reprint_green.png'],
    ['Black', 'assets/images/banner/reprint_black.png'],
    ['Purple', 'assets/images/banner/reprint_purple.png'],
    ['White', 'assets/images/banner/reprint_white.png'],
    ['Multi', 'assets/images/banner/reprint_multi.png'],
  ]);

  stamped = new Map<string, string>([
    ['Red', 'assets/images/banner/stamped_red.png'],
    ['Blue', 'assets/images/banner/stamped_blue.png'],
    ['Yellow', 'assets/images/banner/stamped_yellow.png'],
    ['Green', 'assets/images/banner/stamped_green.png'],
    ['Black', 'assets/images/banner/stamped_black.png'],
    ['Purple', 'assets/images/banner/stamped_purple.png'],
    ['White', 'assets/images/banner/stamped_white.png'],
    ['Multi', 'assets/images/banner/stamped_multi.png'],
  ]);
}
