import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import * as uuid from 'uuid';

import { ADMINS, emptyDeck, IDeck, IDeckCard } from '../../../../models';
import { environment } from '../../../../environments/environment';
import { DeckCardGroup, groupDeckCards, levelSort, mapToDeckCards, setDeckImage } from '../../../functions';
import { AuthService } from '../../../services/auth.service';
import { MongoBackendService } from '../../../services/mongo-backend.service';
import { DialogStore } from '../../../store/dialog.store';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';
import { DeckCardComponent } from '../deck-card.component';
import { ChartContainersComponent } from '../statistics/chart-containers.component';
import { ColorSpreadComponent } from '../statistics/color-spread.component';
import { DdtoSpreadComponent } from '../statistics/ddto-spread.component';
import { TextareaModule } from 'primeng/textarea';

export interface DigimonCardImage {
  name: string;
  value: string;
}

@Component({
  selector: 'digimon-deck-dialog',
  template: `
    <div class="flex w-full flex-col gap-5">
      @if (!editable) {
        <section class="flex flex-col gap-2">
          <h2 class="m-0 truncate font-display text-3xl font-bold text-fg" [title]="deck.title">{{ deck.title || 'Untitled deck' }}</h2>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            @if (deck.user) {
              <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 text-fg">by {{ deck.user }}</span>
            }
            @for (tag of deck.tags; track tag.name) {
              <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 font-mono text-xs text-fg">{{ tag.name }}</span>
            }
          </div>
          @if (deck.description) {
            <p class="m-0 whitespace-pre-wrap leading-relaxed text-muted">{{ deck.description }}</p>
          }
        </section>
      } @else {
        <form [formGroup]="deckFormGroup" class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">Title</span>
            <input formControlName="title" placeholder="Deck name" class="w-full rounded-lg border border-line bg-ink-0 px-3 py-2 text-fg outline-none focus:border-accent" type="text" />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cover card</span>
            <p-select styleClass="w-full" [options]="cardImageOptions" formControlName="cardImage" optionLabel="name" appendTo="body"></p-select>
          </label>
          <label class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">Description</span>
            <textarea formControlName="description" placeholder="What is the plan of this deck?" class="w-full rounded-lg border border-line bg-ink-0 px-3 py-2 text-fg outline-none focus:border-accent min-h-[5rem]"></textarea>
          </label>
          @if (deck.tags?.length) {
            <div class="flex flex-wrap gap-1 md:col-span-2">
              @for (tag of deck.tags; track tag.name) {
                <span class="rounded-full border border-line bg-ink-2 px-3 py-0.5 font-mono text-xs text-fg">{{ tag.name }}</span>
              }
            </div>
          }
        </form>
      }

      <div class="flex flex-wrap gap-2">
        @if (editable) {
          <button type="button" (click)="saveDeck()" [disabled]="!deckFormGroup.dirty" class="h-10 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent disabled:opacity-40">Save changes</button>
          <button type="button" (click)="openDeck($event)" class="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink">Open in builder</button>
        } @else {
          <button type="button" (click)="viewDeck()" class="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink">View deck page</button>
          <button type="button" (click)="openDeck($event)" class="h-10 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent disabled:opacity-40">Open in builder</button>
        }
        <button type="button" (click)="copyDeck($event)" class="h-10 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent disabled:opacity-40">Copy</button>
        <button type="button" (click)="showExportDeckDialog()" class="h-10 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent disabled:opacity-40">Export</button>
        <button type="button" (click)="getLink()" class="h-10 rounded-lg border border-line bg-ink-2 px-4 text-sm font-semibold text-fg hover:border-accent disabled:opacity-40"><i class="pi pi-link mr-1"></i> Copy link</button>
        @if (editable || isAdmin) {
          <button type="button" (click)="deleteDeck($event)" class="h-10 rounded-lg border border-red-500/60 bg-ink-2 px-4 text-sm font-semibold text-red-300 hover:bg-red-500/10 ml-auto">Delete</button>
        }
      </div>

      <section class="flex flex-wrap items-end justify-around gap-6 rounded-xl border border-line bg-ink-1 p-4">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Level curve</span>
          <digimon-chart-containers [deck]="mainDeck"></digimon-chart-containers>
        </div>
        <div class="hidden flex-col gap-2 md:flex">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Card types</span>
          <digimon-ddto-spread [deck]="deck" [container]="true"></digimon-ddto-spread>
        </div>
        <div class="hidden flex-col gap-2 md:flex">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Colors</span>
          <digimon-color-spread [deck]="deck" [container]="true"></digimon-color-spread>
        </div>
      </section>

      <div class="flex flex-col gap-4">
        @for (group of groups; track group.title) {
          <section class="flex flex-col gap-1">
            <div class="flex justify-between border-b border-line px-1 pb-1">
              <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ group.title }}</span>
              <span class="font-mono text-xs text-muted">{{ group.count }}</span>
            </div>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]">
              @for (card of group.cards; track card.id) {
                <digimon-deck-card [edit]="false" [card]="card"></digimon-deck-card>
              }
            </div>
          </section>
        }
      </div>
    </div>

    <p-confirmDialog header="Save Deck?" rejectButtonStyleClass="p-button-outlined" key="save"></p-confirmDialog>
    <p-confirmDialog header="Open Deck" rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
    <p-confirmDialog
      header="Delete Confirmation"
      icon="pi pi-exclamation-triangle"
      key="Delete"
      rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
  `,
  standalone: true,
  imports: [
    NgFor,
    DeckCardComponent,
    DdtoSpreadComponent,
    ChartContainersComponent,
    ColorSpreadComponent,
    NgIf,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService],
})
export class DeckDialogComponent {
  changeDetection = inject(ChangeDetectorRef);

