import { NgClass, NgIf } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DigimonCard, GroupedSets, ICountCard, ISave } from '@models';
import { DialogStore, DigimonCardStore, SaveStore } from '@store';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputSwitch } from 'primeng/inputswitch';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'digimon-collection-export',
  template: `
    <div class="mx-auto flex flex-col justify-center">
      <p class="text-center font-bold">What cards you want to export?</p>
      <p class="text-center text-xs">(Select nothing for all cards)</p>
      <div class="mx-auto">
        <p-multiSelect
          [filter]="false"
          [(ngModel)]="sets"
          [group]="true"
          [options]="groupedSets"
          [showHeader]="false"
          [showToggleAll]="false"
          placeholder="Select a Set"
          display="chip"
          scrollHeight="250px"
          class="mt-2"
          styleClass="w-full max-w-[300px] h-8 text-sm">
          <ng-template let-group pTemplate="group">
            <div class="align-items-center flex">
              <span>{{ group.label }}</span>
            </div>
          </ng-template>
        </p-multiSelect>
      </div>

      <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">Rarity:</h1>
      <div class="inline-flex w-full justify-center">
        <button
          (click)="changeRarity('C')"
          [ngClass]="{ 'primary-border': rarities.includes('C') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          C
        </button>
        <button
          (click)="changeRarity('UC')"
          [ngClass]="{ 'primary-border': rarities.includes('UC') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          UC
        </button>
        <button
          (click)="changeRarity('R')"
          [ngClass]="{ 'primary-border': rarities.includes('R') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          R
        </button>
        <button
          (click)="changeRarity('SR')"
          [ngClass]="{ 'primary-border': rarities.includes('SR') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          SR
        </button>
        <button
          (click)="changeRarity('SEC')"
          [ngClass]="{ 'primary-border': rarities.includes('SEC') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 rounded-r border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          SEC
        </button>
      </div>

      <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">Version:</h1>
      <div class="inline-flex w-full justify-center">
        <button
          (click)="changeVersion('Normal')"
          [ngClass]="{ 'primary-border': versions.includes('Normal') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Normal
        </button>
        <button
          (click)="changeVersion('AA')"
          [ngClass]="{ 'primary-border': versions.includes('AA') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          AA
        </button>
        <button
          (click)="changeVersion('Pre-Release')"
          [ngClass]="{ 'primary-border': versions.includes('Pre-Release') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Pre-Release
        </button>
        <button
          (click)="changeVersion('Stamp')"
          [ngClass]="{ 'primary-border': versions.includes('Stamp') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Stamp
        </button>
        <button
          (click)="changeVersion('Reprint')"
          [ngClass]="{ 'primary-border': versions.includes('Reprint') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Reprint
        </button>
        <button
          (click)="changeVersion('Special Rare')"
          [ngClass]="{ 'primary-border': versions.includes('Reprint') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Reprint
        </button>
        <button
          (click)="changeVersion('Rare Pull')"
          [ngClass]="{ 'primary-border': versions.includes('Reprint') }"
          class="min-w-auto primary-background mt-2 h-8 w-10 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
          Reprint
        </button>
      </div>

      <p class="mt-3 text-center font-bold">Missing Cards or Collected Cards?</p>
      <div class="mx-auto flex flex-row">
        <span class="mr-2">Missing</span>
        <p-inputSwitch [(ngModel)]="collectedCards"></p-inputSwitch>
        <span class="ml-2">Collected</span>
      </div>

      <div *ngIf="!collectedCards" class="my-3">
        <h1 class="text-center text-xs font-bold text-[#e2e4e6]">Collection Goal:</h1>
        <div class="inline-flex w-full justify-center">
          <button
            (click)="goal = 1"
            [ngClass]="{ 'primary-border': goal === 1 }"
            class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
            1
          </button>
          <button
            (click)="goal = 2"
            [ngClass]="{ 'primary-border': goal === 2 }"
            class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
            2
          </button>
          <button
            (click)="goal = 3"
            [ngClass]="{ 'primary-border': goal === 3 }"
            class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
            3
          </button>
          <button
            (click)="goal = 4"
            [ngClass]="{ 'primary-border': goal === 4 }"
            class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
            4
          </button>
          <button
            (click)="goal = 5"
            [ngClass]="{ 'primary-border': goal === 5 }"
            class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]">
            5
          </button>
        </div>
      </div>

      <div class="mt-3 flex w-full justify-end">
        <button (click)="exportCollection()" icon="pi pi-download" label="Export" pButton type="button"></button>
      </div>
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
  imports: [MultiSelect, FormsModule, NgClass, InputSwitch, NgIf, ButtonDirective],
  providers: [MessageService],
})
export class CollectionExportComponent {
  private dialogStore = inject(DialogStore);
  private saveStore = inject(SaveStore);
  private digimonCardStore = inject(DigimonCardStore);
  private toastrService = inject(ToastrService);

  save: Signal<ISave> = this.saveStore.save;

  collectedCards = true;
  groupedSets = GroupedSets;
  sets: string[] = [];
  goal = 4;
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
      this.toastrService.info('No cards, that match your filter were found!', 'No cards found!');
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
