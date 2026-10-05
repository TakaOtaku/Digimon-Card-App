import { Component } from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { CollectionExportComponent } from './collection-export.component';
import { CollectionImportComponent } from './collection-import.component';
import { GeneralSettingsComponent } from './general-settings.component';

@Component({
  selector: 'digimon-settings-dialog',
  template: `
    <p-tabs value="0" class="settings-tabs">
      <p-tablist>
        <p-tab value="0">General</p-tab>
        <p-tab value="1">Collection Export</p-tab>
        <p-tab value="2">Collection Import</p-tab>
      </p-tablist>

      <p-tabpanels>
        <p-tabpanel value="0">
          <digimon-general-settings></digimon-general-settings>
        </p-tabpanel>

        <p-tabpanel value="1">
          <digimon-collection-export></digimon-collection-export>
        </p-tabpanel>

        <p-tabpanel value="2">
          <digimon-collection-import></digimon-collection-import>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
  styles: [
    `
      :host ::ng-deep .settings-tabs .p-tablist-tab-list {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [CollectionImportComponent, CollectionExportComponent, GeneralSettingsComponent, Tabs, TabList, Tab, TabPanels, TabPanel],
})
export class SettingsDialogComponent { }
