import { NgClass, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorsWithoutMulti, DigimonCard, IDeck } from '../../../../models';
import { compareIDs, formatId, mapToDeckCards } from '../../../functions';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';

@Component({
  selector: 'digimon-export-deck-dialog',
  template: `
    <p-selectButton
      [options]="exportList"
      [(ngModel)]="exportType"
      (onOptionClick)="changeExportType($event)"></p-selectButton>
    <div *ngIf="exportType !== 'IMAGE'">
      <textarea
        #textAreaElement
        pInputTextarea
        id="text-imports"
        class="border-black-500 min-h-[200px] min-w-full border-2"
        [(ngModel)]="deckText"></textarea>
    </div>

    <div [ngClass]="{ hidden: exportType !== 'IMAGE' }">
      <canvas
        #Canvas
        id="Canvas"
        width="640"
        height="360"
        (contextmenu)="downloadImage()"></canvas>
      <canvas
        #HDCanvas
        id="HDCanvas"
        width="1920"
        height="1080"
        class="hidden"></canvas>
      <canvas
        #TTSCanvas
        id="TTS"
        width="7440"
        height="6240"
        class="hidden"></canvas>
      <p-selectButton
        class="Colors mt-3"
        [options]="colors"
        [(ngModel)]="selectedColor"
        (onChange)="setExportTypeIMAGE()"
        [multiple]="false">
        <ng-template let-color>
          <i
            class="pi"
            [ngClass]="{
              'pi-check': colorChecked(color),
              'pi-times': !colorChecked(color)
            }"></i>
        </ng-template>
      </p-selectButton>
    </div>

    <div class="mt-5 flex w-full justify-end">
      <p-button
        *ngIf="exportType !== 'IMAGE'"
        label="Copy to Clipboard"
        icon="pi pi-copy"
        (click)="copyToClipboard()"
        styleClass="p-button-sm"></p-button>
      <p-button
        *ngIf="exportType !== 'IMAGE'"
        (click)="exportDeckToFile()"
        class="ml-5"
        styleClass="p-button-sm"
        >Export to File
      </p-button>
      <p-button
        *ngIf="exportType === 'IMAGE'"
        (click)="setExportTypeIMAGE()"
        class="ml-5"
        styleClass="p-button-sm">
        Generate Image
      </p-button>
      <p-button
        *ngIf="exportType === 'IMAGE'"
        (click)="downloadImageTTS()"
        class="ml-5"
        styleClass="p-button-sm">
        Download Deck (TTS)
      </p-button>
      <p-button
        *ngIf="exportType === 'IMAGE'"
        (click)="downloadImage()"
        class="ml-5"
        styleClass="p-button-sm"
        >Download Image
      </p-button>
    </div>
  `,
  styleUrls: ['./export-deck-dialog.component.scss'],
  standalone: true,
  imports: [
    SelectButtonModule,
    FormsModule,
    NgIf,
    InputTextareaModule,
    NgClass,
    ButtonModule,
  ],
})
export class ExportDeckDialogComponent {
  digimonCardStore = inject(DigimonCardStore);
  dialogStore = inject(DialogStore);

  deck: IDeck = this.dialogStore.exportDeck().deck;
  digimonCards: DigimonCard[] = this.digimonCardStore.cards();

  exportList = ['TEXT', 'TTS', 'UNTAP', 'IMAGE'];
  exportType = 'TEXT';
  deckText = '';

  colors = ColorsWithoutMulti;
  selectedColor = 'Red';

  setExport = effect(() => {
    this.deck = this.dialogStore.exportDeck().deck;
    this.setExportTypeText();
    this.exportType = 'TEXT';
  });

  updateDigimonCards = effect(() => {
    this.digimonCards = this.digimonCardStore.cards();
  });

  private static writeText(
    ctx: any,
    text: string,
    x: number,
    y: number,
    scale: number,
    fontSize?: number,
    fillStyle?: string,
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
      case 'UNTAP':
        this.setExportTypeUNTAP();
        break;
      case 'IMAGE':
        this.setExportTypeIMAGE();
        break;
    }
  }

  exportDeckToFile(): void {
    let blob = new Blob([this.deckText], { type: 'text/txt' });
    saveAs(blob, this.deck.title + '.txt');
  }

  setExportTypeIMAGE(): void {
    this.generateCanvas();
    this.generateCanvas(
      document.getElementById('HDCanvas')! as HTMLCanvasElement,
    );
    this.generateTTS(document.getElementById('TTS')! as HTMLCanvasElement);
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

  copyToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.deckText;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private setExportTypeText(): void {
    this.deckText = '// Digimon DeckList\n\n';
    this.deck.cards.forEach((card) => {
      const digimonCard = this.digimonCardStore.cardsMap().get(card.id);
      if (digimonCard) {
        this.deckText += `${card.id.replace('ST0', 'ST')} ${digimonCard?.name
          .english} ${card.count}\n`;
      }
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

  private setExportTypeUNTAP(): void {
    this.deckText = '// Digimon DeckList\n\n';
    this.deck.cards.forEach((card) => {
      const dc = this.digimonCardStore.cardsMap().get(card.id);
      this.deckText += `${card.count} ${dc?.name
        .english} [DCG] (${card.id.replace('ST0', 'ST')})\n`;
    });
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
          myOptions.sh * scale,
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
          myOptions.sh * scale,
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
      const fullCard = this.digimonCards.find((search: DigimonCard) =>
        compareIDs(card.id, search.id),
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
          myOptions.sh,
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
          myOptions.sh,
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
      const fullCard = this.digimonCards.find((search: DigimonCard) =>
        compareIDs(card.id, search.id),
      );
      for (let i = 1; i <= card.count; i++) {
        imgs.push({
          uri: fullCard!.cardImage,
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
        '#0369a1',
      );
      ExportDeckDialogComponent.writeText(
        ctx,
        card.count.toString(),
        x,
        y,
        scale,
        30,
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
}
