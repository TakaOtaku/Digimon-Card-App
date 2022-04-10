import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {ConfirmationService, MessageService} from "primeng/api";
import {ColorList, colorMap, IColor, IDeck} from "../../../../models";
import {ITag} from "../../../../models/interfaces/tag.interface";
import {tagsList} from "../../../../models/tags.data";
import {AuthService} from "../../../service/auth.service";
import {DatabaseService} from "../../../service/database.service";
import {changeDeck} from "../../../store/digimon.actions";

@Component({
  selector: 'digimon-change-accessorie-dialog',
  templateUrl: './change-accessorie-dialog.component.html'
})
export class ChangeAccessorieDialogComponent {
  @Input() show: boolean = false;
  @Input() deck: IDeck;

  @Input() title: string;
  @Input() description: string;
  @Input() color: IColor;
  @Input() tags: ITag[];
  @Input() cardCount?: number;

  @Input() width?: string = '50vw';

  @Output() onClose = new EventEmitter<boolean>();

  colorList: IColor[] = ColorList;
  colorMap = colorMap;

  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private db: DatabaseService,
    private auth: AuthService,
    private messageService: MessageService
  ) { }

  saveDeck(): void {
    this.store.dispatch(changeDeck({
      deck: {...this.deck,
        title: this.title,
        description: this.description,
        tags: this.tags,
        color: this.color}
    }));
    this.onClose.emit(false);
    this.messageService.add({severity:'success', summary:'Deck saved!', detail:'Deck Accessory was saved successfully!'});
  }

  filterTags(event: any) {
    let filtered : ITag[] = [];
    let query = event.query;

    for(let i = 0; i < this.tagsList.length; i++) {
      let tag = this.tagsList[i];
      if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }

    this.filteredTags = filtered;
  }

  shareDeck(): void {
    const deck: IDeck = {
      ...this.deck,
      title: this.title,
      description: this.description,
      tags: this.tags,
      color: this.color
      };

    if(this.cardCount !== 50) {
      this.messageService.add({severity:'error', summary:'Deck is not ready!', detail:'Deck was can not be shared! You don\'t have 50 cards.'});
      return;
    }

    if(!deck.title) {
      this.messageService.add({severity:'error', summary:'Deck is not ready!', detail:'Deck was can not be shared! You need a title.'});
      return;
    }

    this.confirmationService.confirm({
      message: 'You are about to share the deck. Are you sure?',
      accept: () => {
        this.db.shareDeck(deck, this.auth.userData);
        this.messageService.add({severity:'success', summary:'Deck shared!', detail:'Deck was shared successfully!'});
      }
    });
  }
}
