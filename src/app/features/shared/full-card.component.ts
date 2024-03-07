import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component, computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { Subject } from 'rxjs';
import { DigimonCard, DRAG, dummyCard } from '../../../models';
import { withoutJ } from '../../functions';
import { SaveStore } from '../../store/save.store';
import { WebsiteStore } from '../../store/website.store';
import { CardImageComponent } from './card-image.component';

@Component({
  selector: 'digimon-full-card',
  template: `
    <div
      [pDraggable]="'toDeck'"
      (onDragStart)="setDraggedCard(card)"
      class="relative inline-flex w-full transition-transform hover:scale-105">
      <div (click)="click()" (contextmenu)="rightclick()">
        <digimon-card-image
          [card]="card"
          [count]="count"></digimon-card-image>
      </div>

      <ng-container>
        <span
          *ngIf="!collectionOnly && deckBuilder && countInDeck()"
          class="text-shadow-white absolute right-1 z-[100] px-1 text-3xl font-black text-orange-500"
          [ngClass]="{
            'bottom-1': !collectionMode(),
            ' bottom-10': collectionMode()
          }">
          {{ countInDeck() }}<span class="pr-1 text-sky-700">/</span
          >{{
            card.cardNumber === 'BT6-085' ||
            card.cardNumber === 'EX2-046' ||
            card.cardNumber === 'BT11-061'
              ? 50
              : 4
          }}
        </span>
      </ng-container>

      <div
        *ngIf="collectionMode() || onlyView"
        class="flex absolute bottom-2 left-1/2 transform -translate-x-1/2 h-8 w-[calc(100%-1rem)] flex-row rounded-lg bg-transparent">
        <button
          *ngIf="!onlyView"
          (click)="decreaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-l text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          min="0"
          [ngClass]="{ 'mx-auto': onlyView }"
          class="primary-background text-md flex w-1/3 cursor-default appearance-none items-center text-center font-semibold text-[#e2e4e6] outline-none focus:outline-none md:text-base"
          [(ngModel)]="count"
          [disabled]="onlyView"
          (change)="changeCardCount($event, card.id)" />
        <button
          *ngIf="!onlyView"
          (click)="increaseCardCount(card.id)"
          class="primary-background h-full w-1/3 cursor-pointer rounded-r text-[#e2e4e6] outline-none">
          <span class="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./full-card.component.scss'],
  standalone: true,
  imports: [
    DragDropModule,
    CardImageComponent,
    NgIf,
    NgClass,
    FormsModule,
    DialogModule,
    AsyncPipe,
  ],
})
export class FullCardComponent {
  @Input() card: DigimonCard = JSON.parse(JSON.stringify(dummyCard));
  @Input() count: number;

  @Input() width?: string;
  @Input() compact?: boolean = false;
  @Input() deckBuilder?: boolean = false;
  @Input() biggerCards?: boolean = false;

  @Input() collectionOnly: boolean = false;

  @Input() onlyView!: boolean;

  @Output() viewCard = new EventEmitter<DigimonCard>();

  websiteStore = inject(WebsiteStore);
  saveStore = inject(SaveStore);

  collectionMode = this.saveStore.collectionMode;

  countInDeck = computed(
    () =>
      this.websiteStore
        .deck()
        .cards.find((value) => value.id === withoutJ(this.card.id))?.count ?? 0,
  );

  addCardToDeck() {
    if (this.collectionOnly) {
      this.viewCard.emit(this.card);
      return;
    }
    this.websiteStore.addCardToDeck(this.card.id);
  }

  showCardDetails() {
    this.viewCard.emit(this.card);
  }

  changeCardCount(event: any, id: string) {
    if (event.target.value <= 0) {
      return;
    }
    const count = event.target.value;
    const newId = withoutJ(id);

    this.saveStore.updateCard(newId, count);
  }

  increaseCardCount(id: string) {
    const count = ++this.count;
    const newId = withoutJ(id);
    this.saveStore.updateCard(newId, count);
  }

  decreaseCardCount(id: string) {
    if (this.count <= 0) {
      return;
    }
    const count = --this.count;
    const newId = withoutJ(id);

    this.saveStore.updateCard(newId, count);
  }

  setDraggedCard(card: DigimonCard) {
    this.websiteStore.updateDraggedCard({ card: card, drag: DRAG.Collection });
  }

  click() {
    if (this.collectionOnly) {
      this.showCardDetails();
      return;
    }
    this.addCardToDeck();
  }

  rightclick() {
    this.showCardDetails();
  }
}
