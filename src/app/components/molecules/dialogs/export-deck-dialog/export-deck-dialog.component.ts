import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
import { ICard, IDeck } from '../../../../../models';
import {
  compareIDs,
  formatId,
  getPNG,
  mapToDeckCards,
} from '../../../../functions/digimon-card.functions';
import { selectAllCards } from '../../../../store/digimon.selectors';
import { ColorsWithoutMulti } from '../../../organisms/filter/filter-side-box/filterData';

@Component({
  selector: 'digimon-export-deck-dialog',
  templateUrl: './export-deck-dialog.component.html',
  styleUrls: ['./export-deck-dialog.component.scss'],
})
export class ExportDeckDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() deck: IDeck;

  @Output() onClose = new EventEmitter<boolean>();

  exportList = ['TEXT', 'TTS', 'IMAGE'];
  exportType = 'TEXT';
  deckText = '';

  colors = ColorsWithoutMulti;
  selectedColor = 'Red';

  private digimonCards$ = this.store.select(selectAllCards);
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setExportTypeText();
    this.exportType = 'TEXT';
  }

  ngOnInit(): void {
    this.digimonCards$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.digimonCards = cards));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  colorChecked(color: string): boolean {
    return this.selectedColor === color;
  }

  changeExportType(event: any) {
    switch (event.option) {
      default:
      case 'TEXT':
        this.setExportTypeText();
        break;
      case 'TTS':
        this.setExportTypeTTS();
        break;
      case 'IMAGE':
        this.setExportTypeIMAGE();
        break;
    }
  }

  private setExportTypeText(): void {
    this.deckText = '// Digimon DeckList\n\n';
    this.deck.cards.forEach((card) => {
      const dc = this.digimonCards.find((dc) => compareIDs(dc.id, card.id));
      this.deckText += `${card.id.replace('ST0', 'ST')} ${dc?.name} ${
        card.count
      }\n`;
    });
  }

  private setExportTypeTTS(): void {
    this.deckText = '["Exported from https://digimoncard.app",';
    const cards = mapToDeckCards(this.deck.cards, this.digimonCards);
    cards.forEach((card) => {
      for (let i = 0; i < card.count; i++) {
        this.deckText += `"${formatId(card.cardNumber)}",`;
      }
    });
    this.deckText = this.deckText.substring(0, this.deckText.length - 1);
    this.deckText += ']';
  }

  exportDeckToFile(): void {
    let blob = new Blob([this.deckText], { type: 'text/txt' });
    saveAs(blob, this.deck.title + '.txt');
  }

  setExportTypeIMAGE(): void {
    this.generateCanvas();
    this.generateCanvas(
      document.getElementById('HDCanvas')! as HTMLCanvasElement
    );
    this.generateTTS(document.getElementById('TTS')! as HTMLCanvasElement);
  }

  private generateCanvas(canvas?: HTMLCanvasElement): void {
    let loadedCount = 0;
    let imgs: any[] = [];
    let scale = canvas ? 3 : 1;

    const getContext = () => {
      if (canvas) {
        return canvas.getContext('2d')!;
      }
      return (
        document.getElementById('Canvas')! as HTMLCanvasElement
      ).getContext('2d')!;
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
        if (loadedCount === imgs.length) {
          this.drawCount(ctx, scale);
        }
      });
    };

    const BackgroundMap = new Map<string, string>([
      ['Red', 'assets/images/image-export/bg-share_red.jpg'],
      ['Blue', 'assets/images/image-export/bg-share_blue.jpg'],
      ['Yellow', 'assets/images/image-export/bg-share_yellow.jpg'],
      ['Green', 'assets/images/image-export/bg-share_green.jpg'],
      ['Black', 'assets/images/image-export/bg-share_black.jpg'],
      ['Purple', 'assets/images/image-export/bg-share_purple.jpg'],
      ['White', 'assets/images/image-export/bg-share_white.jpg'],
    ]);

    background({
      uri: BackgroundMap.get(this.selectedColor),
      x: 0,
      y: 0,
      sw: 640,
      sh: 360,
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
        uri: getPNG(fullCard!.cardImage),
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

  private generateTTS(canvas?: HTMLCanvasElement): void {
    let loadedCount = 0;
    let imgs: any[] = [];

    const getContext = () => {
      if (canvas) {
        return canvas.getContext('2d')!;
      }
      return (
        document.getElementById('Canvas')! as HTMLCanvasElement
      ).getContext('2d')!;
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
          myOptions.x,
          myOptions.y,
          myOptions.sw,
          myOptions.sh
        );

        imgs = this.getImagesAll();

        imgs.forEach(depict);
      });
    };

    const depict = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(
          img,
          myOptions.x,
          myOptions.y,
          myOptions.sw,
          myOptions.sh
        );
        loadedCount += 1;
        if (loadedCount === imgs.length) {
          this.drawCount(ctx, 1);
        }
      });
    };

    background({
      uri: 'assets/images/image-export/TTS.jpg',
      x: 0,
      y: 0,
      sw: 7440,
      sh: 6240,
    });
  }

  private getImagesAll(): any[] {
    let imgs: any[] = [];

    let y = 0;
    let x = 0;

    let cardsInCurrentRow = 1;
    const cardsPerRow = 10;
    this.deck.cards.forEach((card) => {
      const fullCard = this.digimonCards.find((search: ICard) =>
        compareIDs(card.id, search.id)
      );
      for (let i = 1; i <= card.count; i++) {
        imgs.push({
          uri: getPNG(fullCard!.cardImage),
          x: x,
          y: y,
          sw: 744,
          sh: 1040,
        });
        if (cardsInCurrentRow >= cardsPerRow) {
          y += 1040;
          x = 0;
          cardsInCurrentRow = 1;
        } else {
          x += 744;
          cardsInCurrentRow += 1;
        }
      }
    });
    return imgs;
  }

  private static writeText(
    ctx: any,
    text: string,
    x: number,
    y: number,
    scale: number,
    fontSize?: number,
    fillStyle?: string
  ) {
    ctx.font = fontSize ? fontSize * scale + 'px Roboto' : '15px Roboto';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2 * scale;
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.strokeText(text, x * scale, y * scale);
    ctx.shadowBlur = 0;
    ctx.fillStyle = fillStyle ? fillStyle : '#f97316';
    ctx.textAlign = 'center';
    ctx.fillText(text, x * scale, y * scale);
  }

  private drawCount(ctx: any, scale: number) {
    let y = 50 + 82;
    let x = 10 + 50;

    let cardCount = this.deck.cards.length;
    if (cardCount <= 9) {
      y += 95;
    } else if (cardCount <= 18) {
      y += 47;
    }

    let cardsInCurrentRow = 1;
    const cardsPerRow = 9;
    this.deck.cards.forEach((card) => {
      ExportDeckDialogComponent.writeText(
        ctx,
        'x',
        x - 20,
        y,
        scale,
        30,
        '#0369a1'
      );
      ExportDeckDialogComponent.writeText(
        ctx,
        card.count.toString(),
        x,
        y,
        scale,
        30
      );

      if (cardsInCurrentRow >= cardsPerRow) {
        y += 95;
        x = 10 + 46;
        cardsInCurrentRow = 1;
      } else {
        x += 70;
        cardsInCurrentRow += 1;
      }
    });
  }

  downloadImageTTS() {
    const canvas = document.getElementById('TTS')! as HTMLCanvasElement;
    const img = canvas
      .toDataURL('image/jpg', 0.7)
      .replace('image/jpg', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'deck.png';
    link.href = img;
    link.click();
  }

  downloadImage() {
    const canvas = document.getElementById('HDCanvas')! as HTMLCanvasElement;
    const img = canvas
      .toDataURL('image/png', 1.0)
      .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'deck.png';
    link.href = img;
    link.click();
  }
}
