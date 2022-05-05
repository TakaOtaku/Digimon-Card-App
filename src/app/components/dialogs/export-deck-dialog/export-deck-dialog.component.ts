import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {ICard, IDeck} from "../../../../models";
import {compareIDs, formatId, getPNG} from "../../../functions/digimon-card.functions";
import {selectAllCards} from "../../../store/digimon.selectors";
import {ColorsWithoutMulti} from "../../filter-box/filterData";

@Component({
  selector: 'digimon-export-deck-dialog',
  templateUrl: './export-deck-dialog.component.html',
  styleUrls: ['./export-deck-dialog.component.scss']
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
    this.selectedColor = changes['deck'].currentValue.color.name;
    this.exportType = 'TEXT';
  }

  ngOnInit(): void {
    this.digimonCards$.pipe(takeUntil(this.onDestroy$))
      .subscribe(cards => this.digimonCards = cards);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  colorChecked(color: string): boolean {
    return this.selectedColor === color
  }

  changeExportType(event: any) {
    switch(event.option) {
      default:
      case 'TEXT':
        this.setExportTypeText();
        break;
      case 'TTS':
        this.setExportTypeTTS();
        break;
      case 'IMAGE':
        break;
    }
  }

  private setExportTypeText(): void {
    this.deckText = "// Digimon DeckList\n\n";
    this.deck.cards.forEach(card => {
      const dc = this.digimonCards.find(dc => compareIDs(dc.id, card.id))
      this.deckText += `${card.id.replace('ST0', 'ST')} ${dc?.name} ${card.count}\n`;
    });
  }

  private setExportTypeTTS(): void {
    this.deckText = '["Exported from https://digimoncard.app\",';
    this.deck.cards.forEach(card => {
      for(let i = 0; i < card.count; i++) {
        this.deckText += `"${formatId(card.id)}",`;
      }
    });
    this.deckText = this.deckText.substring(0, this.deckText.length - 1);
    this.deckText += ']';
  }

  exportDeckToFile(): void {
    let blob = new Blob([this.deckText], {type: 'text/txt'})
    saveAs(blob, this.deck.title + ".txt");
  }

  setExportTypeIMAGE(): void {
    let loadedCount = 0;
    let imgs: any[] = [];

    const getContext = () => (document.getElementById('Canvas')! as HTMLCanvasElement).getContext('2d')!;

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
        ctx.drawImage(img, myOptions.x, myOptions.y, myOptions.sw, myOptions.sh);

        imgs = this.getImages();

        imgs.forEach(depict);
      });
    };

    const depict = (options: any) => {
      const ctx = getContext();
      const myOptions = Object.assign({}, options);
      return loadImage(myOptions.uri).then((img: any) => {
        ctx.drawImage(img, myOptions.x, myOptions.y, myOptions.sw, myOptions.sh);
        loadedCount += 1;
        if(loadedCount === imgs.length) {
          ExportDeckDialogComponent.writeText(ctx, 'https://digimoncard.app', 310, 390)
          this.drawCount(ctx);
        }
      });
    };

    const BackgroundMap = new Map<string, string>([
      ['Red', 'assets/images/image-export/bg-share_red.png'],
      ['Blue', 'assets/images/image-export/bg-share_blue.png'],
      ['Yellow', 'assets/images/image-export/bg-share_yellow.png'],
      ['Green', 'assets/images/image-export/bg-share_green.png'],
      ['Black', 'assets/images/image-export/bg-share_black.png'],
      ['Purple', 'assets/images/image-export/bg-share_purple.png'],
      ['White', 'assets/images/image-export/bg-share_white.png']
    ]);

    background({ uri: BackgroundMap.get(this.selectedColor), x: 0, y:  0, sw: 700, sh: 400 })
  }

  private getImages(): any[] {
    let imgs: any[] = [];

    let y = 50;
    let x = 40;

    let cardsInCurrentRow = 1;
    const cardsPerRow = 9;
    this.deck.cards.forEach(card => {
      const fullCard = this.digimonCards.find((search: ICard) => compareIDs(card.id, search.id))
      imgs.push(
        {uri: getPNG(fullCard!.cardImage), x: x, y: y, sw: 64, sh: 88}
      );
      if (cardsInCurrentRow >= cardsPerRow) {
        y += 95;
        x = 40;
        cardsInCurrentRow = 1;
      } else {
        x += 70;
        cardsInCurrentRow += 1;
      }
    });
    return imgs;
  }

  private static writeText(ctx: any, text: string, x: number, y: number, fontSize?: number, fillStyle?: string) {
    ctx.font = fontSize ? fontSize+"px Roboto" : "15px Roboto";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.strokeText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.fillStyle = fillStyle ? fillStyle : "#f97316";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
  }

  private drawCount(ctx: any) {
    let y = 50+82;
    let x = 40+50;

    let cardsInCurrentRow = 1;
    const cardsPerRow = 9;
    this.deck.cards.forEach(card => {
      ExportDeckDialogComponent.writeText(ctx, 'x', x-20, y, 30, '#0369a1')
      ExportDeckDialogComponent.writeText(ctx,  card.count.toString(), x, y, 30)

      if (cardsInCurrentRow >= cardsPerRow) {
        y += 95;
        x = 40+46;
        cardsInCurrentRow = 1;
      } else {
        x += 70;
        cardsInCurrentRow += 1;
      }
    });
  }

  downloadImage() {
    const canvas = document.getElementById('Canvas')! as HTMLCanvasElement;
    const img = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.download = "deck.png";
    link.href = img;
    link.click();
  }
}
