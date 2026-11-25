import { NgClass } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DigimonCard, GroupedSets, ICountCard, ISave } from '@models';
import { DialogStore, DigimonCardStore, SaveStore } from '@store';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'digimon-collection-export',
  template: `
    <div class="flex flex-col gap-5">
      <p class="m-0 text-sm text-muted">Download a CSV of your collection, or of the cards you still need, to share or keep as a backup.</p>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Export</span>
        <div role="group" aria-label="What to export" class="inline-flex self-start gap-1 rounded-full border border-line bg-ink-0 p-1">
          <button type="button" (click)="collectedCards = true" [attr.aria-pressed]="collectedCards"
            class="rounded-full px-4 py-1 text-sm" [ngClass]="collectedCards ? 'bg-accent font-semibold text-accent-ink' : 'text-fg'">Cards I own</button>
          <button type="button" (click)="collectedCards = false" [attr.aria-pressed]="!collectedCards"
            class="rounded-full px-4 py-1 text-sm" [ngClass]="!collectedCards ? 'bg-accent font-semibold text-accent-ink' : 'text-fg'">Cards I'm missing</button>
        </div>
      </div>

      @if (!collectedCards) {
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Copies wanted per card</span>
          <div role="group" aria-label="Copies wanted" class="flex flex-wrap gap-1">
            @for (n of [1, 2, 3, 4, 5]; track n) {
              <button type="button" (click)="goal = n" [attr.aria-pressed]="goal === n" class="h-8 rounded-full border px-3 text-xs font-semibold w-10 font-mono" [ngClass]="goal === n ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">{{ n }}</button>
            }
          </div>
        </div>
      }

      <label class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Sets <span class="normal-case tracking-normal text-muted">(none selected = all)</span></span>
        <p-multiSelect
          [filter]="false"
          [(ngModel)]="sets"
          [group]="true"
          [options]="groupedSets"
          [showHeader]="false"
          [showToggleAll]="false"
          placeholder="All sets"
          display="chip"
          scrollHeight="250px"
          appendTo="body"
          styleClass="w-full">
          <ng-template let-group pTemplate="group">
            <span>{{ group.label }}</span>
          </ng-template>
        </p-multiSelect>
      </label>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Rarity <span class="normal-case tracking-normal text-muted">(none = all)</span></span>
        <div role="group" aria-label="Rarity" class="flex flex-wrap gap-1">
          @for (rarity of rarityOptions; track rarity) {
            <button type="button" (click)="changeRarity(rarity)" [attr.aria-pressed]="rarities.includes(rarity)"
              class="h-8 rounded-full border px-3 text-xs font-semibold font-mono" [ngClass]="rarities.includes(rarity) ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">{{ rarity }}</button>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Printings <span class="normal-case tracking-normal text-muted">(none = all)</span></span>
        <div role="group" aria-label="Printings" class="flex flex-wrap gap-1">
          @for (version of versionOptions; track version.value) {
            <button type="button" (click)="changeVersion(version.value)" [attr.aria-pressed]="versions.includes(version.value)"
              class="h-8 rounded-full border px-3 text-xs font-semibold" [ngClass]="versions.includes(version.value) ? 'border-accent bg-ink-2 text-accent' : 'border-line bg-ink-2 text-fg'">{{ version.label }}</button>
          }
        </div>
      </div>

      <div class="flex justify-end">
        <button type="button" (click)="exportCollection()" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-semibold text-accent-ink disabled:opacity-40"><i class="pi pi-download"></i> Download CSV</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [MultiSelect, FormsModule, NgClass],
})
export class CollectionExportComponent {
  private dialogStore = inject(DialogStore);
  private saveStore = inject(SaveStore);
  private digimonCardStore = inject(DigimonCardStore);
  private messageService = inject(MessageService);

  save: Signal<ISave> = this.saveStore.save;

  collectedCards = true;
  groupedSets = GroupedSets;
  sets: string[] = [];
  // Starts at the collection goal from the settings
  goal = Math.min(Math.max(this.saveStore.settings().collectionMinimum, 1), 5);
  rarityOptions = ['C', 'UC', 'R', 'SR', 'SEC'];
  versionOptions = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Alt. art', value: 'AA' },
    { label: 'Pre-release', value: 'Pre-Release' },
    { label: 'Stamp', value: 'Stamp' },
    { label: 'Reprint', value: 'Reprint' },
    { label: 'Special rare', value: 'Special Rare' },
    { label: 'Rare pull', value: 'Rare Pull' },
  ];
  rarities: string[] = [];
  versions: string[] = [];

  collection: ICountCard[] = [];

  changeRarity(rarity: string) {
    if (this.rarities.includes(rarity)) {
      this.rarities = this.rarities.filter((value) => value !== rarity);
    } else {
      this.rarities = [...new Set(this.rarities), rarity];
    }
  }

  changeVersion(version: string) {
    if (this.versions.includes(version)) {
      this.versions = this.versions.filter((value) => value !== version);
    } else {
      this.versions = [...new Set(this.versions), version];
    }
  }

  exportCollection() {
    const exportCards = this.getSetCards()
      .filter((card) => card.count !== 0)
      .sort((a, b) => a.id.localeCompare(b.id));

    if (exportCards.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'No cards found!', detail: 'No cards, that match your filter were found!' });
      return;
    }

    const header = Object.keys(exportCards[0]);

    let csv = exportCards.map((row) =>
      // @ts-ignore
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(','),
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    let blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'digimon-card-app.csv');
  }

  private getSetCards(): ICountCard[] {
    // If no filter is selected filter all cards
    let returnCards: ICountCard[] = [];
    let allCards: DigimonCard[] = this.setupAllCards();
    let collection: ICountCard[] = this.setupCollection();

    if (this.collectedCards) {
      collection.forEach((collectionCard) => returnCards.push(collectionCard));
    } else {
      allCards.forEach((card) => {
        const foundCard = collection.find((collectionCard) => collectionCard.id === card.id);
        if (foundCard) {
          if (this.goal - foundCard.count > 0) {
            returnCards.push({
              id: foundCard.id,
              count: this.goal - foundCard.count,
            } as ICountCard);
          }
        } else {
          returnCards.push({ id: card.id, count: this.goal } as ICountCard);
        }
      });
    }

    return returnCards;
  }

  private setupAllCards(): DigimonCard[] {
    let setFiltered: DigimonCard[] = this.sets.length === 0 ? this.digimonCardStore.cards() : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([...setFiltered, ...this.digimonCardStore.cards().filter((cards) => cards['id'].split('-')[0] === filter)]),
      ];
    });

    let raritiesFiltered: DigimonCard[] = [];
    if (this.rarities.length === 0) {
      raritiesFiltered = setFiltered;
    }
    this.rarities.forEach((filter) => {
      raritiesFiltered = [...new Set([...raritiesFiltered, ...setFiltered.filter((cards) => cards['rarity'] === filter)])];
    });

    let versionsFiltered: DigimonCard[] = [];
    if (this.versions.length === 0) {
      versionsFiltered = raritiesFiltered;
    }
    this.versions.forEach((filter) => {
      versionsFiltered = [...new Set([...versionsFiltered, ...raritiesFiltered.filter((cards) => cards['version'] === filter)])];
    });

    return versionsFiltered;
  }

  private setupCollection(): ICountCard[] {
    let setFiltered: ICountCard[] = this.sets.length === 0 ? this.saveStore.collection() : [];
    this.sets.forEach((filter) => {
      setFiltered = [...new Set([...setFiltered, ...this.saveStore.collection().filter((cards) => cards['id'].split('-')[0] === filter)])];
    });

    if (this.rarities.length === 0) {
      return setFiltered;
    }

    let collectionCardsForRarity: ICountCard[] = [];
    setFiltered.forEach((collectionCard) => {
      const foundCard = this.digimonCardStore.cards().find((card) => card.id === collectionCard.id);

      if (this.rarities.includes(foundCard && foundCard.rarity ? foundCard.rarity : '')) {
        collectionCardsForRarity.push(collectionCard);
      }
    });

    if (this.versions.length === 0) {
      return collectionCardsForRarity;
    }

    let collectionCardsForVersion: ICountCard[] = [];
    collectionCardsForRarity.forEach((collectionCard) => {
      const foundCard = this.digimonCardStore.cards().find((card) => card.id === collectionCard.id);

      if (this.versions.includes(foundCard!.version)) {
        collectionCardsForVersion.push(collectionCard);
      }
    });

    return collectionCardsForVersion.filter((card) => card.count !== 0);
  }
}
