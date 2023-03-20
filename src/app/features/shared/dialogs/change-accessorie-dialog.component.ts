import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, takeUntil } from 'rxjs';
import { ColorList, ICard, IColor, IDeck, tagsList } from '../../../../models';
import { ITag } from '../../../../models/interfaces/tag.interface';
import { ColorMap } from '../../../../models/maps/color.map';
import { deckIsValid } from '../../../functions/digimon-card.functions';
import { AuthService } from '../../../service/auth.service';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import { saveDeck } from '../../../store/digimon.actions';
import { selectAllCards } from '../../../store/digimon.selectors';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-change-accessorie-dialog',
  template: `
    <p-selectButton class="mt-10 text-center" [options]="colorList" [(ngModel)]="color" optionLabel="name">
      <ng-template let-item>
        <span [ngStyle]="{ color: colorMap.get(item.name) }">{{ item.name }}</span>
      </ng-template>
    </p-selectButton>

    <div class="inline-flex w-full">
      <span class="p-float-label mt-5 w-1/2">
        <input class="w-full" id="float-input" type="text" pInputText [(ngModel)]="title" />
        <label for="float-input">Deck Name</label>
      </span>

      <span class="p-float-label ml-5 mt-5 w-1/2">
        <p-autoComplete
          panelStyleClass="w-full"
          id="float-input3"
          [(ngModel)]="tags"
          [suggestions]="filteredTags"
          (completeMethod)="filterTags($event)"
          field="name"
          [multiple]="true">
        </p-autoComplete>
        <label for="float-input3">Tags</label>
      </span>
    </div>

    <span class="p-float-label mt-6 w-full">
      <input class="w-full" id="float-input2" type="text" pInputText [(ngModel)]="description" />
      <label for="float-input2">Description</label>
    </span>

    <div class="mt-5 inline-flex">
      <div class="flex w-full justify-end">
        <button class="m-2" pButton (click)="shareDeck()">Share</button>
      </div>

      <div class="flex w-full justify-end">
        <button class="m-2" pButton (click)="saveDeck()">Save</button>
      </div>
    </div>
  `,
})
export class ChangeAccessorieDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() deck: IDeck = emptyDeck;

  @Output() onClose = new EventEmitter<boolean>();

  colorList: IColor[] = ColorList;
  colorMap = ColorMap;

  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  title = '';
  description = '';
  tags: ITag[] = [];
  color = { name: 'White', img: 'assets/decks/white.svg' };

  private allCards: ICard[] = [];
  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private digimonCardService: DigimonBackendService,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  ngOnInit(): void {
    this.store
      .select(selectAllCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allCards) => (this.allCards = allCards));
    this.setData(this.deck);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['deck']) {
      this.setData(changes['deck'].currentValue as unknown as IDeck);
    }
  }

  setData(deck: IDeck) {
    this.title = deck.title ?? '';
    this.description = deck.description ?? '';
    this.tags = deck.tags ? deck.tags : [];
    this.color = deck.color;
  }

  saveDeck(): void {
    this.store.dispatch(
      saveDeck({
        deck: {
          ...this.deck,
          title: this.title,
          description: this.description,
          tags: this.tags,
          color: this.color,
        },
      })
    );
    this.onClose.emit(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Deck saved!',
      detail: 'Deck Accessory was saved successfully!',
    });
  }

  shareDeck(): void {
    const deck: IDeck = {
      ...this.deck,
      title: this.title,
      description: this.description,
      tags: this.tags,
      color: this.color,
    };

    if (!this.deckIsValid(deck)) {
      return;
    }

    this.confirmationService.confirm({
      message: 'You are about to share the deck. Are you sure?',
      accept: () => {
        this.digimonCardService.updateDeck(deck, this.auth.userData).pipe(first()).subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Deck shared!',
          detail: 'Deck was shared successfully!',
        });
      },
    });
  }

  deckIsValid(deck: IDeck): boolean {
    const error = deckIsValid(deck, this.allCards);
    if (error !== '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Deck is not ready!',
        detail: error,
      });
    }
    return true;
  }

  filterTags(event: any) {
    let filtered: ITag[] = [];
    let query = event.query;

    for (let i = 0; i < this.tagsList.length; i++) {
      let tag = this.tagsList[i];
      if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }

    this.filteredTags = filtered;
  }
}
