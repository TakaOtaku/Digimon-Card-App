import { NgStyle } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { emptySettings, GroupedSets, ICountCard, ISave, PriceMetric, VersionButtons } from '@models';
import { MongoBackendService } from '@services';
import { DialogStore } from '@store';
import { SaveStore } from '@store';
import { MultiButtonsComponent } from '../../multi-buttons.component';
import { SettingsRowComponent } from '../../settings-row.component';

@Component({
  selector: 'digimon-general-settings',
  template: `
    <div class="flex flex-col gap-5 p-2">
      <!-- Deckbuilder Section -->
      <section class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
          <i class="pi pi-pencil text-xs"></i> Deckbuilder
        </h3>
        <digimon-settings-row title="Sort Cards by">
          <p-selectButton [allowEmpty]="false" [formControl]="sortOrderFilter" [multiple]="false" [options]="sortOrder"></p-selectButton>
        </digimon-settings-row>
        <digimon-settings-row title="Group deck by card type" hint="Show Digi-Egg, Digimon, Tamer and Option separately in the builder and on deck pages. Off shows one grid.">
          <p-toggleSwitch [(ngModel)]="groupDeckByType"></p-toggleSwitch>
        </digimon-settings-row>
        <digimon-settings-row title="Side deck" hint="Show a side deck below the main deck in the builder.">
          <p-toggleSwitch [(ngModel)]="sideDeck"></p-toggleSwitch>
        </digimon-settings-row>
        <digimon-settings-row title="Filter panel beside cards" hint="On wide screens, show filters next to the card list on Cards and Collection. The builder always uses the Filter drawer.">
          <p-toggleSwitch [(ngModel)]="fullscreenFilter"></p-toggleSwitch>
        </digimon-settings-row>
        <digimon-settings-row title="Show prices" hint="Cardmarket prices on cards, decks and your collection.">
          <p-toggleSwitch [(ngModel)]="showPrices"></p-toggleSwitch>
        </digimon-settings-row>
        @if (showPrices) {
          <digimon-settings-row title="Price Display Metric">
            <p-selectButton [allowEmpty]="false" [(ngModel)]="priceMetric" [options]="priceMetricOptions" optionLabel="label" optionValue="value"></p-selectButton>
          </digimon-settings-row>
        }
      </section>

      <!-- Collection Section -->
      <section class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
          <i class="pi pi-folder text-xs"></i> Collection
        </h3>
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
            class="w-full max-w-[250px]"
            styleClass="w-full max-w-[250px] h-8 text-sm">
            <ng-template let-group pTemplate="group">
              <div class="align-items-center flex">
                <span>{{ group.label }}</span>
              </div>
            </ng-template>
          </p-multiSelect>
        </digimon-settings-row>
        <digimon-settings-row title="Collection goal" hint="Copies of a card you need before it counts as collected.">
          <p-inputNumber [(ngModel)]="collectionCount" mode="decimal"></p-inputNumber>
        </digimon-settings-row>
        <digimon-settings-row title="Alt art collection goal" hint="The same, for alternate art printings. 0 ignores them.">
          <p-inputNumber [(ngModel)]="aaCollectionCount" mode="decimal"></p-inputNumber>
        </digimon-settings-row>
        <digimon-settings-row title="Collection filter max" hint="Highest value on the Number in Collection slider.">
          <p-inputNumber [(ngModel)]="collectionFilterMax" mode="decimal"></p-inputNumber>
        </digimon-settings-row>
        <digimon-settings-row title="Default printings" hint="Which versions card lists show until you change the Version filter.">
          <digimon-multi-buttons
            (clickEvent)="changeVersionFilterDefault($event)"
            [buttonArray]="versionButtons"
            [value]="versionFilterDefault"
            [perRow]="3"
            class="w-full"></digimon-multi-buttons>
        </digimon-settings-row>
      </section>

      <!-- Profile Section -->
      <section class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
          <i class="pi pi-user text-xs"></i> Profile
        </h3>
        <digimon-settings-row title="Username">
          <input type="text" pInputText [(ngModel)]="username" class="w-full max-w-[220px]" />
        </digimon-settings-row>
        <digimon-settings-row title="Profile Image URL">
          <input type="text" pInputText [(ngModel)]="displayImage" class="w-full max-w-[220px]" />
        </digimon-settings-row>
        <digimon-settings-row title="Profile header" hint="Show your name, counts and set completion on your profile.">
          <p-toggleSwitch [(ngModel)]="userStats"></p-toggleSwitch>
        </digimon-settings-row>
        <digimon-settings-row title="Decks as table" hint="List your decks in a table instead of tiles.">
          <p-toggleSwitch [(ngModel)]="deckDisplayTable"></p-toggleSwitch>
        </digimon-settings-row>
      </section>

      <!-- Save Data Section -->
      <section class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
          <i class="pi pi-database text-xs"></i> Save Data
        </h3>
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
          <input #fileUpload (change)="handleFileInput($event.target)" [ngStyle]="{ display: 'none' }" accept=".json" type="file" />
          <button (click)="fileUpload.click()" class="min-w-[150px]" icon="pi pi-upload" label="Import" pButton type="button"></button>
          <button (click)="exportSave()" class="min-w-[150px]" icon="pi pi-download" label="Export" pButton type="button"></button>
          <button (click)="deleteSave($event)" class="min-w-[150px] p-button-danger" icon="pi pi-trash" label="Delete" pButton type="button"></button>
        </div>
      </section>

      <!-- Save Button -->
      <div class="flex justify-end pt-2">
        <button (click)="saveSettings()" class="px-8" icon="pi pi-check" label="Save Settings" pButton type="button"></button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    SettingsRowComponent,
    SelectButton,
    ReactiveFormsModule,
    FormsModule,
    MultiSelect,
    InputNumber,
    ButtonDirective,
    MultiButtonsComponent,
    NgStyle,
    ToggleSwitch,
  ],
})
export class GeneralSettingsComponent {
  dialogStore = inject(DialogStore);

  saveStore = inject(SaveStore);

  save = '';
  iSave: ISave;

  groupedSets = GroupedSets;
  sets: string[] = [];
  versions: string[] = [];

  collection: ICountCard[] = [];

  setGoal: string[] = [];
  collectionCount = 1;
  aaCollectionCount = 1;
  collectionFilterMax = 5;

  userStats = true;
  deckDisplayTable = true;
  groupDeckByType = true;
  sideDeck = true;

  sortOrder = ['Color', 'Level'];
  sortOrderFilter = new UntypedFormControl();

  fullscreenFilter = true;

  showPrices = false;
  priceMetric: string = PriceMetric.Trend;
  priceMetricOptions = [
    { label: 'Low', value: PriceMetric.Low },
    { label: 'Avg', value: PriceMetric.Avg },
    { label: 'Trend', value: PriceMetric.Trend },
    { label: '1-Day', value: PriceMetric.Avg1 },
    { label: '7-Day', value: PriceMetric.Avg7 },
    { label: '30-Day', value: PriceMetric.Avg30 },
  ];

  displayImage = '';
  username = '';

  versionFilterDefault: string[] = [];
  versionButtons = VersionButtons;

  constructor(
    private mongoBackendService: MongoBackendService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      const save = this.saveStore.save();

      this.iSave = save;
      this.sortOrderFilter.setValue(save.settings?.sortDeckOrder ?? 'Level', {
        emitEvent: false,
      });
      this.username = save.displayName ?? '';
      this.displayImage = save.photoUrl ?? '';
      this.save = JSON.stringify(save, undefined, 4);
      this.priceMetric = save.settings?.priceMetric ?? PriceMetric.Trend;
      this.showPrices = save.settings?.showPrices ?? false;
      this.setGoal = save.settings?.collectionSets ?? [];
      this.collectionCount = save.settings?.collectionMinimum ?? 1;
      this.aaCollectionCount = save.settings?.aaCollectionMinimum ?? 1;
      this.userStats = save.settings?.showUserStats ?? true;
      this.sideDeck = save.settings?.displaySideDeck ?? true;
      this.groupDeckByType = save.settings?.groupDeckByType ?? true;
      this.deckDisplayTable = save.settings?.deckDisplayTable ?? true;
      this.fullscreenFilter = save.settings?.fullscreenFilter ?? true;
      this.collectionFilterMax = save.settings?.countMax ?? 5;

      const filterMappings = [
        { setting: 'showNormalCards', value: 'Normal' },
        { setting: 'showAACards', value: 'Alternative Art' },
        { setting: 'showFoilCards', value: 'Foil' },
        { setting: 'showTexturedCards', value: 'Textured' },
        { setting: 'showPreRelease', value: 'Release' },
        { setting: 'showBoxTopper', value: 'Box Topper' },
        { setting: 'showFullArtCards', value: 'Full Art' },
        { setting: 'showStampedCards', value: 'Stamp' },
        { setting: 'showSpecialRareCards', value: 'Special Rare' },
        { setting: 'showRarePullCards', value: 'Rare Pull' },
      ];
      filterMappings.forEach((mapping) => {
        // Check if the setting is true in save.settings
        // and if the value is not already in this.versionFilterDefault
        if (save.settings[mapping.setting] && !this.versionFilterDefault.includes(mapping.value)) {
          this.versionFilterDefault.push(mapping.value);
        }
      });
    });
  }

  saveSettings() {
    const save: ISave = {
      ...this.iSave,
      displayName: this.username,
      photoUrl: this.displayImage,
      settings: {
        ...this.iSave.settings,
        collectionMinimum: this.collectionCount,
        aaCollectionMinimum: this.aaCollectionCount,

        sortDeckOrder: this.sortOrderFilter.value,
        showUserStats: this.userStats,
        deckDisplayTable: this.deckDisplayTable,
        displaySideDeck: this.sideDeck,
        groupDeckByType: this.groupDeckByType,
        collectionSets: this.setGoal,
        fullscreenFilter: this.fullscreenFilter,
        countMax: this.collectionFilterMax,
        showPrices: this.showPrices,
        priceMetric: this.priceMetric,

        showNormalCards: this.versionFilterDefault.includes('Normal'),
        showAACards: this.versionFilterDefault.includes('Alternative Art'),
        showFoilCards: this.versionFilterDefault.includes('Foil'),
        showTexturedCards: this.versionFilterDefault.includes('Textured'),
        showPreRelease: this.versionFilterDefault.includes('Release'),
        showBoxTopper: this.versionFilterDefault.includes('Box Topper'),
        showFullArtCards: this.versionFilterDefault.includes('Full Art'),
        showStampedCards: this.versionFilterDefault.includes('Stamp'),
        showSpecialRareCards: this.versionFilterDefault.includes('Special Rare'),
        showRarePullCards: this.versionFilterDefault.includes('Rare Pull'),
      },
    };

    this.saveStore.updateSave(save);
    this.messageService.add({ severity: 'info', summary: 'Settings saved!', detail: 'Settings were saved and updated.' });

    this.dialogStore.updateSettingsDialog(false);
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
        save = this.mongoBackendService.checkSaveValidity(save, null);
        this.saveStore.updateSave(save);
        this.messageService.add({ severity: 'info', summary: 'Save loaded!', detail: 'The save was loaded successfully!' });
      } catch (e) {
        this.messageService.add({ severity: 'error', summary: 'Save Error!', detail: 'The save was not loaded!' });
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
        this.messageService.add({ severity: 'info', summary: 'Save cleared!', detail: 'The save was cleared successfully!' });
      },
      reject: () => { },
    });
  }

  changeVersionFilterDefault(version: any) {
    let versions = [];
    if (this.versionFilterDefault && this.versionFilterDefault.includes(version)) {
      versions = this.versionFilterDefault.filter((value) => value !== version);
    } else {
      versions = [...new Set(this.versionFilterDefault), version];
    }
    this.versionFilterDefault = versions;
  }
}
