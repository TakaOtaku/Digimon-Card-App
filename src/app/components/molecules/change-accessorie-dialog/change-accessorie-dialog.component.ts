import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ColorList, ColorMap, ICard, IColor, IDeck } from '../../../../models';
import { ITag } from '../../../../models/interfaces/tag.interface';
import { tagsList } from '../../../../models/tags.data';
import { deckIsValid } from '../../../functions/digimon-card.functions';
import { AuthService } from '../../../service/auth.service';
import { DatabaseService } from '../../../service/database.service';
import { saveDeck } from '../../../store/digimon.actions';
import { selectAllCards } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-change-accessorie-dialog',
  templateUrl: './change-accessorie-dialog.component.html',
})
export class ChangeAccessorieDialogComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() show: boolean = false;
  @Input() deck: IDeck;

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
    private db: DatabaseService,
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
        this.db.shareDeck(deck, this.auth.userData);
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
