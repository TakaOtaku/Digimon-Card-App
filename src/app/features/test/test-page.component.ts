import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs';
import { ADMINS } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { DigimonFirebaseService } from '../../services/digimon-firebase.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'digimon-test-page',
  template: `
    <div *ngIf="isAdmin()" class="flex flex-col items-center">
      <div class="flex items-center gap-4">
        <p-button
          label="Migrate Data to Firebase"
          icon="pi pi-cloud-upload"
          [disabled]="isMigrating"
          (onClick)="migrateData()">
        </p-button>

        <p-progressSpinner
          *ngIf="isMigrating"
          [style]="{ width: '30px', height: '30px' }"></p-progressSpinner>
      </div>
      <div *ngIf="isMigrating" class="mt-4">
        <p>Migration in progress... Please don't close this page.</p>
      </div>

      <div
        *ngIf="migrationComplete"
        class="mt-4 p-3 bg-green-100 text-green-800 rounded">
        <p>
          Migration completed successfully! Your data is now stored in Firebase.
        </p>
      </div>
    </div>

    <p-dialog
      [(visible)]="updateIDDialog"
      [baseZIndex]="100000"
      [dismissableMask]="true"
      [resizable]="false">
      <h1>
        There are still <b>{{ productsWithoutCorrectID.length }}</b> without
        correct ID.
      </h1>

      <a
        class="my-3"
        [href]="productsWithoutCorrectID[0]?.link"
        target="_blank"
        >{{ productsWithoutCorrectID[0]?.link }}</a
      >

      <div class="my-3 flex flex-row">
        <div>Enter a ID:</div>
        <input
          [(ngModel)]="currentID"
          type="number"
          min="1"
          max="10"
          class="text-center font-bold text-black" />
      </div>
    </p-dialog>
  `,
  standalone: true,
  imports: [
    NgIf,
    DialogModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
})
export class TestPageComponent {
  isMigrating = false;
  migrationComplete = false;

  firebaseService = inject(DigimonFirebaseService);

  updateIDDialog = false;
  productsWithoutCorrectID: any[] = [];
  currentID = 1;

  constructor(public authService: AuthService) {}

  isAdmin(): boolean {
    return !!ADMINS.find((user) => {
      if (this.authService.userData?.uid === user.id) {
        return user.admin;
      }
      return false;
    });
  }

  migrateData(): void {
    this.isMigrating = true;
    this.migrationComplete = false;

    this.firebaseService
      .migrateToFirebase()
      .pipe(
        finalize(() => {
          this.isMigrating = false;
        }),
      )
      .subscribe((success) => {
        this.migrationComplete = success;
      });
  }
}
