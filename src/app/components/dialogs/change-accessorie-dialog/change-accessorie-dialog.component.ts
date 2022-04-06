import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {MessageService} from "primeng/api";
import {ColorList, colorMap, IColor, IDeck} from "../../../../models";
import {ITag} from "../../../../models/interfaces/tag.interface";
import {tagsList} from "../../../../models/tags.data";
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

  @Input() width?: string = '50vw';

  @Output() onClose = new EventEmitter<boolean>();

  colorList: IColor[] = ColorList;
  colorMap = colorMap;

  tagsList: ITag[] = tagsList;
  filteredTags: ITag[];

  constructor(
    private store: Store,
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
}
