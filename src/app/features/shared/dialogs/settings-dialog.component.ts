import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, takeUntil } from 'rxjs';
import { ICard, ICountCard, ISave } from '../../../../models';
import { GroupedSets } from '../../../../models/data/filter.data';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import {
  addToCollection,
  loadSave,
  setSave,
} from '../../../store/digimon.actions';
import {
  selectAllCards,
  selectCollection,
  selectSave,
  selectSettings,
} from '../../../store/digimon.selectors';
import { emptySettings } from '../../../store/reducers/save.reducer';

@Component({
  selector: 'digimon-settings-dialog',
  template: `
    <ul
      class="nav nav-tabs mb-4 flex w-full list-none flex-col flex-wrap justify-center pl-0 md:flex-row"
      id="tabs-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <a
          href="#tabs-home"
          class="active nav-link my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-xs font-medium uppercase leading-tight hover:border-transparent hover:bg-gray-100 focus:border-transparent"
          id="tabs-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-home"
          role="tab"
          aria-controls="tabs-home"
          aria-selected="true"
          >General</a
        >
      </li>
      <li class="nav-item" role="presentation">
        <a
          href="#tabs-profile"
          class="nav-link my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-xs font-medium uppercase leading-tight hover:border-transparent hover:bg-gray-100 focus:border-transparent"
          id="tabs-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-profile"
          role="tab"
          aria-controls="tabs-profile"
          aria-selected="false"
          >Collection Export</a
        >
      </li>
      <li class="nav-item" role="presentation">
        <a
          href="#tabs-messages"
          class="nav-link my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-xs font-medium uppercase leading-tight hover:border-transparent hover:bg-gray-100 focus:border-transparent"
          id="tabs-messages-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-messages"
          role="tab"
          aria-controls="tabs-messages"
          aria-selected="false"
          >Collection Import</a
        >
      </li>
      <li class="nav-item" role="presentation">
        <a
          href="#tabs-contact"
          class="nav-link my-2 block border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 text-xs font-medium uppercase leading-tight hover:border-transparent hover:bg-gray-100 focus:border-transparent"
          id="tabs-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-contact"
          role="tab"
          aria-controls="tabs-contact"
          aria-selected="false"
          >Links</a
        >
      </li>
    </ul>
    <div class="tab-content" id="tabs-tabContent">
      <div
        class="tab-pane show active fade"
        id="tabs-home"
        role="tabpanel"
        aria-labelledby="tabs-home-tab"
      >
        <div class="mx-auto grid w-full grid-cols-2  justify-end">
          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Collection Goal:</h5>
            <p-inputNumber
              [(ngModel)]="collectionCount"
              styleClass="mx-auto"
              mode="decimal"
            ></p-inputNumber>
          </div>

          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Deck-Sort</h5>
            <div class="flex justify-center">
              <p-selectButton
                [formControl]="sortOrderFilter"
                [multiple]="false"
                [options]="sortOrder"
              >
              </p-selectButton>
            </div>
          </div>

          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Pre-Release Cards</h5>
            <p-selectButton
              [(ngModel)]="preRelease"
              [options]="showHideOptions"
              class="mx-auto"
              optionLabel="label"
              optionValue="value"
            ></p-selectButton>
          </div>

          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Alt. Art Cards</h5>
            <p-selectButton
              [(ngModel)]="aa"
              [options]="showHideOptions"
              class="mx-auto"
              optionLabel="label"
              optionValue="value"
            ></p-selectButton>
          </div>

          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Stamped Cards</h5>
            <p-selectButton
              [(ngModel)]="stamped"
              [options]="showHideOptions"
              class="mx-auto"
              optionLabel="label"
              optionValue="value"
            ></p-selectButton>
          </div>

          <div class="flex flex-col">
            <h5 class="mt-5 text-center font-bold">Show User-Stats</h5>
            <p-selectButton
              [(ngModel)]="userStats"
              [options]="showHideOptions"
              class="mx-auto"
              optionLabel="label"
              optionValue="value"
            ></p-selectButton>
          </div>
        </div>

        <div class="flex flex-row justify-end">
          <button
            (click)="saveSettings()"
            class="mt-10"
            icon="pi pi-save"
            label="Save Settings"
            pButton
            type="button"
          ></button>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="tabs-profile"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab"
      >
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
              defaultLabel="Select a Set"
              display="chip"
              scrollHeight="250px"
              class="mt-2"
              styleClass="w-full max-w-[300px] h-8 text-sm"
            >
              <ng-template let-group pTemplate="group">
                <div class="align-items-center flex">
                  <span>{{ group.label }}</span>
                </div>
              </ng-template>
            </p-multiSelect>
          </div>

          <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">
            Rarity:
          </h1>
          <div class="flex inline-flex w-full justify-center">
            <button
              (click)="changeRarity('C')"
              [ngClass]="{ 'primary-border': rarities.includes('C') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              C
            </button>
            <button
              (click)="changeRarity('UC')"
              [ngClass]="{ 'primary-border': rarities.includes('UC') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              UC
            </button>
            <button
              (click)="changeRarity('R')"
              [ngClass]="{ 'primary-border': rarities.includes('R') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              R
            </button>
            <button
              (click)="changeRarity('SR')"
              [ngClass]="{ 'primary-border': rarities.includes('SR') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              SR
            </button>
            <button
              (click)="changeRarity('SEC')"
              [ngClass]="{ 'primary-border': rarities.includes('SEC') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 rounded-r border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              SEC
            </button>
          </div>

          <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">
            Version:
          </h1>
          <div class="flex inline-flex w-full justify-center">
            <button
              (click)="changeVersion('Normal')"
              [ngClass]="{ 'primary-border': versions.includes('Normal') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              Normal
            </button>
            <button
              (click)="changeVersion('AA')"
              [ngClass]="{ 'primary-border': versions.includes('AA') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              AA
            </button>
            <button
              (click)="changeVersion('Pre-Release')"
              [ngClass]="{ 'primary-border': versions.includes('Pre-Release') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              Pre-Release
            </button>
            <button
              (click)="changeVersion('Stamp')"
              [ngClass]="{ 'primary-border': versions.includes('Stamp') }"
              class="min-w-auto primary-background mt-2 h-8 w-10 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
            >
              Stamp
            </button>
          </div>

          <p class="mt-3 text-center font-bold">
            Missing Cards or Collected Cards?
          </p>
          <div class="mx-auto flex flex-row">
            <span class="mr-2">Missing</span>
            <p-inputSwitch [(ngModel)]="collectedCards"></p-inputSwitch>
            <span class="ml-2">Collected</span>
          </div>

          <div *ngIf="!collectedCards" class="my-3">
            <h1 class="text-center text-xs font-bold text-[#e2e4e6]">
              Collection Goal:
            </h1>
            <div class="flex inline-flex w-full justify-center">
              <button
                (click)="goal = 1"
                [ngClass]="{ 'primary-border': goal === 1 }"
                class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
              >
                1
              </button>
              <button
                (click)="goal = 2"
                [ngClass]="{ 'primary-border': goal === 2 }"
                class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
              >
                2
              </button>
              <button
                (click)="goal = 3"
                [ngClass]="{ 'primary-border': goal === 3 }"
                class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
              >
                3
              </button>
              <button
                (click)="goal = 4"
                [ngClass]="{ 'primary-border': goal === 4 }"
                class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-r-2 border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
              >
                4
              </button>
              <button
                (click)="goal = 5"
                [ngClass]="{ 'primary-border': goal === 5 }"
                class="min-w-auto primary-background mt-2 h-8 w-20 rounded-l border-slate-200 p-1 text-xs font-semibold text-[#e2e4e6]"
              >
                5
              </button>
            </div>
          </div>

          <div class="mt-3 flex w-full justify-end">
            <button
              (click)="exportCollection()"
              icon="pi pi-download"
              label="Export"
              pButton
              type="button"
            ></button>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="tabs-messages"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab"
      >
        <div>
          <p>Copy your collection in the text area and press import.</p>
          <textarea
            [(ngModel)]="collectionText"
            [placeholder]="importPlaceholder"
            class="border-black-500 min-h-[150px] w-full border-2"
            id="text-import"
            pInputTextarea
          ></textarea>
        </div>
        <div class="flex w-full justify-end">
          <button
            (click)="importCollection()"
            icon="pi pi-upload"
            label="Import"
            pButton
            type="button"
          ></button>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="tabs-contact"
        role="tabpanel"
        aria-labelledby="tabs-contact-tab"
      >
        <div class="flex flex-col justify-between lg:flex-row">
          <input
            #fileUpload
            (change)="handleFileInput($event.target)"
            [ngStyle]="{ display: 'none' }"
            accept=".json"
            type="file"
          />
          <button
            (click)="fileUpload.click()"
            class="m-auto mb-2 min-w-[200px] max-w-[200px]"
            icon="pi pi-upload"
            label="Import Save"
            pButton
            type="button"
          ></button>
          <button
            (click)="exportSave()"
            class="m-auto mb-2 min-w-[200px] max-w-[200px]"
            icon="pi pi-download"
            label="Export Save"
            pButton
            type="button"
          ></button>
          <button
            (click)="deleteSave($event)"
            class="m-auto mb-2 min-w-[200px] max-w-[200px]"
            icon="pi pi-times"
            label="Delete Save"
            pButton
            type="button"
          ></button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsDialogComponent implements OnInit, OnDestroy {
  save = '';
  iSave: ISave;

  collectedCards = true;
  groupedSets = GroupedSets;
  sets: string[] = [];
  goal = 4;
  rarities: string[] = [];
  versions: string[] = [];

  importPlaceholder =
    '' + 'Paste Collection here\n' + '\n' + ' Format:\n' + '   Qty Id\n';
  collectionText = '';

  digimonCards: ICard[] = [];
  collection: ICountCard[] = [];

  collectionCount = 1;

  preRelease = true;
  aa = true;
  stamped = true;
  showHideOptions = [
    { label: 'Show', value: true },
    { label: 'Hide', value: false },
  ];

  userStats = true;

  sortOrder = ['Color', 'Level'];
  sortOrderFilter = new FormControl();

  private onDestroy$ = new Subject();
  constructor(
    private store: Store,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectSave)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((save) => {
        this.iSave = save;
        this.sortOrderFilter.setValue(save.settings?.sortDeckOrder ?? 'Level', {
          emitEvent: false,
        });
        this.save = JSON.stringify(save, undefined, 4);
      });
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((cards) => (this.digimonCards = cards));
    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => (this.collection = collection));
    this.store
      .select(selectSettings)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((settings) => {
        this.preRelease = settings.showPreRelease;
        this.aa = settings.showAACards;
        this.stamped = settings.showStampedCards;
        this.collectionCount = settings.collectionMinimum;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  saveSettings() {
    const save = {
      ...this.iSave,
      settings: {
        ...this.iSave.settings,
        collectionMinimum: this.collectionCount,
        showPreRelease: this.preRelease,
        showAACards: this.aa,
        showStampedCards: this.stamped,
        sortDeckOrder: this.sortOrderFilter.value,
        showUserStats: this.userStats,
      },
    };

    this.store.dispatch(setSave({ save }));
  }

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

    this.store.dispatch(addToCollection({ collectionCards }));
    this.messageService.add({
      severity: 'success',
      summary: 'Collection Imported!',
      detail: 'The collection was imported successfully!',
    });
  }

  exportSave(): void {
    let blob = new Blob([this.save], { type: 'text/json' });
    saveAs(blob, 'digimon-card-collector.json');
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        let save: any = JSON.parse(fileReader.result as string);
        save = this.digimonBackendService.checkSaveValidity(save, null);
        this.store.dispatch(loadSave({ save }));
        this.messageService.add({
          severity: 'success',
          summary: 'Save loaded!',
          detail: 'The save was loaded successfully!',
        });
      } catch (e) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Save Error!',
          detail: 'The save was not loaded!',
        });
      }
    };
    fileReader.readAsText(input.files[0]);
  }

  deleteSave(event: Event) {
    this.confirmationService.confirm({
      target: event!.target!,
      message: 'You are about to permanently delete your save. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(
          setSave({
            save: {
              collection: [],
              decks: [],
              settings: emptySettings,
            },
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Save cleared!',
          detail: 'The save was cleared successfully!',
        });
      },
      reject: () => {},
    });
  }

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
      this.messageService.add({
        severity: 'warn',
        summary: 'No cards found!',
        detail: 'No cards, that match your filter were found!',
      });
      return;
    }

    const header = Object.keys(exportCards[0]);

    let csv = exportCards.map((row) =>
      // @ts-ignore
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    let blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'digimon-card-app.csv');
  }

  private getSetCards(): ICountCard[] {
    // If no filter is selected filter all cards
    let returnCards: ICountCard[] = [];
    let allCards: ICard[] = this.setupAllCards();
    let collection: ICountCard[] = this.setupCollection();

    if (this.collectedCards) {
      collection.forEach((collectionCard) => returnCards.push(collectionCard));
    } else {
      allCards.forEach((card) => {
        const foundCard = collection.find(
          (collectionCard) => collectionCard.id === card.id
        );
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

  private setupAllCards(): ICard[] {
    let setFiltered: ICard[] = this.sets.length === 0 ? this.digimonCards : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([
          ...setFiltered,
          ...this.digimonCards.filter(
            (cards) => cards['id'].split('-')[0] === filter
          ),
        ]),
      ];
    });

    let raritiesFiltered: ICard[] = [];
    if (this.rarities.length === 0) {
      raritiesFiltered = setFiltered;
    }
    this.rarities.forEach((filter) => {
      raritiesFiltered = [
        ...new Set([
          ...raritiesFiltered,
          ...setFiltered.filter((cards) => cards['rarity'] === filter),
        ]),
      ];
    });

    let versionsFiltered: ICard[] = [];
    if (this.versions.length === 0) {
      versionsFiltered = raritiesFiltered;
    }
    this.versions.forEach((filter) => {
      versionsFiltered = [
        ...new Set([
          ...versionsFiltered,
          ...raritiesFiltered.filter((cards) => cards['version'] === filter),
        ]),
      ];
    });

    return versionsFiltered;
  }

  private setupCollection(): ICountCard[] {
    let setFiltered: ICountCard[] =
      this.sets.length === 0 ? this.collection : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([
          ...setFiltered,
          ...this.collection.filter(
            (cards) => cards['id'].split('-')[0] === filter
          ),
        ]),
      ];
    });

    if (this.rarities.length === 0) {
      return setFiltered;
    }

    let collectionCardsForRarity: ICountCard[] = [];
    setFiltered.forEach((collectionCard) => {
      const foundCard = this.digimonCards.find(
        (card) => card.id === collectionCard.id
      );

      if (this.rarities.includes(foundCard!.rarity)) {
        collectionCardsForRarity.push(collectionCard);
      }
    });

    if (this.versions.length === 0) {
      return collectionCardsForRarity;
    }

    let collectionCardsForVersion: ICountCard[] = [];
    collectionCardsForRarity.forEach((collectionCard) => {
      const foundCard = this.digimonCards.find(
        (card) => card.id === collectionCard.id
      );

      if (this.versions.includes(foundCard!.version)) {
        collectionCardsForVersion.push(collectionCard);
      }
    });

    return collectionCardsForVersion.filter((card) => card.count !== 0);
  }

  private parseLine(line: string): ICountCard | null {
    line = line.replace('\t', ' ');
    const lineSplit: string[] = line.replace(/  +/g, ' ').split(' ');
    const cardLine: number = +lineSplit[0] >>> 0;
    if (cardLine > 0) {
      if (!this.digimonCards.find((card) => card.id === lineSplit[1])) {
        return null;
      }
      return { count: cardLine, id: lineSplit[1] } as ICountCard;
    }
    return null;
  }
}
