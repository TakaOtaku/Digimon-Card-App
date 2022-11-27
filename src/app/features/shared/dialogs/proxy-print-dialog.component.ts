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
import { ICard, IDeck } from '../../../../models';
import { compareIDs } from '../../../functions/digimon-card.functions';
import { selectAllCards } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-proxy-print-dialog',
  template: `
    <div>
      <canvas
        #HDCanvas
        id="HDCanvas"
        width="2480"
        height="3508"
        class="hidden"
      ></canvas>
    </div>

    <div class="mt-5 flex w-full justify-end">
      <button pButton class="ml-5" (click)="downloadImage()">
        Download Image
      </button>
    </div>
  `,
})
export class ProxyPrintDialogComponent implements OnInit, OnDestroy {
  @Input() show: boolean = false;
  @Input() deck: IDeck;

  @Output() onClose = new EventEmitter<boolean>();

  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.digimonCards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.digimonCards = cards));

    this.generateCanvas(
      document.getElementById('HDCanvas')! as HTMLCanvasElement
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private generateCanvas(canvas: HTMLCanvasElement): void {
    let loadedCount = 0;
    let imgs: any[] = [];
    let scale = canvas ? 3 : 1;

    const getContext = () => {
      return canvas.getContext('2d')!;
    };

    const loadImage = (url: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`load ${url} fail`));
        img.src = url;
      });
    };

    const background = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(
          img,
          myOptions.x * scale,
          myOptions.y * scale,
          myOptions.sw * scale,
          myOptions.sh * scale
        );

        imgs = this.getImages();

        imgs.forEach(depict);
      });
    };

    const depict = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(
          img,
          myOptions.x * scale,
          myOptions.y * scale,
          myOptions.sw * scale,
          myOptions.sh * scale
        );
        loadedCount += 1;
      });
    };

    background({
      uri: 'assets/images/image-export/bg-share_white.jpg',
      x: 0,
      y: 0,
      sw: 2480,
      sh: 3508,
    });
  }

  private getImages(): any[] {
    let imgs: any[] = [];

    let y = 50;
    let x = 10;

    let cardCount = this.deck.cards.length;
    if (cardCount <= 9) {
      y += 95;
    } else if (cardCount <= 18) {
      y += 47;
    }

    let cardsInCurrentRow = 1;
    const cardsPerRow = 9;
    this.deck.cards.forEach((card) => {
      const fullCard = this.digimonCards.find((search: ICard) =>
        compareIDs(card.id, search.id)
      );
      imgs.push({
        uri: fullCard!.cardImage,
        x: x,
        y: y,
        sw: 64,
        sh: 88,
      });
      if (cardsInCurrentRow >= cardsPerRow) {
        y += 95;
        x = 10;
        cardsInCurrentRow = 1;
      } else {
        x += 70;
        cardsInCurrentRow += 1;
      }
    });
    return imgs;
  }

  downloadImage() {
    const canvas = document.getElementById('HDCanvas')! as HTMLCanvasElement;
    const img = canvas
      .toDataURL('image/png', 1.0)
      .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'proxy-sheet.png';
    link.href = img;
    link.click();
  }
}
