import { NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { first } from 'rxjs';
import { ColorList, IColor, IDeck, tagsList } from '../../../../models';
import { ITag } from '../../../../models/interfaces/tag.interface';
import { ColorMap } from '../../../../models/maps/color.map';
import { deckIsValid } from '../../../functions/digimon-card.functions';
import { AuthService } from '../../../services/auth.service';
import { DigimonBackendService } from '../../../services/digimon-backend.service';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { emptyDeck } from '../../../store/reducers/digimon.reducers';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';
import { DeckActions } from './../../../store/digimon.actions';

@Component({
  selector: 'digimon-change-accessorie-dialog',
  template: `
    <p-selectButton
      class="mt-10 text-center"
      [options]="colorList"
      [(ngModel)]="color"
      optionLabel="name">
      <ng-template let-item>
        <span [ngStyle]="{ color: colorMap.get(item.name) }">{{
          item.name
        }}</span>
      </ng-template>
    </p-selectButton>

    <div class="inline-flex w-full">
      <span class="p-float-label mt-5 w-1/2">
        <input
          class="w-full"
          id="float-input"
          type="text"
          pInputText
          [(ngModel)]="title" />
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
      <input
        class="w-full"
        id="float-input2"
        type="text"
        pInputText
        [(ngModel)]="description" />
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
  standalone: true,
  imports: [
    SelectButtonModule,
    FormsModule,
    NgStyle,
    InputTextModule,
    AutoCompleteModule,
    ButtonModule,
  ],
  providers: [MessageService],
})
export class ChangeAccessorieDialogComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() deck: IDeck = JSON.parse(JSON.stringify(emptyDeck));

  @Output() onClose = new EventEmitter<boolean>();

  websiteStore = inject(WebsiteStore);
  saveStore = inject(SaveStore);

  colorList: IColor[] = ColorList;
  colorMap = ColorMap;

  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  title = '';
  description = '';
  tags: ITag[] = [];
  color = { name: 'White', img: 'assets/images/decks/white.svg' };

  private digimonCardStore = inject(DigimonCardStore);
  constructor(
    private confirmationService: ConfirmationService,
    private digimonCardService: DigimonBackendService,
    private auth: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
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
    this.saveStore.saveDeck({
      ...this.deck,
      title: this.title,
      description: this.description,
      tags: this.tags,
      color: this.color,
    });
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
        this.digimonCardService
          .updateDeck(deck, this.auth.userData, this.digimonCardStore.cards())
          .pipe(first())
          .subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Deck shared!',
          detail: 'Deck was shared successfully!',
        });
      },
    });
  }

  deckIsValid(deck: IDeck): boolean {
    const error = deckIsValid(deck, this.digimonCardStore.cards());
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
