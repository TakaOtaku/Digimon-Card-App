import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICountCard } from '@models';
import { DigimonCardStore, SaveStore } from '@store';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'digimon-collection-import',
  template: `
    <div class="flex flex-col gap-4">
      <p class="m-0 text-sm leading-relaxed text-muted">
        Paste one card per line as <span class="font-mono text-fg">quantity card-number</span>, for example
        <span class="font-mono text-fg">4 BT1-010</span>. Counts are added to your collection; unknown card numbers are skipped.
      </p>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Collection list</span>
        <textarea
          id="text-import"
          [(ngModel)]="collectionText"
          [placeholder]="importPlaceholder"
          class="min-h-[220px] w-full rounded-lg border border-line bg-ink-0 p-3 font-mono text-sm text-fg outline-none focus:border-accent"></textarea>
      </label>
      <div class="flex justify-end">
        <button type="button" (click)="importCollection()" [disabled]="!collectionText.trim()" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-semibold text-accent-ink disabled:opacity-40"><i class="pi pi-upload"></i> Import cards</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule],
  providers: [MessageService],
})
export class CollectionImportComponent {
  private saveStore = inject(SaveStore);
  private toastrService: ToastrService = inject(ToastrService);

  importPlaceholder = '4 BT1-010\n2 BT1-011\n1 EX13-001';
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
