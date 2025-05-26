import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICountCard } from '@models';
import { DigimonCardStore, SaveStore } from '@store';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'digimon-collection-import',
  template: `
    <div>
      <p>Copy your collection in the text area and press import.</p>
      <textarea
        [(ngModel)]="collectionText"
        [placeholder]="importPlaceholder"
        class="border-black-500 min-h-[150px] w-full border-2"
        id="text-import"
        pInputTextarea></textarea>
    </div>
    <div class="flex w-full justify-end">
      <button (click)="importCollection()" icon="pi pi-upload" label="Import" pButton type="button"></button>
    </div>
  `,
  styles: [
    `
      .centered-tabs .p-tabview-nav {
        display: flex;
        justify-content: center;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, Textarea, ButtonDirective],
  providers: [MessageService],
})
export class CollectionImportComponent {
  private saveStore = inject(SaveStore);
  private toastrService: ToastrService = inject(ToastrService);

  importPlaceholder = '' + 'Paste Collection here\n' + '\n' + ' Format:\n' + '   Qty Id\n';
  collectionText = '';

  private digimonCardStore = inject(DigimonCardStore);

  importCollection() {
    if (this.collectionText === '') return;

    let result: string[] = this.collectionText.split('\n');
    const collectionCards: ICountCard[] = [];
    result.forEach((line) => {
      const card: ICountCard | null = this.parseLine(line);
      if (card) {
        collectionCards.push(card);
      }
    });

    this.saveStore.addCard(collectionCards);
    this.toastrService.info('The collection was imported successfully!', 'Collection Imported!');
  }

  private parseLine(line: string): ICountCard | null {
    line = line.replace('\t', ' ');
    const lineSplit: string[] = line.replace(/  +/g, ' ').split(' ');
    const cardLine: number = +lineSplit[0] >>> 0;
    if (cardLine > 0) {
      if (!this.digimonCardStore.cards().find((card) => card.id === lineSplit[1])) {
        return null;
      }
      return { count: cardLine, id: lineSplit[1] } as ICountCard;
    }
    return null;
  }
}
