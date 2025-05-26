import { Component } from '@angular/core';
import { TabPanel, TabView } from 'primeng/tabview';
import { CollectionExportComponent } from './collection-export.component';
import { CollectionImportComponent } from './collection-import.component';
import { GeneralSettingsComponent } from './general-settings.component';

@Component({
  selector: 'digimon-settings-dialog',
  template: `
    <p-tabView class="centered-tabs p-5">
      <p-tabPanel class="ml-auto" header="General">
        <digimon-general-settings></digimon-general-settings>
      </p-tabPanel>

      <p-tabPanel header="Collection Export">
        <digimon-collection-export></digimon-collection-export>
      </p-tabPanel>

      <p-tabPanel header="Collection Import">
        <digimon-collection-import></digimon-collection-import>
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
  imports: [CollectionImportComponent, TabPanel, CollectionExportComponent, GeneralSettingsComponent, TabView],
})
export class SettingsDialogComponent {}
