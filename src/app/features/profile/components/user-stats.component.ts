import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';
import { SaveStore } from '@store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ISave } from '@models';
import { DialogModule } from 'primeng/dialog';
import { CollectionCircleComponent } from './collection-circle.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'digimon-user-stats',
  template: `
    <div class="flex flex-col py-2 text-[#e2e4e6]">
      <div class="flex flex-col sm:flex-row justify-center">
        <div class="flex flex-row mx-auto sm:ml-0 sm:mr-5">
          <img
            class="my-auto mr-2 h-16 w-auto rounded-full text-xs font-semibold text-[#e2e4e6]"
            *ngIf="save"
            alt="{{ save.displayName ?? 'Username not Found' }}"
            src="{{ save.photoURL }}" />
          <div class="vertical-align my-auto text-center text-2xl font-bold">
            {{ save.displayName ?? 'User' }}
          </div>
        </div>

        <div class="hidden sm:flex flex-row justify-center">
          <div class="flex flex-col">
            <digimon-collection-circle [type]="'BT'" class="mx-2"></digimon-collection-circle>
            <label class="text-center">BT</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle [type]="'EX'" class="mx-2"></digimon-collection-circle>
            <label class="text-center">EX</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle [type]="'ST'" class="mx-2"></digimon-collection-circle>
            <label class="text-center">ST</label>
          </div>
          <div class="flex flex-col">
            <digimon-collection-circle [type]="'P-'" class="mx-2"></digimon-collection-circle>
            <label class="text-center">P</label>
          </div>
        </div>

        <p-carousel class="sm:hidden" [value]="collectionCircles" [numVisible]="1" [circular]="true" [autoplayInterval]="10000">
          <ng-template let-circle pTemplate="item">
            <digimon-collection-circle [type]="circle.label"></digimon-collection-circle>
            <div class="text-center w-full mx-auto font-bold">
              {{ circle.label }}
            </div>
          </ng-template>
        </p-carousel>
      </div>

      <div class="flex flex-col sm:flex-row w-full">
        <button
          (click)="openCollection()"
          class="surface-ground hover:primary-background text-shadow border flex-grow border-black p-2 font-bold text-[#e2e4e6]">
          View Collection
        </button>
        <button
          *ngIf="showDeckDeleteButton()"
          (click)="deleteUserDecks($event)"
          class="bg-red-500 hover:primary-background text-shadow border flex-grow border-black p-2 font-bold text-[#e2e4e6]">
          Delete all Decks
        </button>
      </div>
      <p-confirmpopup key="deleteDecks"/>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, CollectionCircleComponent, DialogModule, CarouselModule, ConfirmPopup]
})
export class UserStatsComponent {
  @Input() save: ISave;

  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  saveStore = inject(SaveStore);

  collectionCircles = [{ label: 'BT' }, { label: 'EX' }, { label: 'ST' }, { label: 'P-' }];

  private router = inject(Router);

  openCollection() {
    this.router.navigateByUrl('/collection/' + this.save.uid);
  }

  showDeckDeleteButton() {
    return this.authService.currentUser()?.uid === this.save.uid;
  }

  deleteUserDecks(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'deleteDecks',
      message: 'Are you sure you want to delete all your Decks?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have deleted all your Decks', life: 3000 });
        this.saveStore.updateSave({ ...this.save, decks: [] });
      },
      reject: () => {},
    });
  }
}
