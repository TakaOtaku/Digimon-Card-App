import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ChangelogDialogComponent } from './features/shared/dialogs/changelog-dialog.component';
import { ExportDeckDialogComponent } from './features/shared/dialogs/export-deck-dialog.component';
import { SettingsDialogComponent } from './features/shared/dialogs/settings-dialog.component';
import { ViewCardDialogComponent } from './features/shared/dialogs/view-card-dialog.component';
import { NavbarComponent } from './features/shared/navbar/navbar.component';
import { DialogStore } from './store/dialog.store';

@Component({
  selector: 'digimon-dialog',
  template: `
    <p-dialog
      header="Export Deck"
      [(visible)]="exportDeckDialog"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="w-full h-full max-w-6xl min-h-[500px]"
      [baseZIndex]="10000">
      <digimon-export-deck-dialog></digimon-export-deck-dialog>
    </p-dialog>

    <p-dialog
      [(visible)]="settingsDialog"
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
      [showHeader]="false"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      styleClass="overflow-x-hidden">
      <digimon-view-card-dialog></digimon-view-card-dialog>
    </p-dialog>
  `,
  standalone: true,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    NgIf,
    RouterOutlet,
    BlockUIModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ChangelogDialogComponent,
    SettingsDialogComponent,
    ViewCardDialogComponent,
    ExportDeckDialogComponent,
  ],
})
export class AppComponent {
  dialogStore = inject(DialogStore);

  settingsDialog = this.dialogStore.settings();
  viewCardDialog = this.dialogStore.viewCard().show;
  exportDeckDialog = this.dialogStore.exportDeck().show;

  constructor() {
    effect(() => {
      console.log('Dialog changed: ', this.dialogStore.settings());

      this.settingsDialog = this.dialogStore.settings();
      this.viewCardDialog = this.dialogStore.viewCard().show;
      this.exportDeckDialog = this.dialogStore.exportDeck().show;
    });
  }
}
