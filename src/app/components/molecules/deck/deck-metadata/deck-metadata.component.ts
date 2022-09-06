import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColorList, IColor, tagsList } from '../../../../../models';
import { ITag } from '../../../../../models/interfaces/tag.interface';

@Component({
  selector: 'digimon-deck-metadata',
  templateUrl: './deck-metadata.component.html',
})
export class DeckMetadataComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() tags: ITag[];
  @Input() selectedColor: any;

  @Output() titleChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() tagsChange = new EventEmitter<ITag[]>();
  @Output() selectedColorChange = new EventEmitter<IColor>();

  tagsList: ITag[] = tagsList;
  colors = ColorList;

  changeColor(color: any) {
    this.selectedColor = color;
    this.selectedColorChange.emit(color);
  }
}
