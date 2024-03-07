import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImgFallbackDirective } from 'src/app/directives/ImgFallback.directive';
import { DigimonCard, dummyCard } from '../../../models';
import { SaveStore } from '../../store/save.store';

@Component({
  selector: 'digimon-card-image',
  template: `
    <div class="absolute top-1 z-10 grid w-full grid-cols-5 gap-0">
      <div></div>
      @if (
        card.version.includes('Foil') ||
        card.version.includes('Alternative') ||
        card.version.includes('Textured')
      ) {
        <img
          [src]="
            aa.get(this.card.color) ??
            'assets/images/banner/ico_card_detail_multi.png'
          "
          alt="AA-Banner"
          class="col-span-3 w-full" />
      } @else if (card.version.includes('Reprint')) {
        <img
          [src]="
            reprint.get(this.card.color) ??
            'assets/images/banner/reprint_multi.png'
          "
          alt="Reprint-Banner"
          class="col-span-3 w-full" />
      } @else if (
        card.version.includes('Stamp') || card.version.includes('Pre-Release')
      ) {
        <img
          [src]="
            stamped.get(this.card.color) ??
            'assets/images/banner/stamped_multi.png'
          "
          alt="Stamped-Banner"
          class="col-span-3 w-full" />
      }
    </div>

    <img
      [digimonImgFallback]="card.cardImage"
      [ngClass]="{ grayscale: setGrayScale() }"
      [ngStyle]="{ border: cardBorder, 'border-radius': cardRadius }"
      alt="{{ card.cardNumber + ' ' + card.name }}"
      class="m-auto aspect-auto" />
  `,
  styleUrls: ['./card-image.component.scss'],
  standalone: true,
  imports: [NgIf, LazyLoadImageModule, NgClass, NgStyle, ImgFallbackDirective],
})
export class CardImageComponent {
  @Input() card: DigimonCard = JSON.parse(JSON.stringify(dummyCard));
  @Input() count = 0;

  saveStore = inject(SaveStore);

  collectionMinimum = this.saveStore.collectionMinimum;
  aaCollectionMinimum = this.saveStore.aaCollectionMinimum;
  collectionMode = this.saveStore.collectionMode;

  cardBorder = '2px solid black';
  cardRadius = '5px';

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

  setGrayScale(): boolean | undefined {
    if (this.card.version !== 'Normal') {
      return this.count < this.aaCollectionMinimum() && this.collectionMode();
    }
    return this.count < this.collectionMinimum() && this.collectionMode();
  }
}
