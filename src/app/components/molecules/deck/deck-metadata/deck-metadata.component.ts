import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ColorList, IColor, tagsList} from '../../../../../models';
import {ITag} from '../../../../../models/interfaces/tag.interface';
import {ObscenityPipe} from "../../../../pipes/obscenity.pipe";

@Component({
  selector: 'digimon-deck-metadata',
  templateUrl: './deck-metadata.component.html',
})
export class DeckMetadataComponent implements OnChanges {
  @Input() title = '';
  @Input() description = '';
  @Input() tags: ITag[];
  @Input() selectedColor: any;

  @Output() titleChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() tagsChange = new EventEmitter<ITag[]>();
  @Output() selectedColorChange = new EventEmitter<IColor>();

  titleInput = '';
  descriptionInput = '';

  tagsList: ITag[] = tagsList;
  colors = ColorList;

  private obscenity = new ObscenityPipe();

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }
    if (changes['title']) {
      this.titleInput = this.obscenity.transform(this.title);
    }

    if (changes['description']) {
      this.descriptionInput = this.obscenity.transform(this.description);
    }
  }

  changeColor(color: any) {
    this.selectedColor = color;
    this.selectedColorChange.emit(color);
  }
}
