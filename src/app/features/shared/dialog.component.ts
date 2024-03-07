import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { emptyDeck } from '../../../models';
import { ChangelogDialogComponent } from './dialogs/changelog-dialog.component';
import { DeckDialogComponent } from './dialogs/deck-dialog.component';
import { ExportDeckDialogComponent } from './dialogs/export-deck-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings-dialog.component';
import { ViewCardDialogComponent } from './dialogs/view-card-dialog.component';
import { DialogStore } from '../../store/dialog.store';

@Component({
  selector: 'digimon-dialog',
  template: `
    <p-dialog
      header="Deck Details"
      [(visible)]="deckDialog"
      (onHide)="closeDeckDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-deck-dialog></digimon-deck-dialog>
    </p-dialog>

    <p-dialog
      header="Export Deck"
      [(visible)]="exportDeckDialog"
      (onHide)="closeExportDeckDialog()"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-export-deck-dialog></digimon-export-deck-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="settingsDialog"
      (onHide)="closeSettingsDialog()"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      header="Settings"
      styleClass="background-darker surface-ground w-full h-full max-w-6xl min-h-[500px]">
      <digimon-settings-dialog></digimon-settings-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="viewCardDialog"
      (onHide)="closeViewCardDialog()"
      [showHeader]="false"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="overflow-x-hidden">
      <digimon-view-card-dialog></digimon-view-card-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="changelogDialog"
      (onHide)="closeChangelogDialog()"
      header="Changelog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="background-darker surface-ground w-full h-full max-w-6xl min-h-[500px]">
      <digimon-changelog-dialog></digimon-changelog-dialog>
    </p-dialog>
  `,
  standalone: true,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    ChangelogDialogComponent,
    SettingsDialogComponent,
    ViewCardDialogComponent,
    ExportDeckDialogComponent,
    DeckDialogComponent
  ]
})
export class DialogComponent {
  dialogStore = inject(DialogStore);

  settingsDialog = false;
  viewCardDialog = false;
  exportDeckDialog = false;
  deckDialog = false;
  changelogDialog = false;

  constructor() {
    effect(() => {
      this.settingsDialog = this.dialogStore.settings();
    });
    effect(() => {
      this.viewCardDialog = this.dialogStore.viewCard().show;
    });
    effect(() => {
      this.exportDeckDialog = this.dialogStore.exportDeck().show;
    });
    effect(() => {
      this.deckDialog = this.dialogStore.deck().show;
    });
    effect(() => {
      this.changelogDialog = this.dialogStore.changelog();
    });
  }

  closeSettingsDialog() {
    this.dialogStore.updateSettingsDialog(false);
  }
  closeViewCardDialog() {
    this.dialogStore.showViewCardDialog(false);
  }
  closeExportDeckDialog() {
    this.dialogStore.showExportDeckDialog(false);
  }
  closeDeckDialog() {
    this.dialogStore.showDeckDialog(false);
  }
  closeChangelogDialog() {
    this.dialogStore.updateChangelogDialog(false);
  }
}
