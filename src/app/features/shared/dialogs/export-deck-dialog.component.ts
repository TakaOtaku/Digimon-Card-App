import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { ColorsWithoutMulti, DigimonCard, IDeck } from '../../../../models';
import { environment } from '../../../../environments/environment';
import { compareIDs, formatId, levelSort, mapToDeckCards } from '../../../functions';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';

@Component({
  selector: 'digimon-export-deck-dialog',
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Format</span>
        <div role="group" aria-label="Export format" class="flex flex-wrap gap-1">
          @for (type of exportList; track type) {
            <button
              type="button"
              (click)="exportType = type; changeExportType({ option: type })"
              [attr.aria-pressed]="exportType === type"
              class="h-9 rounded-full border px-4 text-sm font-semibold"
              [ngClass]="exportType === type ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">
              {{ formatLabels[type] ?? type }}
            </button>
          }
        </div>
      </div>

      <div *ngIf="exportType === 'TEXT'" class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Line order</span>
        <div role="group" aria-label="Line order" class="flex flex-wrap gap-1">
          @for (order of orderOptions; track order.value) {
            <button
              type="button"
              (click)="selectedOrder = order.value; onOrderChange()"
              [attr.aria-pressed]="selectedOrder === order.value"
              class="h-8 rounded-full border px-3 font-mono text-xs"
              [ngClass]="selectedOrder === order.value ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">
              {{ order.label }}
            </button>
          }
        </div>
      </div>

      <label *ngIf="exportType !== 'IMAGE'" class="flex flex-col gap-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Deck list</span>
        <textarea #textAreaElement id="text-imports" class="min-h-[240px] w-full rounded-lg border border-line bg-ink-0 p-3 font-mono text-sm text-fg outline-none focus:border-accent" [(ngModel)]="deckText"></textarea>
      </label>

      <div [ngClass]="{ hidden: exportType !== 'IMAGE' }" class="flex flex-col gap-3">
        <canvas #Canvas id="Canvas" width="640" height="360" class="w-full rounded-lg border border-line" (contextmenu)="downloadImage()"></canvas>
        <canvas #HDCanvas id="HDCanvas" width="1920" height="1080" class="hidden"></canvas>
        <canvas #TTSCanvas id="TTS" width="7440" height="6240" class="hidden"></canvas>
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Background</span>
          @for (color of colors; track color) {
            <button
              type="button"
              [attr.aria-label]="color"
              [attr.aria-pressed]="colorChecked(color)"
              (click)="selectedColor = color; setExportTypeIMAGE()"
              class="h-8 w-8 rounded-full border-0"
              [ngClass]="color"
              [style.box-shadow]="colorChecked(color) ? '0 0 0 2px var(--dc-ink-1), 0 0 0 4px var(--dc-accent)' : 'inset 0 0 0 1px rgba(255,255,255,.25)'"></button>
          }
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2">
        @if (exportType !== 'IMAGE') {
          <button type="button" (click)="exportDeckToFile()" class="h-11 rounded-lg border border-line bg-ink-2 px-4 font-semibold text-fg hover:border-accent"><i class="pi pi-download mr-1"></i> Save as file</button>
          <button type="button" (click)="copyToClipboard()" class="h-11 rounded-lg bg-accent px-5 font-semibold text-accent-ink"><i class="pi pi-copy mr-1"></i> Copy to clipboard</button>
        } @else {
          <button type="button" (click)="downloadImageTTS()" class="h-11 rounded-lg border border-line bg-ink-2 px-4 font-semibold text-fg hover:border-accent">Download for TTS</button>
          <button type="button" (click)="downloadImage()" class="h-11 rounded-lg border border-line bg-ink-2 px-4 font-semibold text-fg hover:border-accent"><i class="pi pi-download mr-1"></i> Download image</button>
          <button type="button" (click)="copyImage()" class="h-11 rounded-lg bg-accent px-5 font-semibold text-accent-ink"><i class="pi pi-copy mr-1"></i> Copy image</button>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
})
export class ExportDeckDialogComponent implements OnInit {
  digimonCardStore = inject(DigimonCardStore);
  dialogStore = inject(DialogStore);

  deck: IDeck = this.dialogStore.exportDeck().deck;
  digimonCards: DigimonCard[] = this.digimonCardStore.cards();

  exportList = ['TEXT', 'TTS', 'UNTAP', 'IMAGE'];
  formatLabels: Record<string, string> = { TEXT: 'Text', TTS: 'TTS', UNTAP: 'Untap', IMAGE: 'Image' };
  private messageService = inject(MessageService);
  exportType = 'TEXT';
  deckText = '';

  colors = ColorsWithoutMulti;
  selectedColor = 'Red';

  // Order options for export
  orderOptions = [
    { label: 'Qty Name ID', value: 'qty-name-id' },
    { label: 'ID Name Qty', value: 'id-name-qty' },
    { label: 'Name Qty ID', value: 'name-qty-id' },
    { label: 'Name ID Qty', value: 'name-id-qty' },
    { label: 'ID Qty Name', value: 'id-qty-name' },
    { label: 'Qty ID Name', value: 'qty-id-name' }
  ];
  selectedOrder = 'qty-name-id';

  normalOrder = true;

  setExport = effect(() => {
    const { deck, mode } = this.dialogStore.exportDeck();
    this.deck = deck;
    this.deckSort();
    this.exportType = mode ?? 'TEXT';
    // The canvases only exist after the dialog view renders
    setTimeout(() => this.changeExportType({ option: this.exportType }));
  });

  updateDigimonCards = effect(() => {
    this.digimonCards = this.digimonCardStore.cards();
  });

  ngOnInit() {
    this.deckSort();
  }

  // Garage sends no CORS headers; load card images through the same-origin /card-images/ proxy.
  private static loadCanvasImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`load ${url} fail`));
      img.src = url.startsWith(environment.cardImageBaseUrl) ? '/card-images/' + url.slice(environment.cardImageBaseUrl.length) : url;
    });
  }

  private static writeText(ctx: any, text: string, x: number, y: number, scale: number, fontSize?: number, fillStyle?: string) {
    ctx.font = fontSize ? fontSize * scale + 'px Roboto' : '15px Roboto';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2 * scale;
    ctx.lineWidth = 3 * scale;
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
    this.generateCanvas(document.getElementById('HDCanvas')! as HTMLCanvasElement);
    this.generateTTS(document.getElementById('TTS')! as HTMLCanvasElement);
  }

  downloadImageTTS() {
    const canvas = document.getElementById('TTS')! as HTMLCanvasElement;
    const img = canvas.toDataURL('image/jpg', 0.7).replace('image/jpg', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'deck.png';
    link.href = img;
    link.click();
  }

  downloadImage() {
    const canvas = document.getElementById('HDCanvas')! as HTMLCanvasElement;
    const img = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'deck.png';
    link.href = img;
    link.click();
  }

  copyImage() {
    const canvas = document.getElementById('HDCanvas') as HTMLCanvasElement;
    canvas.toBlob((blob) => {
      if (!blob || !navigator.clipboard?.write) {
        this.messageService.add({ severity: 'error', summary: 'Copy failed', detail: 'Your browser cannot copy images. Use Download image.' });
        return;
      }
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(
        () => this.messageService.add({ severity: 'success', summary: 'Deck image copied' }),
        () => this.messageService.add({ severity: 'error', summary: 'Copy failed', detail: 'Your browser blocked clipboard access.' }),
      );
    }, 'image/png');
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

  onOrderChange(): void {
    // Regenerate the deck text when order changes
    this.setExportTypeText();
  }

  private formatCardLine(card: any, digimonCard: any): string {
    const cardId = card.id.replace('ST0', 'ST');
    const cardName = digimonCard?.name.english || 'Unknown';
    const cardQty = card.count.toString();

    switch (this.selectedOrder) {
      case 'qty-name-id':
        return `${cardQty} ${cardName} ${cardId}`;
      case 'id-name-qty':
        return `${cardId} ${cardName} ${cardQty}`;
      case 'name-qty-id':
        return `${cardName} ${cardQty} ${cardId}`;
      case 'name-id-qty':
        return `${cardName} ${cardId} ${cardQty}`;
      case 'id-qty-name':
        return `${cardId} ${cardQty} ${cardName}`;
      case 'qty-id-name':
        return `${cardQty} ${cardId} ${cardName}`;
      default:
        return `${cardQty} ${cardName} ${cardId}`;
    }
  }

  private setExportTypeText(): void {
    this.deckText = '// Digimon DeckList\n\n';
    this.deck.cards.forEach((card) => {
      const digimonCard = this.digimonCardStore.cardsMap().get(card.id);
      if (digimonCard) {
        this.deckText += this.formatCardLine(card, digimonCard) + '\n';
      }
    });
  }

  private setExportTypeTTS(): void {
    this.deckText = `["Exported from ${environment.appUrl}",`;
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
      this.deckText += `${card.count} ${dc?.name.english} [DCG] (${card.id.replace('ST0', 'ST')})\n`;
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
      return (document.getElementById('Canvas')! as HTMLCanvasElement).getContext('2d')!;
    };

    const loadImage = ExportDeckDialogComponent.loadCanvasImage;

    const background = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(img, myOptions.x * scale, myOptions.y * scale, myOptions.sw * scale, myOptions.sh * scale);

        imgs = this.getImages();

        imgs.forEach(depict);
      });
    };

    const depict = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(img, myOptions.x * scale, myOptions.y * scale, myOptions.sw * scale, myOptions.sh * scale);
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
      const fullCard = this.digimonCards.find((search: DigimonCard) => compareIDs(card.id, search.id));
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
      return (document.getElementById('Canvas')! as HTMLCanvasElement).getContext('2d')!;
    };

    const loadImage = ExportDeckDialogComponent.loadCanvasImage;

    const background = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(img, myOptions.x, myOptions.y, myOptions.sw, myOptions.sh);

        imgs = this.getImagesAll();

        imgs.forEach(depict);
      });
    };

    const depict = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(img, myOptions.x, myOptions.y, myOptions.sw, myOptions.sh);
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
      const fullCard = this.digimonCards.find((search: DigimonCard) => compareIDs(card.id, search.id));
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
    const xOffset = 54;

    let y = 50 + 84;
    let x = 10 + xOffset;

    let cardCount = this.deck.cards.length;
    if (cardCount <= 9) {
      y += 95;
    } else if (cardCount <= 18) {
      y += 47;
    }

    let cardsInCurrentRow = 1;
    const cardsPerRow = 9;
    this.deck.cards.forEach((card) => {
      ExportDeckDialogComponent.writeText(ctx, 'x', x - 13, y, scale, 20, '#0369a1');
      ExportDeckDialogComponent.writeText(ctx, card.count.toString(), x, y, scale, 20);

      if (cardsInCurrentRow >= cardsPerRow) {
        y += 95;
        x = 10 + xOffset;
        cardsInCurrentRow = 1;
      } else {
        x += 70;
        cardsInCurrentRow += 1;
      }
    });
  }

  /**
   * Sort the Deck (Eggs, Digimon, Tamer, Options)
   */
  private deckSort() {
    const allCards = this.digimonCardStore.cards();
    const mainDeckCards = mapToDeckCards(this.deck.cards, allCards);
    const sideDeckCards = mapToDeckCards(this.deck.sideDeck, allCards);

    this.deck.cards = levelSort(mainDeckCards).map((card) => ({
      id: card.id,
      count: card.count,
    }));
    this.deck.sideDeck = levelSort(sideDeckCards).map((card) => ({
      id: card.id,
      count: card.count,
    }));
  }
}
