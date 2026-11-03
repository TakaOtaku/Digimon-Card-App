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
    <section class="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-ink-1 p-5 text-fg">
      <div class="flex min-w-0 flex-[1_1_16rem] items-center gap-4">
        @if (save.photoUrl) {
          <img class="h-16 w-16 shrink-0 rounded-full object-cover" [alt]="save.displayName || 'Profile picture'" [src]="save.photoUrl" />
        } @else {
          <span class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink-2 text-2xl text-muted"><i class="pi pi-user"></i></span>
        }
        <div class="flex min-w-0 flex-col gap-1">
          <h1 class="m-0 truncate text-3xl font-bold">{{ save.displayName || 'Guest' }}</h1>
          <span class="font-mono text-sm text-muted">{{ save.decks?.length ?? 0 }} decks · {{ ownedCards() }} cards owned</span>
        </div>
      </div>

      <div class="hidden flex-row gap-3 sm:flex">
        @for (circle of collectionCircles; track circle.label) {
          <div class="flex flex-col items-center gap-1">
            <digimon-collection-circle [type]="$any(circle.label)"></digimon-collection-circle>
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ circle.label === 'P-' ? 'P' : circle.label }}</span>
          </div>
        }
      </div>

      <p-carousel class="w-full sm:hidden" [value]="collectionCircles" [numVisible]="1" [circular]="true" [autoplayInterval]="10000">
        <ng-template let-circle pTemplate="item">
          <digimon-collection-circle [type]="circle.label"></digimon-collection-circle>
          <div class="mx-auto w-full text-center font-bold">{{ circle.label }}</div>
        </ng-template>
      </p-carousel>

      <div class="flex flex-wrap gap-2">
        <button type="button" (click)="openCollection()" class="h-11 rounded-lg bg-accent px-4 font-semibold text-accent-ink">View collection</button>
        <button
          *ngIf="showDeckDeleteButton()"
          type="button"
          (click)="deleteUserDecks($event)"
          class="h-11 rounded-lg border border-red-500/60 bg-ink-2 px-4 font-semibold text-red-300 hover:bg-red-500/10">
          Delete all decks
        </button>
      </div>
      <p-confirmpopup key="deleteDecks"/>
    </section>
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

  ownedCards(): number {
    return (this.save?.collection ?? []).filter((card) => card.count > 0).length;
  }

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
      reject: () => { },
    });
  }
}
