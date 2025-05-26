import { NgStyle } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { yearsPerPage } from '@angular/material/datepicker';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { emptySettings, GroupedSets, ICountCard, ISave, VersionButtons } from '@models';
import { DigimonBackendService } from '@services';
import { DialogStore } from '@store';
import { SaveStore } from '@store';
import { MultiButtonsComponent } from '../../multi-buttons.component';
import { SettingsRowComponent } from '../../settings-row.component';

@Component({
  selector: 'digimon-general-settings',
  template: `
    <p-card header="Deckbuilder" subheader="Settings for the Deckbuilder" styleClass="border-slate-300 border">
      <digimon-settings-row title="Sort Cards by">
        <p-selectButton [allowEmpty]="false" [formControl]="sortOrderFilter" [multiple]="false" [options]="sortOrder"> </p-selectButton>
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

    <p-card class="m-1" header="Collection" subheader="Settings for the Collection" styleClass="border-slate-300 border">
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
        <p-inputNumber [(ngModel)]="collectionCount" mode="decimal"></p-inputNumber>
      </digimon-settings-row>
      <digimon-settings-row title="AA Collection Goal">
        <p-inputNumber [(ngModel)]="aaCollectionCount" mode="decimal"></p-inputNumber>
      </digimon-settings-row>
      <digimon-settings-row title="Collection Filter Max">
        <p-inputNumber [(ngModel)]="collectionFilterMax" mode="decimal"></p-inputNumber>
      </digimon-settings-row>
      <digimon-settings-row title="Version Default Filter">
        <digimon-multi-buttons
          (clickEvent)="changeVersionFilterDefault($event)"
          [buttonArray]="versionButtons"
          [value]="versionFilterDefault"
          [perRow]="3"
          title="Version"></digimon-multi-buttons>
      </digimon-settings-row>
    </p-card>

    <p-card class="m-1" header="Profile" subheader="Settings for your Profile" styleClass="border-slate-300 border">
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
          [options]="yesNoOptions"
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

    <p-card class="m-1" header="Save" subheader="Interactions with your Save" styleClass="border-slate-300 border">
      <div class="flex flex-col justify-between lg:flex-row">
        <input #fileUpload (change)="handleFileInput($event.target)" [ngStyle]="{ display: 'none' }" accept=".json" type="file" />
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

    <button (click)="saveSettings()" class="mt-10" icon="pi pi-save" label="Save Settings" pButton type="button"></button>
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
    Card,
    SettingsRowComponent,
    SelectButton,
    ReactiveFormsModule,
    FormsModule,
    MultiSelect,
    InputNumber,
    ButtonDirective,
    MultiButtonsComponent,
    NgStyle,
  ],
  providers: [MessageService],
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

  versionFilterDefault: string[] = [];
  versionButtons = VersionButtons;

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
      photoURL: this.displayImage,
      settings: {
        ...this.iSave.settings,
        collectionMinimum: this.collectionCount,
        aaCollectionMinimum: this.aaCollectionCount,

        sortDeckOrder: this.sortOrderFilter.value,
        showUserStats: this.userStats,
        deckDisplayTable: this.deckDisplayTable,
        displaySideDeck: this.sideDeck,
        collectionSets: this.setGoal,
        fullscreenFilter: this.fullscreenFilter,
        countMax: this.collectionFilterMax,

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
    this.toastrService.info('Settings were saved and updated.', 'Settings saved!');

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
        save = this.digimonBackendService.checkSaveValidity(save, null);
        this.saveStore.updateSave(save);
        this.toastrService.info('The save was loaded successfully!', 'Save loaded!');
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
        this.toastrService.info('The save was cleared successfully!', 'Save cleared!');
      },
      reject: () => {},
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