  saveStore = inject(SaveStore);
  websiteStore = inject(WebsiteStore);
  dialogStore = inject(DialogStore);
  digimonCardStore = inject(DigimonCardStore);

  deck: IDeck = emptyDeck;
  editable = true;

  deckFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    cardImage: new UntypedFormControl({
      name: 'BT1-001 - Yokomon',
      value: 'BT1-001',
    }),
  });

  cardImageOptions: DigimonCardImage[] = [];

  mainDeck: IDeckCard[] = [];
  groups: DeckCardGroup[] = [];

  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mongoBackendService: MongoBackendService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      this.deck = this.dialogStore.deck().deck;
      this.editable = this.dialogStore.deck().editable;

      this.mainDeck = mapToDeckCards(this.deck.cards, this.digimonCardStore.cards());
      this.groups = groupDeckCards(levelSort(this.mainDeck));

      this.deckFormGroup = new UntypedFormGroup({
        title: new UntypedFormControl(this.deck.title),
        description: new UntypedFormControl(this.deck.description),
        cardImage: new UntypedFormControl(this.getCardImage(this.deck.imageCardId)),
      });

      this.cardImageOptions = this.createImageOptions();

      this.changeDetection.detectChanges();
    });

    this.isAdmin = ADMINS.some(
      (admin) => admin.admin && admin.id === this.authService.currentUser()?.uid,
    );
  }

  viewDeck() {
    this.router.navigateByUrl(`/deck/${this.deck.id}`);
    this.dialogStore.showDeckDialog(false);
  }

  openDeck(event: Event) {
    if (this.editable) {
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl(`deckbuilder/user/${this.authService.currentUser().uid}/deck/${this.deck.id}`);
      } else {
        this.websiteStore.updateDeck(this.deck);
        this.router.navigateByUrl('deckbuilder');
      }
      this.dialogStore.showDeckDialog(false);
    } else {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        message: 'You are about to open this deck. Are you sure?',
        accept: () => {
          this.websiteStore.updateDeck(this.deck);
          this.router.navigateByUrl('/deckbuilder/user/' + this.deck.userId + '/deck/' + this.deck.id);
          this.dialogStore.showDeckDialog(false);
        },
      });
    }
  }

  deleteDeck(event: Event) {
    if (this.editable) {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        key: 'Delete',
        message: 'You are about to permanently delete this deck. Are you sure?',
        accept: () => {
          this.saveStore.deleteDeck(this.deck);
          this.messageService.add({
            severity: 'success',
            summary: 'Deck deleted!',
            detail: 'Deck was deleted successfully!',
          });
          this.dialogStore.showDeckDialog(false);
        },
      });
    } else {
      this.confirmationService.confirm({
        target: event.target ?? undefined,
        key: 'Delete',
        message: 'You are about to permanently delete this deck. Are you sure?',
        accept: () => {
          this.mongoBackendService.deleteDeck(this.deck.id).pipe(first()).subscribe();
          this.messageService.add({
            severity: 'success',
            summary: 'Deck deleted!',
            detail: 'Deck was deleted successfully!',
          });
          this.dialogStore.showDeckDialog(false);
        },
      });
    }
  }

  copyDeck(event: Event) {
    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: 'You are about to copy this deck. Are you sure?',
      accept: () => {
        this.saveStore.importDeck({ ...this.deck, id: uuid.v4() });
        this.messageService.add({
          severity: 'success',
          summary: 'Deck copied!',
          detail: 'Deck was copied successfully!',
        });
        this.dialogStore.showDeckDialog(false);
      },
    });
  }

  showExportDeckDialog() {
    this.dialogStore.updateExportDeckDialog({ show: true, deck: this.deck });
  }

  createImageOptions(): DigimonCardImage[] {
    return (
      this.mainDeck
        .filter((card) => card && card.name && card.name.english)
        .map((card) => ({
          name: `${card.id} - ${card.name.english}`,
          value: card.id,
        })) ?? []
    );
  }

  getLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.editable
      ? `${environment.appUrl}/deckbuilder/user/${this.authService.currentUser()?.uid}/deck/${this.deck.id}`
      : `${environment.appUrl}/deck/${this.deck.id}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.messageService.add({
      severity: 'success',
      summary: 'Deck-Link saved!',
      detail: 'The deck-link was saved to your clipboard!',
    });
  }

  saveDeck() {
    const deck: IDeck = {
      ...this.deck,
      title: this.deckFormGroup.get('title')?.value,
      description: this.deckFormGroup.get('description')?.value,
      imageCardId: this.deckFormGroup.get('cardImage')?.value.value,
    };

    this.saveStore.saveDeck(deck);
    this.messageService.add({
      severity: 'success',
      summary: 'Deck saved!',
      detail: 'The deck was saved successfully!',
    });
    this.dialogStore.showDeckDialog(false);
  }

  private getCardImage(imageCardId: string): DigimonCardImage {
    if (!this.deck.cards || this.deck.cards.length === 0) {
      return { name: 'BT1-001 - Yokomon', value: 'BT1-001' };
    }

    let foundCard = this.digimonCardStore.cardsMap().get(imageCardId);
    if (foundCard) {
      return {
        name: `${foundCard!.id} - ${foundCard!.name}`,
        value: foundCard!.id,
      };
    } else {
      const imageCard = setDeckImage(this.deck, this.digimonCardStore.cards());
      return {
        name: `${imageCard!.id} - ${imageCard!.name}`,
        value: imageCard!.id,
      };
    }
  }
}
