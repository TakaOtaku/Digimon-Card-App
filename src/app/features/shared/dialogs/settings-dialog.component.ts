import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { Subject } from 'rxjs';
import {
  DigimonCard,
  emptySettings,
  GroupedSets,
  ICountCard,
  ISave,
} from '../../../../models';
import { DigimonBackendService } from '../../../services/digimon-backend.service';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { SaveStore } from '../../../store/save.store';
import { SetFilterComponent } from '../filter/set-filter.component';
import { SettingsRowComponent } from '../settings-row.component';

@Component({
  selector: 'digimon-settings-dialog',
  template: `
    <p-tabView class="centered-tabs">
      <p-tabPanel class="ml-auto" header="General">
        <p-card
          header="Deckbuilder"
          subheader="Settings for the Deckbuilder"
          styleClass="border-slate-300 border">
          <digimon-settings-row title="Sort Cards by">
            <p-selectButton
              [allowEmpty]="false"
              [formControl]="sortOrderFilter"
              [multiple]="false"
              [options]="sortOrder">
            </p-selectButton>
          </digimon-settings-row>

          <digimon-settings-row title="Display SideDecks">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="sideDeck"
              [options]="yesNoOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>

          <digimon-settings-row title="Display Filter on Fullscreen">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="fullscreenFilter"
              [options]="yesNoOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
        </p-card>

        <p-card
          class="m-1"
          header="Collection"
          subheader="Settings for the Collection"
          styleClass="border-slate-300 border">
          <digimon-settings-row title="Sets you want to complete">
            <p-multiSelect
              [filter]="false"
              [(ngModel)]="setGoal"
              [group]="true"
              [options]="groupedSets"
              [showHeader]="false"
              [showToggleAll]="false"
              placeholder="Select sets to collect"
              display="chip"
              scrollHeight="250px"
              class="mx-auto mb-2 w-full max-w-[250px]"
              styleClass="w-full max-w-[250px] h-8 text-sm">
              <ng-template let-group pTemplate="group">
                <div class="align-items-center flex">
                  <span>{{ group.label }}</span>
                </div>
              </ng-template>
            </p-multiSelect>
          </digimon-settings-row>
          <digimon-settings-row title="Collection Goal">
            <p-inputNumber
              [(ngModel)]="collectionCount"
              mode="decimal"></p-inputNumber>
          </digimon-settings-row>
          <digimon-settings-row title="AA Collection Goal">
            <p-inputNumber
              [(ngModel)]="aaCollectionCount"
              mode="decimal"></p-inputNumber>
          </digimon-settings-row>
          <digimon-settings-row title="Collection Filter Max">
            <p-inputNumber
              [(ngModel)]="collectionFilterMax"
              mode="decimal"></p-inputNumber>
          </digimon-settings-row>
          <digimon-settings-row title="Alt. Art Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="aa"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Foil Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="foil"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Textured Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="textured"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Pre-Release Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="preRelease"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Box Topper">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="boxTopper"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Full Art Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="fullArt"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
          <digimon-settings-row title="Stamp Cards">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="stamped"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
        </p-card>

        <p-card
          class="m-1"
          header="Profile"
          subheader="Settings for your Profile"
          styleClass="border-slate-300 border">
          <digimon-settings-row title="Username">
            <input type="text" pInputText [(ngModel)]="username" />
          </digimon-settings-row>
          <digimon-settings-row title="Profile Image">
            <input type="text" pInputText [(ngModel)]="displayImage" />
          </digimon-settings-row>
          <digimon-settings-row title="Collection-Stats">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="userStats"
              [options]="showHideOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>

          <digimon-settings-row title="Display Decks in a Table">
            <p-selectButton
              [allowEmpty]="false"
              [(ngModel)]="deckDisplayTable"
              [options]="yesNoOptions"
              optionLabel="label"
              optionValue="value"></p-selectButton>
          </digimon-settings-row>
        </p-card>

        <p-card
          class="m-1"
          header="Save"
          subheader="Interactions with your Save"
          styleClass="border-slate-300 border">
          <div class="flex flex-col justify-between lg:flex-row">
            <input
              #fileUpload
              (change)="handleFileInput($event.target)"
              [ngStyle]="{ display: 'none' }"
              accept=".json"
              type="file" />
            <button
              (click)="fileUpload.click()"
              class="m-auto mb-2 min-w-[200px] max-w-[200px]"
              icon="pi pi-upload"
              label="Import Save"
              pButton
              type="button"></button>
            <button
              (click)="exportSave()"
              class="m-auto mb-2 min-w-[200px] max-w-[200px]"
              icon="pi pi-download"
              label="Export Save"
              pButton
              type="button"></button>
            <button
              (click)="deleteSave($event)"
              class="m-auto mb-2 min-w-[200px] max-w-[200px]"
              icon="pi pi-times"
              label="Delete Save"
              pButton
              type="button"></button>
          </div>
        </p-card>

        <button
          (click)="saveSettings()"
          class="mt-10"
          icon="pi pi-save"
          label="Save Settings"
          pButton
          type="button"></button>
      </p-tabPanel>

      <p-tabPanel header="Collection Export">
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

          <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">
            Rarity:
          </h1>
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

          <h1 class="mt-3 text-center text-xs font-bold text-[#e2e4e6]">
            Version:
          </h1>
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
            <button
              (click)="exportCollection()"
              icon="pi pi-download"
              label="Export"
              pButton
              type="button"></button>
          </div>
        </div>
      </p-tabPanel>

      <p-tabPanel header="Collection Import">
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
          <button
            (click)="importCollection()"
            icon="pi pi-upload"
            label="Import"
            pButton
            type="button"></button>
        </div>
      </p-tabPanel>
    </p-tabView>
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
  imports: [
    InputNumberModule,
    FormsModule,
    SelectButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule,
    SharedModule,
    NgClass,
    InputSwitchModule,
    NgIf,
    InputTextareaModule,
    NgStyle,
    TabViewModule,
    CardModule,
    SettingsRowComponent,
    InputTextModule,
    SetFilterComponent,
    AsyncPipe,
  ],
  providers: [MessageService],
})
export class SettingsDialogComponent implements OnDestroy {
  dialogStore = inject(DialogStore);

  saveStore = inject(SaveStore);

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

  collection: ICountCard[] = [];

  setGoal: string[] = [];
  collectionCount = 1;
  aaCollectionCount = 1;
  collectionFilterMax = 5;

  foil = true;
  textured = true;
  preRelease = true;
  boxTopper = true;
  fullArt = true;
  aa = true;
  stamped = true;
  reprint = false;
  showHideOptions = [
    { label: 'Show', value: true },
    { label: 'Hide', value: false },
  ];
  yesNoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  userStats = true;
  deckDisplayTable = true;
  sideDeck = true;

  sortOrder = ['Color', 'Level'];
  sortOrderFilter = new UntypedFormControl();

  fullscreenFilter = true;

  displayImage = '';
  username = '';

  private digimonCardStore = inject(DigimonCardStore);
  private onDestroy$ = new Subject();

  constructor(
    private digimonBackendService: DigimonBackendService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
  ) {
    effect(() => {
      const save = this.saveStore.save();

      this.iSave = save;
      this.sortOrderFilter.setValue(save.settings?.sortDeckOrder ?? 'Level', {
        emitEvent: false,
      });
      this.username = save.displayName ?? '';
      this.displayImage = save.photoURL ?? '';
      this.save = JSON.stringify(save, undefined, 4);

      const settings = save.settings;

      this.preRelease = settings.showPreRelease;
      this.aa = settings.showAACards;
      this.stamped = settings.showStampedCards;
      this.reprint = settings.showReprintCards;
      this.collectionCount = settings.collectionMinimum;
      this.aaCollectionCount = settings.aaCollectionMinimum;
      this.deckDisplayTable = settings.deckDisplayTable;
      this.setGoal = settings.collectionSets;
      this.fullscreenFilter = settings.fullscreenFilter;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  saveSettings() {
    const save: ISave = {
      ...this.iSave,
      displayName: this.username,
      photoURL: this.displayImage,
      settings: {
        ...this.iSave.settings,
        collectionMinimum: this.collectionCount,
        aaCollectionMinimum: this.aaCollectionCount,

        showFoilCards: this.foil,
        showTexturedCards: this.textured,
        showPreRelease: this.preRelease,
        showBoxTopper: this.boxTopper,
        showFullArtCards: this.fullArt,
        showAACards: this.aa,
        showStampedCards: this.stamped,
        showReprintCards: this.reprint,

        sortDeckOrder: this.sortOrderFilter.value,
        showUserStats: this.userStats,
        deckDisplayTable: this.deckDisplayTable,
        displaySideDeck: this.sideDeck,
        collectionSets: this.setGoal,
        fullscreenFilter: this.fullscreenFilter,
        countMax: this.collectionFilterMax,
      },
    };

    this.saveStore.updateSave(save);
    this.toastrService.info(
      'Settings were saved and updated.',
      'Settings saved!',
    );

    this.dialogStore.updateSettingsDialog(false);
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

    this.saveStore.addCard(collectionCards);
    this.toastrService.info(
      'The collection was imported successfully!',
      'Collection Imported!',
    );
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
        this.saveStore.updateSave(save);
        this.toastrService.info(
          'The save was loaded successfully!',
          'Save loaded!',
        );
      } catch (e) {
        this.toastrService.info('The save was not loaded!', 'Save Error!');
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
        const resetedSave = {
          ...this.iSave,
          collection: [],
          decks: [],
          settings: emptySettings,
        };
        this.saveStore.updateSave(resetedSave);
        this.toastrService.info(
          'The save was cleared successfully!',
          'Save cleared!',
        );
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
      this.toastrService.info(
        'No cards, that match your filter were found!',
        'No cards found!',
      );
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
        const foundCard = collection.find(
          (collectionCard) => collectionCard.id === card.id,
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

  private setupAllCards(): DigimonCard[] {
    let setFiltered: DigimonCard[] =
      this.sets.length === 0 ? this.digimonCardStore.cards() : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([
          ...setFiltered,
          ...this.digimonCardStore
            .cards()
            .filter((cards) => cards['id'].split('-')[0] === filter),
        ]),
      ];
    });

    let raritiesFiltered: DigimonCard[] = [];
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

    let versionsFiltered: DigimonCard[] = [];
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
            (cards) => cards['id'].split('-')[0] === filter,
          ),
        ]),
      ];
    });

    if (this.rarities.length === 0) {
      return setFiltered;
    }

    let collectionCardsForRarity: ICountCard[] = [];
    setFiltered.forEach((collectionCard) => {
      const foundCard = this.digimonCardStore
        .cards()
        .find((card) => card.id === collectionCard.id);

      if (this.rarities.includes(foundCard!.rarity)) {
        collectionCardsForRarity.push(collectionCard);
      }
    });

    if (this.versions.length === 0) {
      return collectionCardsForRarity;
    }

    let collectionCardsForVersion: ICountCard[] = [];
    collectionCardsForRarity.forEach((collectionCard) => {
      const foundCard = this.digimonCardStore
        .cards()
        .find((card) => card.id === collectionCard.id);

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
      if (
        !this.digimonCardStore.cards().find((card) => card.id === lineSplit[1])
      ) {
        return null;
      }
      return { count: cardLine, id: lineSplit[1] } as ICountCard;
    }
    return null;
  }
}
