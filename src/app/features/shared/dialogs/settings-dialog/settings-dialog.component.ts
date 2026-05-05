import { Component } from '@angular/core';
import { TabPanel, TabView } from 'primeng/tabview';
import { CollectionExportComponent } from './collection-export.component';
import { CollectionImportComponent } from './collection-import.component';
import { GeneralSettingsComponent } from './general-settings.component';

@Component({
  selector: 'digimon-settings-dialog',
  template: `
    <p-tabView class="settings-tabs">
      <p-tabPanel header="General">
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
      :host ::ng-deep .settings-tabs .p-tabview-nav {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [CollectionImportComponent, TabPanel, CollectionExportComponent, GeneralSettingsComponent, TabView],
})
export class SettingsDialogComponent { }
